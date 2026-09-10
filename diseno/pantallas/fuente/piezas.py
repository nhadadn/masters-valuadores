# -*- coding: utf-8 -*-
from sistema import *

ICO = {
 "empeno":  '<path d="M3 12.5V4a1 1 0 0 1 1-1h8.5L21 11.5 13.5 19z"/><circle cx="7.5" cy="7.5" r="1.4"/>',
 "joyeria": '<path d="M6 3h12l3 6-9 12L3 9z"/><path d="M3 9h18M9 3l-3 6 6 12 6-12-3-6"/>',
 "bazar":   '<path d="M4 8h16l-1.2 12H5.2z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
 "taller":  '<path d="M14.5 3a5 5 0 0 0-4.6 7L3 16.9 6.1 20l7-6.9A5 5 0 1 0 14.5 3z"/>',
 "fletes":  '<path d="M2 7h11v10H2z"/><path d="M13 10h4l3 3v4h-7z"/><circle cx="6" cy="18.5" r="1.8"/><circle cx="17" cy="18.5" r="1.8"/>',
 "renta":   '<path d="M4 21h9"/><path d="M8.5 21V5"/><path d="M2.5 5h19"/><path d="M17 5v4.5"/><path d="M8.5 5L13 1.8"/>',
 "finan":   '<path d="M5 3h10l4 4v14H5z"/><path d="M15 3v4h4"/><path d="M9 12h6M9 16h6"/>',
 "bloq":    '<rect x="5" y="11" width="14" height="9" rx="1.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
 "mapa":    '<path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
 "reloj":   '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
 "flecha":  '<path d="M5 12h13M13 6l6 6-6 6"/>',
 "mas":     '<path d="M12 5v14M5 12h14"/>',
 "menos":   '<path d="M5 12h14"/>',
 "tel":     '<path d="M5 3h3l2 5-2.5 1.5a12 12 0 0 0 5 5L14 12l5 2v3a2 2 0 0 1-2.2 2A16 16 0 0 1 3 5.2 2 2 0 0 1 5 3z"/>',
}
def ico(n, c=None, s=24, sw=1.6):
    c = c or K["700"]
    return (f'<svg width="{s}" height="{s}" viewBox="0 0 24 24" fill="none" stroke="{c}" '
            f'stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{ICO[n]}</svg>')

def monograma(s=26, oro=ORO["500"], claro="#E9EBED"):
    return (f'<svg width="{s}" height="{round(s*258/260)}" viewBox="0 0 260 258" aria-hidden="true">'
            f'<path fill="{oro}" d="M0,24 L130,154 L130,220 L46,152 L46,258 L0,258 Z M130,74 L196,8 L244,8 L260,24 L130,154 Z"/>'
            f'<path fill="{claro}" d="M16,8 L64,8 L130,74 L130,154 L0,24 Z M260,24 L260,258 L214,258 L214,152 L130,220 L130,154 Z"/></svg>')

def barra_superior(ancho=ANCHO):
    return (f'<header style="height:56px;background:{K["950"]};display:flex;align-items:center;'
            f'justify-content:space-between;padding:0 {MARGEN}px;position:sticky;top:0;">'
            f'<div style="display:flex;align-items:center;gap:10px;">{monograma(26)}'
            f'<div><div style="{T("cuerpo-fuerte","#FFFFFF")}font-size:19px;line-height:1;letter-spacing:.03em;font-weight:700;">MASTERS</div>'
            f'<div style="{T("etiqueta", ORO["300"])}font-size:9px;letter-spacing:.2em;margin-top:3px;">VALUADORES</div></div></div>'
            f'<div style="display:flex;gap:6px;">'
            f'<div style="width:48px;height:48px;border:2px solid #FFFFFF;border-radius:8px;display:flex;align-items:center;justify-content:center;" aria-label="Llamar">{ico("tel","#FFFFFF",22,1.9)}</div>'
            f'</div></header>')

def barra_fija():
    """Barra de contacto fija. Se dibuja encima del pie, como se ve en uso."""
    return (f'<div style="position:sticky;bottom:0;background:{K["950"]};border-top:2px solid {ORO["500"]};'
            f'padding:10px {MARGEN}px;display:flex;gap:8px;">'
            f'<div style="flex:2;">{boton("WhatsApp","primario","wa",48,"100%",sobre_oscuro=True)}</div>'
            f'<div style="flex:1;">{boton("Llamar","secundario","tel",48,"100%",sobre_oscuro=True)}</div></div>')

GIROS = [
 ("Empeño y préstamo","empeno"), ("Joyería","joyeria"), ("Bazar","bazar"),
 ("Taller y refaccionaria","taller"), ("Fletes y logística","fletes"),
 ("Renta de maquinaria y equipo","renta"), ("Financiera","finan"),
]
BLOQUEADOS = [("Importaciones","D-04 · ¿es otra entidad legal?"), ("Avalúos periciales","D-03 · ¿existe el servicio?")]

ALTO_TITULO  = 79   # medido: «Renta de maquinaria y equipo» ocupa 3 renglones a 17/600 en columna de 143
ALTO_TARJETA = 176  # lo dicta el nombre más largo, no el más corto

