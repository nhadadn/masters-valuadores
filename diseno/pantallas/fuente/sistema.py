# -*- coding: utf-8 -*-
"""Primitivos del sistema de diseño de Masters Valuadores.
Nada aquí escribe contenido: todo lo que sería copy, foto o cifra sale como hueco."""
import base64

# ---------------------------------------------------------------- tokens
K   = {"950":"#0C0D0F","900":"#16181B","800":"#232629","700":"#33373B","600":"#474C51",
       "500":"#5F656B","400":"#848A90","300":"#AEB4B9","200":"#D3D7DA","100":"#E9EBED"}
CREMA = "#F0EFED"
ORO   = {"300":"#D6A52F","500":"#B58000","700":"#8C6300"}
ERROR = "#A8331E"
MARGEN = 20
ANCHO  = 390

def faces():
    out=[]
    for w in (400,600,700):
        b=base64.b64encode(open(f"archivo-latin-{w}-normal.woff2","rb").read()).decode()
        out.append(f"@font-face{{font-family:'Archivo';font-weight:{w};font-style:normal;"
                   f"font-display:block;src:url(data:font/woff2;base64,{b}) format('woff2');}}")
    return "\n".join(out)

# ---------------------------------------------------------------- tipografía
def T(rol, color=K["950"]):
    E = {
      "display":      "font-size:34px;line-height:1.12;font-weight:700;",
      "h1":           "font-size:28px;line-height:1.15;font-weight:700;",
      "h2":           "font-size:22px;line-height:1.25;font-weight:700;",
      "h3":           "font-size:18px;line-height:1.30;font-weight:600;",
      "cuerpo":       "font-size:17px;line-height:1.55;font-weight:400;",
      "cuerpo-fuerte":"font-size:17px;line-height:1.55;font-weight:600;",
      "pie":          "font-size:14px;line-height:1.45;font-weight:400;",
      "etiqueta":     "font-size:13px;line-height:1.20;font-weight:700;letter-spacing:.12em;",
    }[rol]
    return f"font-family:'Archivo',system-ui,sans-serif;{E}color:{color};"

# ---------------------------------------------------------------- huecos
def hueco(etiqueta, lineas=2, anchos=(100,72), oscuro=False):
    """Bloque de contenido no aprobado. Nunca lleva texto de relleno."""
    borde = K["600"] if oscuro else K["300"]
    fondo = "rgba(255,255,255,.04)" if oscuro else CREMA
    tinta = K["300"] if oscuro else K["600"]
    barra = K["500"] if oscuro else K["200"]
    barras = "".join(
        f'<div style="height:14px;border-radius:2px;background:{barra};margin-top:{7 if i else 9}px;width:{anchos[i%len(anchos)]}%;"></div>'
        for i in range(lineas))
    return (f'<div style="border:1px dashed {borde};background:{fondo};padding:10px 12px;">'
            f'<div style="{T("etiqueta", tinta)}">{etiqueta}</div>{barras}</div>')

def foto(ratio, etiqueta, alto=None):
    """Bloque gris con la relación de aspecto y qué foto va ahí. Jamás una imagen."""
    w,h = ratio
    est = f"aspect-ratio:{w}/{h};" if alto is None else f"height:{alto}px;"
    return (f'<div style="{est}background:{K["100"]};border:1px solid {K["300"]};'
            f'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;">'
            f'<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="{K["400"]}" stroke-width="1.5" aria-hidden="true">'
            f'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M4 17l5-4 4 3 3-2 4 3"/></svg>'
            f'<div style="{T("etiqueta", K["600"])}">{etiqueta}</div>'
            f'<div style="{T("pie", K["500"])}font-size:12px;">relación {w}:{h}</div></div>')

def pc(dato, oscuro=False):
    """Dato de negocio sin confirmar. Se ve, a propósito.
    Sobre superficie oscura la tinta sube a negro-300: negro-500 da 3.02:1 y no pasa AA."""
    if oscuro:
        chip = f'background:{K["800"]};border:1px solid {K["600"]};color:{K["200"]};'
        nota = K["300"]
    else:
        chip = f'background:{K["100"]};border:1px solid {K["300"]};color:{K["600"]};'
        nota = K["500"]
    return (f'<span style="font-family:ui-monospace,Menlo,monospace;font-size:13px;{chip}padding:2px 6px;">__POR_CONFIRMAR__</span>'
            f'<span style="{T("pie", nota)}"> · {dato}</span>')

# ---------------------------------------------------------------- controles
WA = ('<svg width="20" height="20" viewBox="0 0 24 24" fill="{c}" aria-hidden="true">'
      '<path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20z"/></svg>')
