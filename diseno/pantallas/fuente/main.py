# -*- coding: utf-8 -*-
from sistema import *
from piezas import monograma

FILAS = [
 ("Portada · móvil",      "390 × 3840", "4.94:1", "48 px", "7",  "7", "CUMPLE"),
 ("Giro · empeño, móvil", "390 × 4115", "4.94:1", "44 px", "11", "8", "CUMPLE"),
 ("Portada · escritorio", "1280 × 2582","4.94:1", "44 px", "7",  "7", "CUMPLE"),
 ("Anatomía",             "1280 × 1104","4.83:1", "48 px", "2",  "0", "CUMPLE"),
]

def fila(c):
    n,dim,con,tac,hue,pc_,ver = c
    return (f'<div style="display:grid;grid-template-columns:1.5fr 1fr .8fr .7fr .6fr .9fr .8fr;gap:10px;'
            f'border-top:1px solid #ECEEEE;padding:9px 0;font-size:14px;color:#20292B;align-items:baseline;">'
            f'<div style="font-weight:600;">{n}</div>'
            f'<div style="font-family:ui-monospace,Menlo,monospace;font-size:12px;color:#5C6B6F;">{dim}</div>'
            f'<div style="font-family:ui-monospace,Menlo,monospace;font-size:12px;">{con}</div>'
            f'<div style="font-family:ui-monospace,Menlo,monospace;font-size:12px;">{tac}</div>'
            f'<div style="font-family:ui-monospace,Menlo,monospace;font-size:12px;">{hue}</div>'
            f'<div style="font-family:ui-monospace,Menlo,monospace;font-size:12px;">{pc_}</div>'
            f'<div style="color:#1E5237;font-weight:700;font-size:12px;">{ver}</div></div>')

def li(t, c="#A8482A"):
    return f'<div style="display:flex;gap:10px;font-size:15px;line-height:1.55;color:#20292B;"><span style="color:{c};font-weight:700;flex-shrink:0;">·</span><span>{t}</span></div>'

