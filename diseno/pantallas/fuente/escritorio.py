# -*- coding: utf-8 -*-
"""Portada a 1280. Mismo sistema, mismos tokens, mismos huecos.
Lo único que cambia es cuántas columnas caben y que la barra fija se vuelve navegación."""
from piezas import *

ANCHO_D = 1280
CAJA    = 1120      # contenido máximo; márgenes de 80 a cada lado
MARGEN_D = (ANCHO_D - CAJA)//2

def sec_d(contenido, fondo="#FFFFFF", pv=64):
    return (f'<section style="background:{fondo};padding:{pv}px {MARGEN_D}px;">'
            f'<div style="max-width:{CAJA}px;margin:0 auto;">{contenido}</div></section>')

def barra_escritorio():
    enlaces = "".join(f'<a style="display:inline-flex;align-items:center;min-height:44px;padding:0 14px;'
                      f'text-decoration:none;{T("cuerpo","#FFFFFF")}line-height:1;">{n}</a>'
                      for n,_ in GIROS[:4])
    return (f'<header style="height:76px;background:{K["950"]};display:flex;align-items:center;'
            f'justify-content:space-between;padding:0 {MARGEN_D}px;">'
            f'<div style="display:flex;align-items:center;gap:12px;">{monograma(32)}'
            f'<div><div style="{T("cuerpo-fuerte","#FFFFFF")}font-size:22px;line-height:1;letter-spacing:.03em;font-weight:700;">MASTERS</div>'
            f'<div style="{T("etiqueta", ORO["300"])}font-size:10px;letter-spacing:.2em;margin-top:4px;">VALUADORES</div></div></div>'
            f'<nav style="display:flex;align-items:center;">{enlaces}'
            f'<a style="display:inline-flex;align-items:center;min-height:44px;min-width:44px;justify-content:center;padding:0 14px;text-decoration:none;{T("cuerpo", K["300"])}">…</a></nav>'
            f'<div style="display:flex;gap:10px;">{boton("WhatsApp","primario","wa",48,"180px",sobre_oscuro=True)}</div>'
            f'</header>')

