import { abrirChromium } from '../../herramientas/navegador.mjs';

const ARCHIVOS = [
  ['PortadaMovil.dc.html', 390, 3900],
  ['GiroMovil.dc.html',    390, 4200],
  ['PortadaEscritorio.dc.html', 1280, 2700],
  ['Anatomia.dc.html',     1280, 1180],
];

const b = await abrirChromium();
const total = { fallas: [], filas: [] };

for (const [f,w,h] of ARCHIVOS) {
  const p = await b.newPage({ viewport:{width:w,height:h} });
  await p.goto('file://'+process.cwd()+'/'+f);
  await p.evaluate(()=>document.fonts.ready);
  await p.waitForTimeout(1800);

  const r = await p.evaluate(() => {
    const lin = c => { c/=255; return c<=0.04045 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4); };
    const L = ([r,g,bb]) => 0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(bb);
    const cr = (a,bb) => { const la=L(a), lb=L(bb), hi=Math.max(la,lb), lo=Math.min(la,lb); return (hi+0.05)/(lo+0.05); };
    const rgb = s => { const m=s.match(/[\d.]+/g); return m? [+m[0],+m[1],+m[2], m[3]===undefined?1:+m[3]] : null; };
    const fondoDe = el => {
      let n = el;
      while (n && n !== document.documentElement) {
        const c = rgb(getComputedStyle(n).backgroundColor);
        if (c && c[3] > 0.5) return c.slice(0,3);
        n = n.parentElement;
      }
      return [255,255,255];
    };

    const fallasContraste = [];
    let minRatio = 99, minInfo = '';
    for (const el of document.querySelectorAll('*')) {
      const txt = [...el.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).join('');
      if (!txt) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none') continue;
      const fg = rgb(cs.color); if (!fg) continue;
      const bg = fondoDe(el);
      const ratio = cr(fg.slice(0,3), bg);
      const px = parseFloat(cs.fontSize), peso = parseInt(cs.fontWeight)||400;
      const grande = px >= 24 || (px >= 18.66 && peso >= 700);
      const piso = grande ? 3 : 4.5;
      if (ratio < minRatio) { minRatio = ratio; minInfo = `${txt.slice(0,28)} · ${cs.color} sobre rgb(${bg}) · ${px}px/${peso}`; }
      if (ratio < piso) fallasContraste.push({ txt: txt.slice(0,42), ratio: +ratio.toFixed(2), piso, px, peso, color: cs.color, fondo: `rgb(${bg})` });
    }

    // objetivos táctiles: enlaces, y los bloques que el sistema usa como control
    // aria-hidden = decorativo: no es objetivo de nada, no se le exige tamaño
    const controles = [...document.querySelectorAll('a, [aria-label], nav > *')]
      .filter(el => !el.closest('[aria-hidden="true"]'))
      .concat([...document.querySelectorAll('div')].filter(d => /border-radius:\s*8px/.test(d.getAttribute('style')||'') && /height:\s*4[48]px/.test(d.getAttribute('style')||'')));
    let minTactil = 9999, tactilInfo = '', fallasTactil = [];
    for (const el of controles) {
      const b = el.getBoundingClientRect();
      if (b.width < 1 || b.height < 1) continue;
      const m = Math.min(b.width, b.height);
      if (m < minTactil) { minTactil = m; tactilInfo = (el.textContent||el.getAttribute('aria-label')||'').trim().slice(0,26); }
      if (m < 44) fallasTactil.push({ txt:(el.textContent||el.getAttribute('aria-label')||'').trim().slice(0,32), w:Math.round(b.width), h:Math.round(b.height) });
    }

    const cuerpo = document.body.innerText;
    return {
      minRatio: +minRatio.toFixed(2), minInfo,
      fallasContraste,
      minTactil: Math.round(minTactil), tactilInfo, fallasTactil,
      huecos: (cuerpo.match(/PENDIENTE/g)||[]).length,
      porConfirmar: (cuerpo.match(/__POR_CONFIRMAR__/g)||[]).length,
      // ¿se coló una cifra que parezca dato de negocio?
      sospechosos: (cuerpo.match(/\b\d{2,3}[ -]?\d{3}[ -]?\d{4}\b|\$\s?\d|\b\d{1,2}\s?%|\b\d{1,2}:\d{2}\b/g)||[]),
    };
  });
  total.filas.push([f, r]);
  await p.close();
}
await b.close();

console.log('| Artboard | Contraste mínimo | Táctil mínimo | Huecos | __POR_CONFIRMAR__ | Cifras sospechosas | Veredicto |');
console.log('|---|---|---|---|---|---|---|');
let global = 'CUMPLE';
for (const [f,r] of total.filas) {
  const ok = r.fallasContraste.length===0 && r.fallasTactil.length===0 && r.sospechosos.length===0;
  if (!ok) global = 'NO CUMPLE';
  console.log(`| ${f.replace('.dc.html','')} | ${r.minRatio}:1 | ${r.minTactil} px | ${r.huecos} | ${r.porConfirmar} | ${r.sospechosos.length} | ${ok?'CUMPLE':'NO CUMPLE'} |`);
}
console.log('\n--- detalle ---');
for (const [f,r] of total.filas) {
  if (r.fallasContraste.length) { console.log(`\n${f} · contraste:`); r.fallasContraste.forEach(x=>console.log('  ', JSON.stringify(x))); }
  if (r.fallasTactil.length)   { console.log(`\n${f} · táctil:`);     r.fallasTactil.forEach(x=>console.log('  ', JSON.stringify(x))); }
  if (r.sospechosos.length)    { console.log(`\n${f} · cifras:`, r.sospechosos.join(' | ')); }
}
console.log('\nVEREDICTO GLOBAL:', global);
