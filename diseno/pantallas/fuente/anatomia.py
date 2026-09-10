# -*- coding: utf-8 -*-
"""Anatomía: la misma sección con las medidas anotadas.
Todo lo que aparece aquí está medido en navegador, no dibujado a ojo."""
from piezas import *

AZ = "#A8482A"   # tinta de cota, ajena al sistema del sitio a propósito

def cota_v(top, alto, texto, left=0):
    """Cota vertical: dos topes y una etiqueta."""
    return (f'<div style="position:absolute;left:{left}px;top:{top}px;height:{alto}px;width:1px;background:{AZ};"></div>'
            f'<div style="position:absolute;left:{left-4}px;top:{top}px;width:9px;height:1px;background:{AZ};"></div>'
            f'<div style="position:absolute;left:{left-4}px;top:{top+alto-1}px;width:9px;height:1px;background:{AZ};"></div>'
            f'<div style="position:absolute;left:{left+7}px;top:{top+alto//2-9}px;font-family:ui-monospace,Menlo,monospace;'
            f'font-size:11px;color:{AZ};background:#FFF;padding:1px 4px;white-space:nowrap;">{texto}</div>')

def cota_h(left, ancho, texto, top=0):
    return (f'<div style="position:absolute;top:{top}px;left:{left}px;width:{ancho}px;height:1px;background:{AZ};"></div>'
            f'<div style="position:absolute;top:{top-4}px;left:{left}px;height:9px;width:1px;background:{AZ};"></div>'
            f'<div style="position:absolute;top:{top-4}px;left:{left+ancho-1}px;height:9px;width:1px;background:{AZ};"></div>'
            f'<div style="position:absolute;top:{top-19}px;left:{left+ancho//2-16}px;font-family:ui-monospace,Menlo,monospace;'
            f'font-size:11px;color:{AZ};background:#FFF;padding:1px 4px;white-space:nowrap;">{texto}</div>')

def fila(a,b,c):
    return (f'<div style="display:grid;grid-template-columns:1fr 128px 1fr;gap:14px;align-items:baseline;'
            f'border-top:1px solid #ECEEEE;padding:8px 0;font-size:14px;color:#20292B;">'
            f'<div>{a}</div><div style="font-family:ui-monospace,Menlo,monospace;font-size:12px;color:#20292B;">{b}</div>'
            f'<div style="color:#5C6B6F;font-size:13px;">{c}</div></div>')

# ---- la muestra: entrada + dos tarjetas, a 390 real
muestra = (f'<div style="width:390px;background:#FFFFFF;">'
           f'{barra_superior()}'
           f'<section style="background:#FFFFFF;padding:24px 20px;">'
           f'{etiqueta_seccion("GRUPO MÁSTER · TORREÓN, COAHUILA")}'
           f'<div style="margin-top:14px;">{hueco("TITULAR — QUÉ HACEN Y DÓNDE",2,(100,58))}</div>'
           f'<div style="margin-top:20px;display:flex;flex-direction:column;gap:10px;">'
           f'{boton("WhatsApp","primario","wa")}{boton("Llamar","secundario","tel")}</div>'
           f'</section>'
           f'<section style="background:{CREMA};padding:32px 20px;">'
           f'{etiqueta_seccion("NUESTRAS LÍNEAS")}'
           f'<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:16px;">'
           f'{tarjeta_giro("Renta de maquinaria y equipo","renta")}{tarjeta_giro("Joyería","joyeria")}</div>'
           f'</section></div>')

