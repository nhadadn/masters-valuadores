# -*- coding: utf-8 -*-
"""Página de giro · ejemplar: Empeño y préstamo.
El orden de las secciones NO es un temario: es el orden en que llegan las preguntas
del visitante. Esa es la única decisión de composición que se toma sin el cliente,
y se toma así porque el orden del temario le sirve al negocio, no a quien busca."""
from piezas import *

PREGUNTAS = [
 ("¿Aceptan lo que traigo?",        "1"),
 ("¿Cuánto me dan y cuándo?",       "2"),
 ("¿Qué necesito llevar?",          "3"),
 ("¿Dónde están y están abiertos?", "4"),
 ("¿Puedo recuperar mi bien?",      "5"),
]

def numero(n, oscuro=False):
    return (f'<div style="width:30px;height:30px;flex-shrink:0;border-radius:999px;background:{ORO["500"]};'
            f'display:flex;align-items:center;justify-content:center;{T("cuerpo-fuerte", K["950"])}'
            f'font-size:15px;line-height:1;">{n}</div>')

def cabeza_pregunta(texto, n):
    return (f'<div style="display:flex;align-items:center;gap:12px;">{numero(n)}'
            f'<div style="{T("h2")}">{texto}</div></div>')

def cuerpo_giro():
    S=[]
    S.append(barra_superior())

    # --- Breadcrumb: existe porque el sitio es multigiro (ADR-0003)
    S.append(f'<div style="padding:0 {MARGEN}px;background:#FFFFFF;">{breadcrumb(["Inicio","Empeño y préstamo"])}</div>')

    # --- Encabezado de la página
    S.append(seccion(
        f'{etiqueta_seccion("LÍNEA DE NEGOCIO")}'
        f'<h1 style="{T("h1")}margin:12px 0 0;">Empeño y préstamo</h1>'
        f'<div style="margin-top:14px;">{hueco("SUBTITULAR — QUÉ RESUELVE, EN DOS RENGLONES",2,(100,74))}</div>'
        f'<div style="margin-top:20px;display:flex;flex-direction:column;gap:10px;">'
        f'{boton("WhatsApp","primario","wa")}{boton("Llamar","secundario","tel")}</div>',
        pv=20))

    # --- 1 · ¿Aceptan lo que traigo?
    bienes = "".join(
      f'<div style="border:1px solid {K["300"]};background:#FFFFFF;padding:12px 11px;min-height:96px;display:flex;flex-direction:column;gap:8px;">'
      f'<div style="width:26px;height:26px;border:1px dashed {K["400"]};background:{K["100"]};"></div>'
      f'<div style="{T("etiqueta", K["600"])}font-size:11px;line-height:1.3;">BIEN ACEPTADO {i+1}<br>PENDIENTE</div></div>'
      for i in range(6))
    S.append(seccion(
        f'{cabeza_pregunta(*PREGUNTAS[0])}'
        f'<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:16px;">{bienes}</div>'
        f'<div style="{T("pie", K["600"])}margin-top:14px;">La lista real la da el cliente. Aquí no se inventa ni un bien: si el sitio dice que aceptan algo que no aceptan, el visitante llega, se va, y no vuelve.</div>',
        fondo=CREMA))

    # --- 2 · ¿Cuánto me dan y cuándo?
    pasos = "".join(
      f'<div style="display:flex;gap:12px;margin-top:{16 if i else 0}px;">'
      f'<div style="width:2px;background:{ORO["500"]};flex-shrink:0;"></div>'
      f'<div style="flex-grow:1;">{hueco(f"PASO {i+1} — QUÉ PASA Y CUÁNTO TARDA",2,(70,100))}</div></div>'
      for i in range(3))
    S.append(seccion(
        f'{cabeza_pregunta(*PREGUNTAS[1])}'
        f'<div style="margin-top:16px;">{pasos}</div>'
        f'<div style="border:1px solid {K["300"]};padding:14px;margin-top:18px;">'
        f'<div style="{T("etiqueta", K["600"])}">PORCENTAJE, PLAZO Y TASA</div>'
        f'<div style="margin-top:10px;">{pc("ninguna cifra se dibuja sin autorización escrita")}</div></div>'))

    # --- 3 · ¿Qué necesito llevar?
    reqs = "".join(
      f'<div style="display:flex;gap:12px;align-items:flex-start;padding:14px 0;border-top:1px solid {K["200"]};">'
      f'<div style="width:22px;height:22px;flex-shrink:0;border:2px solid {K["500"]};border-radius:4px;"></div>'
      f'<div style="flex-grow:1;">{hueco(f"REQUISITO {i+1} — PENDIENTE",1,(84,))}</div></div>'
      for i in range(4))
    S.append(seccion(
        f'{cabeza_pregunta(*PREGUNTAS[2])}'
        f'<div style="margin-top:12px;">{reqs}</div>',
        fondo=CREMA))

    # --- 4 · ¿Dónde están y están abiertos?
    S.append(seccion(
        f'{cabeza_pregunta(*PREGUNTAS[3])}'
        f'<div style="margin-top:16px;">{foto((4,3),"MAPA — SE DIBUJA AL CERRAR D-08")}</div>'
        f'<div style="margin-top:16px;display:flex;gap:10px;align-items:flex-start;">{ico("mapa",K["600"],20)}<div>{pc("dirección exacta")}</div></div>'
        f'<div style="margin-top:12px;display:flex;gap:10px;align-items:flex-start;">{ico("reloj",K["600"],20)}<div>{pc("horarios de cada día")}</div></div>'
        f'<div style="margin-top:18px;">{boton("Cómo llegar","secundario")}</div>'))

    # --- 5 · ¿Puedo recuperar mi bien? · acordeón en sus dos estados
    S.append(seccion(
        f'{cabeza_pregunta(*PREGUNTAS[4])}'
        f'<div style="{T("pie", K["600"])}margin-top:10px;">El primero va abierto: enseña los dos estados del componente.</div>'
        f'<div style="margin-top:14px;border-top:1px solid {K["200"]};">'
        f'{acordeon([("¿Qué pasa si no pago a tiempo?",True),("¿Puedo pagar solo los intereses?",False),("¿Cómo recupero mi bien?",False),("¿Qué documento me dan?",False)])}</div>',
        fondo=CREMA))

    # --- Enlaces cruzados: lo que hace que el multigiro se sostenga
    pastillas = "".join(
      f'<a style="display:flex;align-items:center;gap:9px;min-height:48px;border:1px solid {K["300"]};'
      f'background:#FFFFFF;padding:0 14px;text-decoration:none;{T("cuerpo-fuerte")}">{ico(i,K["700"],20)}{n}</a>'
      for n,i in GIROS if n!="Empeño y préstamo")
    S.append(seccion(
        f'{etiqueta_seccion("OTRAS LÍNEAS DEL GRUPO")}'
        f'<div style="{T("pie", K["600"])}margin-top:10px;">Sin estos enlaces cada página queda aislada y el multigiro no reparte autoridad.</div>'
        f'<div style="display:flex;flex-direction:column;gap:8px;margin-top:14px;">{pastillas}</div>'))

    S.append(pie_pagina())
    S.append(barra_fija())
    return "".join(S)

open("GiroMovil.dc.html","w",encoding="utf-8").write(pagina("Giro · empeño", cuerpo_giro()))
print("GiroMovil.dc.html escrito")