def cuerpo_escritorio():
    S=[barra_escritorio()]

    # --- Entrada a dos columnas
    S.append(sec_d(
        f'<div style="display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center;">'
        f'<div>{etiqueta_seccion("GRUPO MÁSTER · TORREÓN, COAHUILA")}'
        f'<div style="margin-top:16px;">{hueco("TITULAR — QUÉ HACEN Y DÓNDE, EN UNA LÍNEA",2,(100,56))}</div>'
        f'<div style="margin-top:14px;">{hueco("SUBTITULAR — LA PROMESA CONCRETA",2,(100,78))}</div>'
        f'<div style="margin-top:24px;display:flex;gap:12px;">'
        f'{boton("WhatsApp","primario","wa",48,"220px")}{boton("Llamar","secundario","tel",48,"180px")}</div></div>'
        f'<div>{foto((4,3),"FOTO — FACHADA DEL LOCAL, DE DÍA, CON EL LETRERO LEGIBLE")}</div></div>'))

    # --- Repartidor a 4 columnas
    S.append(sec_d(
        f'<div style="display:flex;align-items:flex-end;justify-content:space-between;gap:40px;">'
        f'<div style="flex-grow:1;">{etiqueta_seccion("NUESTRAS LÍNEAS")}'
        f'<div style="margin-top:14px;max-width:560px;">{hueco("TÍTULO DE SECCIÓN — UNA LÍNEA",1,(78,))}</div></div>'
        f'<div style="{T("pie", K["600"])}max-width:300px;text-align:right;">El orden es provisional. La prioridad la decide el estudio de búsqueda.</div></div>'
        f'<div style="margin-top:26px;">{repartidor(cols=4, gap=12, alto=150, alto_titulo=53)}</div>',
        fondo=CREMA))

    # --- Por qué aquí, tres columnas
    bloques = "".join(
      f'<div style="border-top:3px solid {ORO["500"]};padding-top:18px;">{ico(n,K["700"],28)}'
      f'<div style="margin-top:12px;">{hueco(f"DIFERENCIADOR {i+1} — TÍTULO Y UNA LÍNEA",2,(82,100))}</div></div>'
      for i,n in enumerate(["mapa","reloj","empeno"]))
    S.append(sec_d(
        f'{etiqueta_seccion("POR QUÉ AQUÍ")}'
        f'<div style="margin-top:14px;max-width:600px;">{hueco("TÍTULO DE SECCIÓN — UNA LÍNEA",1,(70,))}</div>'
        f'<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:32px;margin-top:32px;">{bloques}</div>'))

    # --- Dónde estamos, dos columnas
    S.append(sec_d(
        f'<div style="display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center;">'
        f'<div>{foto((16,9),"MAPA — SE DIBUJA AL CERRAR D-08")}</div>'
        f'<div>{etiqueta_seccion("DÓNDE ESTAMOS")}'
        f'<div style="margin-top:18px;display:flex;gap:10px;align-items:flex-start;">{ico("mapa",K["600"],20)}<div>{pc("calle, número, colonia y CP")}</div></div>'
        f'<div style="margin-top:12px;display:flex;gap:10px;align-items:flex-start;">{ico("reloj",K["600"],20)}<div>{pc("horarios de cada día")}</div></div>'
        f'<div style="margin-top:24px;">{boton("Cómo llegar","secundario",None,48,"220px")}</div></div></div>',
        fondo=CREMA))

    # --- Contacto
    S.append(sec_d(
        f'<div style="display:grid;grid-template-columns:1fr auto;gap:56px;align-items:center;">'
        f'<div>{etiqueta_seccion("CONTACTO", True)}'
        f'<div style="margin-top:14px;max-width:640px;">{hueco("TÍTULO — LA INVITACIÓN A ESCRIBIR",2,(100,58),oscuro=True)}</div></div>'
        f'<div style="display:flex;gap:12px;">{boton("WhatsApp","primario","wa",48,"220px",sobre_oscuro=True)}'
        f'{boton("Llamar","secundario","tel",48,"180px",sobre_oscuro=True)}</div></div>',
        fondo=K["950"], pv=56))

    # --- Pie a tres columnas
    enlaces = "".join(f'<div style="{T("pie","#D3D7DA")}padding:7px 0;">{n}</div>' for n,_ in GIROS)
    S.append(f'<footer style="background:{K["900"]};padding:48px {MARGEN_D}px;">'
             f'<div style="max-width:{CAJA}px;margin:0 auto;display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:48px;">'
             f'<div><div style="display:flex;align-items:center;gap:11px;">{monograma(28)}'
             f'<div style="{T("cuerpo-fuerte","#FFFFFF")}letter-spacing:.03em;">MASTERS VALUADORES</div></div>'
             f'<div style="{T("pie", K["300"])}margin-top:14px;">Razón social {pc("D-01", True)}</div></div>'
             f'<div>{etiqueta_seccion("DÓNDE ESTAMOS", True)}'
             f'<div style="margin-top:12px;">{pc("dirección · D-08", True)}</div>'
             f'<div style="margin-top:9px;">{pc("teléfono · D-08", True)}</div>'
             f'<div style="margin-top:9px;">{pc("horarios · D-08", True)}</div>'
             f'<div style="margin-top:9px;">{pc("redes · D-10", True)}</div></div>'
             f'<div>{etiqueta_seccion("LÍNEAS", True)}<div style="margin-top:8px;">{enlaces}</div></div>'
             f'</div></footer>')
    return "".join(S)

open("PortadaEscritorio.dc.html","w",encoding="utf-8").write(pagina("Portada · escritorio", cuerpo_escritorio(), ancho=ANCHO_D))
print("PortadaEscritorio.dc.html escrito")