CUERPO = f'''
<div style="width:1280px;height:1180px;background:#FFFFFF;box-sizing:border-box;padding:44px 56px;display:flex;flex-direction:column;font-family:'Hanken Grotesk',system-ui,sans-serif;">
  <div style="font-family:'Libre Caslon Text',Georgia,serif;font-weight:700;font-size:38px;color:#20292B;">Anatomía</div>
  <div style="font-size:16px;line-height:1.55;color:#3A4A52;margin-top:11px;max-width:900px;">
    La misma sección a 390 real, con las medidas encima. Los números salen de medir el DOM
    en navegador con la fuente cargada — no son intenciones de diseño, son lo que el
    navegador dibuja.
  </div>

  <div style="display:flex;gap:56px;margin-top:26px;flex-grow:1;">

    <div style="position:relative;flex-shrink:0;width:470px;">
      <div style="position:relative;border:1px solid #D3D7DA;width:390px;">
        {muestra}
        <div style="position:absolute;inset:0;pointer-events:none;">
          <div style="position:absolute;left:0;top:0;width:20px;height:100%;background:rgba(199,91,56,.09);border-right:1px dashed {AZ};"></div>
          <div style="position:absolute;right:0;top:0;width:20px;height:100%;background:rgba(199,91,56,.09);border-left:1px dashed {AZ};"></div>
          {cota_h(20, 350, "350 de contenido", 14)}
          {cota_v(0, 56, "56 barra", 396)}
          {cota_v(56, 24, "24 arriba", 396)}
          {cota_v(214, 48, "48 táctil", 396)}
          {cota_v(272, 48, "48 táctil", 396)}
        </div>
      </div>
      <div style="font-family:ui-monospace,Menlo,monospace;font-size:11px;color:{AZ};margin-top:12px;width:390px;line-height:1.5;">
        franja naranja = margen lateral de 20 · no se invade nunca<br>
        cotas medidas sobre el DOM real, con Archivo cargada
      </div>
    </div>

    <div style="flex-grow:1;">
      <div style="font-size:12px;font-weight:700;letter-spacing:.18em;color:#5F656B;">ESPACIO — BASE 4</div>
      <div style="display:grid;grid-template-columns:1fr 128px 1fr;gap:14px;padding-bottom:6px;border-bottom:2px solid #20292B;margin-top:10px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:.1em;color:#5F656B;">QUÉ</div>
        <div style="font-size:11px;font-weight:700;letter-spacing:.1em;color:#5F656B;">MEDIDA</div>
        <div style="font-size:11px;font-weight:700;letter-spacing:.1em;color:#5F656B;">POR QUÉ</div>
      </div>
      {fila("Margen lateral móvil","20","Fijo. El contenido nunca lo invade")}
      {fila("Ancho de contenido a 390","350","390 − 20 − 20")}
      {fila("Relleno vertical de sección","32","24 en la de entrada, que ya trae la barra encima")}
      {fila("Separación entre bloques","12 · 16","12 dentro de un grupo, 16 entre grupos")}
      {fila("Separación de la retícula","8","2 columnas de 143 a 390")}
      <div style="border-top:1px solid #ECEEEE;"></div>

      <div style="font-size:12px;font-weight:700;letter-spacing:.18em;color:#5F656B;margin-top:26px;">TÁCTIL Y FOCO</div>
      <div style="border-bottom:2px solid #20292B;margin-top:10px;"></div>
      {fila("Objetivo táctil de casa","48 × 48","Botones, tarjetas, filas del acordeón")}
      {fila("Piso absoluto","44 × 44","Solo controles secundarios. WCAG 2.5.5")}
      {fila("Separación mínima entre objetivos","8","Para que el pulgar no acierte al de al lado")}
      {fila("Anillo de foco","3 px negro-950 · 3 de separación","19.44:1. El acento no sirve de anillo")}
      <div style="border-top:1px solid #ECEEEE;"></div>

      <div style="font-size:12px;font-weight:700;letter-spacing:.18em;color:#5F656B;margin-top:26px;">LA TARJETA DE GIRO — MEDIDA, NO ESTIMADA</div>
      <div style="border-bottom:2px solid #20292B;margin-top:10px;"></div>
      {fila("Ancho de columna a 390","143","2 columnas, separación 8")}
      {fila("Caja del título","<strong>79</strong> · 3 renglones","«Renta de maquinaria y equipo» a 17/600 ocupa 3 a este ancho")}
      {fila("Alto de la tarjeta","<strong>176</strong>","Fijo. Lo dicta el nombre más largo, no el más corto")}
      {fila("Ancho de columna a 1280","243","4 columnas, separación 12")}
      {fila("Caja del título a 1280","53 · 2 renglones","El mismo nombre cabe en 2 a este ancho")}
      <div style="border-top:1px solid #ECEEEE;"></div>

      <div style="background:#20292B;padding:18px 20px;margin-top:24px;">
        <div style="font-size:12px;font-weight:700;letter-spacing:.18em;color:#8A9598;">POR QUÉ EL ALTO ES FIJO</div>
        <div style="font-size:14px;line-height:1.6;color:#FFFFFF;margin-top:10px;">
          Si la tarjeta crece con su contenido, la retícula de ocho se desalinea en cuanto un
          nombre pasa de renglón — y ese desalineo mueve todo lo de abajo cuando carga la
          fuente. Alto fijo dictado por el peor caso: la retícula no se mueve y el CLS no se paga.
        </div>
      </div>
    </div>
  </div>
</div>'''

HTML = f'''<!doctype html>
<html><head><meta charset="utf-8"><script src="./support.js"></script></head><body>
<x-dc>
<helmet>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:wght@700&family=Hanken+Grotesk:wght@400;500;600;700&display=swap">
  <style>
    {faces()}
    body {{ margin:0; }}
    * {{ box-sizing:border-box; }}
  </style>
</helmet>
{CUERPO}
</x-dc></body></html>'''
open("Anatomia.dc.html","w",encoding="utf-8").write(HTML)
print("Anatomia.dc.html escrito")
