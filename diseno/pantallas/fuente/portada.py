# -*- coding: utf-8 -*-
from piezas import *

def cuerpo_portada():
    S=[]
    S.append(barra_superior())

    # --- 1 · Entrada
    S.append(seccion(
        f'{etiqueta_seccion("GRUPO MÁSTER · TORREÓN, COAHUILA")}'
        f'<div style="margin-top:14px;">{hueco("TITULAR — QUÉ HACEN Y DÓNDE, EN UNA LÍNEA",2,(100,58))}</div>'
        f'<div style="margin-top:12px;">{hueco("SUBTITULAR — LA PROMESA CONCRETA, EN DOS RENGLONES",2,(100,80))}</div>'
        f'<div style="margin-top:20px;display:flex;flex-direction:column;gap:10px;">'
        f'{boton("WhatsApp","primario","wa")}{boton("Llamar","secundario","tel")}</div>'
        f'<div style="margin-top:20px;">{foto((16,9),"FOTO — FACHADA DEL LOCAL, DE DÍA, CON EL LETRERO LEGIBLE")}</div>',
        pv=24))

    # --- 2 · El repartidor: la sección que define la ruta B
    S.append(seccion(
        f'{etiqueta_seccion("NUESTRAS LÍNEAS")}'
        f'<div style="margin-top:12px;">{hueco("TÍTULO DE SECCIÓN — UNA LÍNEA",1,(88,))}</div>'
        f'<div style="margin-top:16px;">{repartidor()}</div>'
        f'<div style="{T("pie", K["600"])}margin-top:14px;">El orden es provisional. La prioridad la decide el estudio de búsqueda, no la intuición.</div>',
        fondo=CREMA))

    # --- 3 · Por qué aquí
    bloques = "".join(
      f'<div style="border-left:3px solid {ORO["500"]};padding-left:14px;margin-top:{18 if i else 0}px;">'
      f'{ico(n)}<div style="margin-top:9px;">{hueco(f"DIFERENCIADOR {i+1} — TÍTULO Y UNA LÍNEA",2,(80,100))}</div></div>'
      for i,n in enumerate(["mapa","reloj","empeno"]))
    S.append(seccion(
        f'{etiqueta_seccion("POR QUÉ AQUÍ")}'
        f'<div style="margin-top:12px;">{hueco("TÍTULO DE SECCIÓN — UNA LÍNEA",1,(76,))}</div>'
        f'<div style="margin-top:18px;">{bloques}</div>'))

    # --- 4 · Dónde estamos
    S.append(seccion(
        f'{etiqueta_seccion("DÓNDE ESTAMOS")}'
        f'<div style="margin-top:14px;">{foto((4,3),"MAPA — UBICACIÓN EXACTA. NO SE DIBUJA HASTA CERRAR D-08")}</div>'
        f'<div style="margin-top:16px;display:flex;gap:10px;align-items:flex-start;">{ico("mapa",K["600"],20)}<div>{pc("calle, número, colonia y CP")}</div></div>'
        f'<div style="margin-top:12px;display:flex;gap:10px;align-items:flex-start;">{ico("reloj",K["600"],20)}<div>{pc("horarios de cada día")}</div></div>'
        f'<div style="margin-top:18px;">{boton("Cómo llegar","secundario")}</div>',
        fondo=CREMA))

    # --- 5 · Contacto
    S.append(seccion(
        f'{etiqueta_seccion("CONTACTO", True)}'
        f'<div style="margin-top:12px;">{hueco("TÍTULO — LA INVITACIÓN A ESCRIBIR",2,(100,62),oscuro=True)}</div>'
        f'<div style="margin-top:18px;display:flex;flex-direction:column;gap:10px;">'
        f'{boton("WhatsApp","primario","wa",sobre_oscuro=True)}{boton("Llamar","secundario","tel",sobre_oscuro=True)}</div>'
        f'<div style="{T("pie", K["300"])}margin-top:14px;">El número sale de <code style="color:'+ORO["300"]+'">business.ts</code>, nunca del componente.</div>',
        fondo=K["950"]))

    S.append(pie_pagina())
    S.append(barra_fija())
    return "".join(S)

open("PortadaMovil.dc.html","w",encoding="utf-8").write(pagina("Portada · móvil", cuerpo_portada()))
print("PortadaMovil.dc.html escrito")
