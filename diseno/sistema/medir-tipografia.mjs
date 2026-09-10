import { abrirChromium } from '../../herramientas/navegador.mjs';
import { readFileSync, statSync } from 'node:fs';

const FAMS = [['Archivo','archivo'],['Inter','inter'],['Barlow','barlow']];
const b64 = f => readFileSync(f).toString('base64');
const face = (fam,slug,w) =>
  `@font-face{font-family:'${fam}';font-weight:${w};font-style:normal;font-display:block;src:url(data:font/woff2;base64,${b64(`${slug}-latin-${w}-normal.woff2`)}) format('woff2');}`;
const css = FAMS.flatMap(([fam,slug]) => [400,600,700].map(w=>face(fam,slug,w))).join('\n');

const PARRAFO='Aceptamos joyería de oro, herramienta, electrónica y maquinaria. Te decimos cuánto en minutos y el bien se queda resguardado hasta que lo recuperes.';
const TITULARES=['Empeño y préstamo','Renta de maquinaria y equipo','Taller y refaccionaria'];
const ETIQUETAS=['RENTA DE MAQUINARIA Y EQUIPO','FLETES Y LOGÍSTICA'];
const DIAC='áéíóúüñÁÉÍÓÚÜÑ¿¡«»';

const b = await abrirChromium();
const p = await b.newPage({ viewport:{width:900,height:900} });
await p.setContent(`<style>${css}</style><body><canvas id="c"></canvas></body>`);
await p.evaluate(async (FAMS)=>{
  for(const [fam] of FAMS) for(const w of [400,600,700]) await document.fonts.load(`${w} 17px "${fam}"`);
  await document.fonts.ready;
}, FAMS);
await p.waitForTimeout(500);

const out = await p.evaluate(({FAMS,PARRAFO,TITULARES,ETIQUETAS,DIAC})=>{
  const ctx=document.getElementById('c').getContext('2d');
  const M=(fam,size,weight,txt,ls=0)=>{
    ctx.font=`${weight} ${size}px "${fam}"`;
    ctx.letterSpacing=`${ls}px`;
    const m=ctx.measureText(txt);
    return {w:m.width, asc:m.actualBoundingBoxAscent, desc:m.actualBoundingBoxDescent};
  };
  const r={};
  for(const [fam] of FAMS){
    if(!document.fonts.check(`700 17px "${fam}"`)) { r[fam]={ERROR:'no cargó'}; continue; }
    const x=M(fam,170,400,'x').asc/10, H=M(fam,170,400,'H').asc/10;
    const desc=M(fam,170,400,'gyp').desc/10;
    const wPar=M(fam,17,400,PARRAFO).w;
    r[fam]={
      xh:+x.toFixed(2), cap:+H.toFixed(2), ratio:+(x/H).toFixed(3), desc:+desc.toFixed(2),
      anchoMedio:+(wPar/PARRAFO.length).toFixed(2),
      cpl:Math.floor(350/(wPar/PARRAFO.length)),
      tit:TITULARES.map(t=>({t,w:Math.round(M(fam,28,700,t).w)})),
      eti:ETIQUETAS.map(t=>({t,w:Math.round(M(fam,13,700,t,13*0.12).w)})),
      wm:Math.round(M(fam,22,700,'MASTERS',22*0.03).w),
      falt:[...DIAC].filter(c=>M(fam,40,400,c).w===0),
      // ¿a qué tamaño cabe el titular más largo en 350?
      h1Cabe:(()=>{ for(let s=28;s>=18;s--){ if(M(fam,s,700,'Renta de maquinaria y equipo').w<=350) return s; } return null; })(),
      // altura de x real a 17px, en px
      xh17:+(M(fam,170,400,'x').asc/10).toFixed(2)
    };
  }
  return r;
},{FAMS,PARRAFO,TITULARES,ETIQUETAS,DIAC});

for(const [fam,slug] of FAMS){
  const kb=[400,600,700].reduce((a,w)=>a+statSync(`${slug}-latin-${w}-normal.woff2`).size,0)/1024;
  out[fam].kb=+kb.toFixed(1);
}
console.log(JSON.stringify(out,null,1));
await b.close();