HTML = f'''<!doctype html>
<html><head><meta charset="utf-8"><script src="./support.js"></script></head><body>
<x-dc>
<helmet>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:wght@700&family=Hanken+Grotesk:wght@400;500;600;700&display=swap">
  <style>
    {faces()}
    body {{ margin:0; font-family:'Hanken Grotesk', system-ui, sans-serif; }}
    * {{ box-sizing:border-box; }}
    .eyebrow {{ font-size:12px; font-weight:700; letter-spacing:.18em; color:#5F656B; }}
  </style>
</helmet>
<div style="width:1280px;height:1120px;background:#FBF8F2;padding:44px 56px;display:flex;flex-direction:column;">
  <div style="display:flex;align-items:center;gap:12px;">
    <div style="background:#0C0D0F;padding:7px 9px;display:flex;">{monograma(22)}</div>
    <div class="eyebrow">MASTERS VALUADORES · FASE 0 · PANTALLAS</div>
  </div>
  <div style="font-family:'Libre Caslon Text',Georgia,serif;font-weight:700;font-size:44px;line-height:1.12;color:#20292B;margin-top:14px;max-width:900px;">
    Armazón dibujado. Contenido, cero.
  </div>
  <div style="font-size:16px;line-height:1.6;color:#3A4A52;margin-top:14px;max-width:940px;">
    Cuatro pantallas construidas sobre el sistema ya cerrado: color en dirección B (ADR-0005),
    Archivo autoalojada (ADR-0002), multigiro (ADR-0003). <strong>Ni un titular, ni una foto,
    ni una cifra.</strong> Todo lo que sería contenido sale como hueco con etiqueta de qué
    trabajo hace, y todo dato de negocio sale como <code>__POR_CONFIRMAR__</code>, a propósito y a la vista.
  </div>

  <div style="margin-top:30px;">
    <div class="eyebrow">VALIDACIÓN — MEDIDA EN NAVEGADOR, NO A OJO</div>
    <div style="display:grid;grid-template-columns:1.5fr 1fr .8fr .7fr .6fr .9fr .8fr;gap:10px;margin-top:11px;padding-bottom:7px;border-bottom:2px solid #20292B;">
      <div style="font-size:11px;font-weight:700;letter-spacing:.1em;color:#5F656B;">ARTBOARD</div>
      <div style="font-size:11px;font-weight:700;letter-spacing:.1em;color:#5F656B;">TAMAÑO</div>
      <div style="font-size:11px;font-weight:700;letter-spacing:.1em;color:#5F656B;">CONTRASTE MÍN.</div>
      <div style="font-size:11px;font-weight:700;letter-spacing:.1em;color:#5F656B;">TÁCTIL MÍN.</div>
      <div style="font-size:11px;font-weight:700;letter-spacing:.1em;color:#5F656B;">HUECOS</div>
      <div style="font-size:11px;font-weight:700;letter-spacing:.1em;color:#5F656B;">POR CONFIRMAR</div>
      <div style="font-size:11px;font-weight:700;letter-spacing:.1em;color:#5F656B;">VEREDICTO</div>
    </div>
    {"".join(fila(c) for c in FILAS)}
    <div style="border-top:1px solid #ECEEEE;"></div>
    <div style="font-size:13px;line-height:1.55;color:#5C6B6F;margin-top:11px;">
      El script recorre cada elemento con texto, resuelve su fondo real subiendo por el árbol y calcula el
      ratio; exige 4.5:1, o 3:1 si el texto es grande. Mide todos los objetivos táctiles y exige 44 × 44,
      salvo lo marcado <code>aria-hidden</code>, que es decorativo. Y busca cifras que parezcan teléfono,
      precio, porcentaje u horario: encontró <strong>cero</strong>.
      Script: <code>diseno/pantallas/validar.mjs</code>.
    </div>
  </div>

  <div style="display:flex;gap:18px;margin-top:28px;flex-grow:1;">
    <div style="flex:1;border:1px solid #DFDAD4;background:#FFFFFF;padding:20px 22px;">
      <div class="eyebrow">LAS DECISIONES DE COMPOSICIÓN QUE SÍ SE TOMARON</div>
      <div style="display:flex;flex-direction:column;gap:9px;margin-top:12px;">
        {li("La página de giro se ordena por <strong>las preguntas del visitante</strong>, no por un temario. ¿Aceptan lo que traigo? · ¿Cuánto y cuándo? · ¿Qué llevo? · ¿Dónde están? · ¿Lo recupero?")}
        {li("La portada es <strong>repartidora</strong>: su trabajo es mandar a la página de giro correcta, no vender ella misma.")}
        {li("Los <strong>giros bloqueados ocupan lugar</strong> en la retícula. Lo que falta decidir se ve, no se esconde.")}
        {li("Los <strong>enlaces cruzados</strong> entre giros no son adorno: sin ellos cada página queda aislada y el multigiro no reparte autoridad.")}
      </div>
    </div>
    <div style="flex:1;background:#20292B;padding:20px 22px;">
      <div class="eyebrow" style="color:#8A9598;">LO QUE FALTA, Y QUÉ LO DESTRABA</div>
      <div style="display:flex;flex-direction:column;gap:9px;margin-top:12px;">
        <div style="display:flex;gap:10px;font-size:15px;line-height:1.55;color:#D7DCDD;"><span style="color:#D6A52F;font-weight:700;">·</span><span><strong style="color:#FFF;">Todo el texto.</strong> 27 huecos etiquetados esperan copy aprobado por el cliente.</span></div>
        <div style="display:flex;gap:10px;font-size:15px;line-height:1.55;color:#D7DCDD;"><span style="color:#D6A52F;font-weight:700;">·</span><span><strong style="color:#FFF;">Todas las fotos.</strong> Bloques grises con la relación de aspecto y qué foto va ahí.</span></div>
        <div style="display:flex;gap:10px;font-size:15px;line-height:1.55;color:#D7DCDD;"><span style="color:#D6A52F;font-weight:700;">·</span><span><strong style="color:#FFF;">NAP y horarios · D-08.</strong> 22 marcas de <code style="color:#D6A52F;">__POR_CONFIRMAR__</code> se cierran con un solo dato por escrito.</span></div>
        <div style="display:flex;gap:10px;font-size:15px;line-height:1.55;color:#D7DCDD;"><span style="color:#D6A52F;font-weight:700;">·</span><span><strong style="color:#FFF;">Slugs y prioridad.</strong> Salen del estudio de búsqueda. El orden de los giros que se ve aquí es provisional y está dicho en la propia página.</span></div>
        <div style="display:flex;gap:10px;font-size:15px;line-height:1.55;color:#D7DCDD;"><span style="color:#D6A52F;font-weight:700;">·</span><span><strong style="color:#FFF;">Nada de esto está implementado.</strong> Son especificaciones dibujadas, no capturas de un sitio que exista. Cero líneas de SvelteKit.</span></div>
      </div>
    </div>
  </div>
</div>
</x-dc></body></html>'''
open("Main.dc.html","w",encoding="utf-8").write(HTML)
print("Main.dc.html escrito")