def tarjeta_giro(nombre, icono, alto=ALTO_TARJETA, alto_titulo=ALTO_TITULO):
    """Alto FIJO. Si la caja del título no cabe tres renglones, la retícula se desalinea."""
    return (f'<a style="display:flex;flex-direction:column;height:{alto}px;box-sizing:border-box;'
            f'border:1px solid {K["300"]};background:#FFFFFF;padding:14px 13px;text-decoration:none;">'
            f'<div style="width:26px;height:3px;background:{ORO["500"]};margin-bottom:11px;"></div>'
            f'{ico(icono, s=26)}'
            f'<div style="{T("cuerpo-fuerte")}margin-top:9px;height:{alto_titulo}px;">{nombre}</div>'
            f'<div style="border-top:1px dashed {K["300"]};margin-top:auto;padding-top:7px;{T("etiqueta", K["600"])}font-size:11px;">QUÉ RESUELVE — PENDIENTE</div>'
            f'</a>')

def tarjeta_bloqueada(alto=ALTO_TARJETA):
    """Las decisiones abiertas se dibujan, no se esconden. Un giro bloqueado
    ocupa lugar en la retícula para que el cliente vea qué falta por decidir."""
    filas = "".join(
      f'<div style="display:flex;align-items:baseline;justify-content:space-between;gap:8px;margin-top:{7 if i else 11}px;">'
      f'<div style="{T("pie", K["600"])}font-weight:600;line-height:1.25;">{n}</div>'
      f'<div style="font-family:ui-monospace,Menlo,monospace;font-size:11px;color:{K["600"]};'
      f'border:1px solid {K["400"]};padding:1px 5px;flex-shrink:0;">{cod}</div></div>'
      for i,(n,cod) in enumerate([("Importaciones","D-04"),("Avalúos periciales","D-03")]))
    return (f'<div style="height:{alto}px;box-sizing:border-box;border:1px dashed {K["400"]};background:{CREMA};'
            f'padding:14px 13px;display:flex;flex-direction:column;">'
            f'<div style="display:flex;align-items:center;gap:7px;">{ico("bloq", K["600"], 18)}'
            f'<div style="{T("etiqueta", K["600"])}font-size:11px;">BLOQUEADOS</div></div>{filas}'
            f'<div style="{T("pie", K["600"])}font-size:11px;line-height:1.3;margin-top:auto;">'
            f'Entran cuando se cierren esas dos decisiones.</div></div>')

def repartidor(cols=2, alto=ALTO_TARJETA, gap=8, alto_titulo=ALTO_TITULO):
    """El alto de la tarjeta es función del ancho de columna: a 143 el nombre más largo
    ocupa 3 renglones; a 245 ocupa 2. Se mide, no se estima."""
    tarjetas = "".join(tarjeta_giro(n,i,alto,alto_titulo) for n,i in GIROS) + tarjeta_bloqueada(alto)
    return f'<div style="display:grid;grid-template-columns:repeat({cols},minmax(0,1fr));gap:{gap}px;">{tarjetas}</div>'

def acordeon(items, ancho_borde=1):
    out=[]
    for i,(preg, abierto) in enumerate(items):
        cuerpo = (f'<div style="padding:0 4px 16px;">{hueco("RESPUESTA — PENDIENTE",2,(100,64))}</div>' if abierto else "")
        out.append(f'<div style="border-bottom:{ancho_borde}px solid {K["200"]};">'
                   f'<div style="min-height:56px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 4px;">'
                   f'<div style="{T("cuerpo-fuerte")}">{preg}</div>{ico("menos" if abierto else "mas", K["950"], 22, 2)}</div>{cuerpo}</div>')
    return "".join(out)

def pie_pagina():
    enlaces = "".join(f'<div style="{T("pie","#D3D7DA")}padding:9px 0;">{n}</div>' for n,_ in GIROS)
    return (f'<footer style="background:{K["900"]};padding:32px {MARGEN}px;">'
            f'<div style="display:flex;align-items:center;gap:10px;">{monograma(24)}'
            f'<div style="{T("cuerpo-fuerte","#FFFFFF")}letter-spacing:.03em;">MASTERS VALUADORES</div></div>'
            f'<div style="margin-top:18px;">{etiqueta_seccion("DÓNDE ESTAMOS", True)}'
            f'<div style="margin-top:10px;">{pc("dirección, CP y ciudad · D-08", True)}</div>'
            f'<div style="margin-top:8px;">{pc("teléfono y WhatsApp · D-08", True)}</div>'
            f'<div style="margin-top:8px;">{pc("horarios · D-08", True)}</div>'
            f'<div style="margin-top:8px;">{pc("Instagram y Facebook · D-10", True)}</div></div>'
            f'<div style="margin-top:22px;border-top:1px solid {K["700"]};padding-top:14px;">'
            f'{etiqueta_seccion("LÍNEAS", True)}<div style="margin-top:6px;">{enlaces}</div></div>'
            f'<div style="margin-top:14px;border-top:1px solid {K["700"]};padding-top:14px;">'
            f'<div style="{T("pie", K["300"])}">Aviso de privacidad · Términos</div>'
            f'<div style="{T("pie", K["300"])}margin-top:8px;">Razón social {pc("D-01 · Master o Masters", True)}</div></div></footer>')

def pagina(titulo, cuerpo, ancho=ANCHO, alto=None):
    est = f"width:{ancho}px;" + (f"height:{alto}px;" if alto else "")
    return f'''<!doctype html>
<html><head><meta charset="utf-8"><script src="./support.js"></script></head><body>
<x-dc>
<helmet>
  <style>
    {faces()}
    body {{ margin:0; }}
    * {{ box-sizing:border-box; }}
  </style>
</helmet>
<div style="{est}background:#FFFFFF;display:flex;flex-direction:column;overflow:hidden;">{cuerpo}</div>
</x-dc></body></html>'''
