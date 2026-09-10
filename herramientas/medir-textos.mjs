import { abrirChromium } from './navegador.mjs';
import { readFileSync } from 'node:fs';
const b64 = f => readFileSync(f).toString('base64');
const css = [400,600,700].map(w=>`@font-face{font-family:'Archivo';font-weight:${w};src:url(data:font/woff2;base64,${b64(`archivo-latin-${w}-normal.woff2`)}) format('woff2');}`).join('');

// Cada pieza con el ancho real de su caja y su rol tipográfico
const PIEZAS = JSON.parse(readFileSync('piezas.json','utf8'));

const b = await abrirChromium();
const p = await b.newPage({ viewport:{width:420,height:900} });
await p.setContent(`<style>${css}body{margin:0}</style><div id="c"></div>`);
await p.evaluate(async()=>{ for(const w of [400,600,700]) await document.fonts.load(`${w} 17px "Archivo"`); await document.fonts.ready; });

const out = await p.evaluate((PIEZAS)=>{
  const ROL = {
    h1:      {size:28, lh:1.15, w:700},
    h2:      {size:22, lh:1.25, w:700},
    cuerpo:  {size:17, lh:1.55, w:400},
    fuerte:  {size:17, lh:1.55, w:600},
    pie:     {size:14, lh:1.45, w:400},
    tarjeta: {size:17, lh:1.55, w:600},
  };
  const c = document.getElementById('c');
  return PIEZAS.map(x=>{
    const r = ROL[x.rol];
    c.innerHTML = `<div id="m" style="font-family:'Archivo';font-size:${r.size}px;line-height:${r.lh};font-weight:${r.w};width:${x.ancho}px;">${x.texto}</div>`;
    const el = document.getElementById('m');
    const alto = el.getBoundingClientRect().height;
    const renglones = Math.round(alto / (r.size * r.lh));
    return { id:x.id, rol:x.rol, ancho:x.ancho, chars:x.texto.length, renglones, alto:Math.round(alto), max:x.max, cabe: renglones <= x.max };
  });
}, PIEZAS);

const mal = out.filter(o=>!o.cabe);
console.log('| Pieza | Rol | Caja | Caracteres | Renglones | Máx | ¿Cabe? |');
console.log('|---|---|---|---|---|---|---|');
for (const o of out) console.log(`| ${o.id} | ${o.rol} | ${o.ancho} px | ${o.chars} | ${o.renglones} | ${o.max} | ${o.cabe?'sí':'**NO**'} |`);
console.log(`\n${mal.length===0 ? 'Todas las piezas caben.' : mal.length+' pieza(s) se pasan: '+mal.map(m=>m.id).join(', ')}`);
await b.close();
process.exit(mal.length ? 1 : 0);