TEL = ('<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="{c}" stroke-width="1.9" stroke-linecap="round" aria-hidden="true">'
       '<path d="M5 3h3l2 5-2.5 1.5a12 12 0 0 0 5 5L14 12l5 2v3a2 2 0 0 1-2.2 2A16 16 0 0 1 3 5.2 2 2 0 0 1 5 3z"/></svg>')

def boton(texto, variante="primario", icono=None, alto=48, ancho="100%", sobre_oscuro=False):
    """48 de alto de casa. 44 es el piso absoluto y solo para controles secundarios."""
    if sobre_oscuro:
        estilos = {"primario": f"background:#FFFFFF;color:{K['950']};border:0;",
                   "secundario": f"background:transparent;color:#FFFFFF;border:2px solid #FFFFFF;"}
    else:
        estilos = {"primario":   f"background:{K['950']};color:#FFFFFF;border:0;",
                   "secundario": f"background:#FFFFFF;color:{K['950']};border:2px solid {K['950']};",
                   "terciario":  f"background:transparent;color:{K['950']};border:0;text-decoration:underline;text-underline-offset:3px;",
                   "acento":     f"background:{ORO['500']};color:{K['950']};border:0;"}
    tinta = "#FFFFFF" if (variante=="primario" and not sobre_oscuro) or (variante=="secundario" and sobre_oscuro) else K["950"]
    ic = (WA if icono=="wa" else TEL if icono=="tel" else "").format(c=tinta)
    return (f'<div style="height:{alto}px;width:{ancho};border-radius:8px;box-sizing:border-box;'
            f'display:flex;align-items:center;justify-content:center;gap:9px;{estilos[variante]}'
            f'{T("cuerpo-fuerte", tinta)}line-height:1;">{ic}{texto}</div>')

def campo(etiqueta, ayuda="", estado="reposo"):
    borde = {"reposo":K["500"], "foco":K["950"], "error":ERROR, "inactivo":K["300"]}[estado]
    extra = f"outline:3px solid {K['950']};outline-offset:2px;" if estado=="foco" else ""
    fondo = CREMA if estado=="inactivo" else "#FFFFFF"
    tinta = K["500"] if estado in ("reposo","inactivo") else K["950"]
    err = ("" if estado!="error" else
           f'<div style="display:flex;gap:7px;align-items:flex-start;margin-top:7px;">'
           f'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="{ERROR}" stroke-width="2" stroke-linecap="round" style="flex-shrink:0;margin-top:2px;" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16.5v.01"/></svg>'
           f'<div style="{T("pie", ERROR)}">Qué falta y cómo se arregla, en una línea</div></div>')
    return (f'<div><div style="{T("cuerpo-fuerte")}">{etiqueta}</div>'
            f'<div style="height:52px;border:2px solid {borde};{extra}border-radius:4px;background:{fondo};'
            f'display:flex;align-items:center;padding:0 14px;margin-top:7px;box-sizing:border-box;{T("cuerpo", tinta)}">{ayuda}</div>{err}</div>')

def breadcrumb(ruta):
    """El objetivo táctil es el enlace, no la barra que lo contiene.
    Un <nav> de 44 con enlaces de 20 dentro no cumple 2.5.5: lo que se toca es el enlace."""
    sep = f'<span aria-hidden="true" style="{T("pie", K["500"])}">\u203a</span>'
    piezas=[]
    for i,t in enumerate(ruta):
        ultimo = (i == len(ruta)-1)
        c = K["950"] if ultimo else K["600"]
        deco = "" if ultimo else "text-decoration:underline;text-underline-offset:3px;"
        etiqueta = 'aria-current="page"' if ultimo else ""
        piezas.append(f'<span {etiqueta} style="display:inline-flex;align-items:center;justify-content:center;'
                      f'min-height:44px;min-width:44px;padding:0 8px;{T("pie", c)}{deco}">{t}</span>')
    return (f'<nav aria-label="Ruta" style="display:flex;align-items:center;flex-wrap:wrap;margin-left:-8px;">'
            f'{sep.join(piezas)}</nav>')

# ---------------------------------------------------------------- estructura
def seccion(contenido, fondo="#FFFFFF", pv=32, ph=MARGEN):
    return f'<section style="background:{fondo};padding:{pv}px {ph}px;">{contenido}</section>'

def etiqueta_seccion(txt, oscuro=False):
    return f'<div style="{T("etiqueta", K["300"] if oscuro else K["600"])}">{txt}</div>'
