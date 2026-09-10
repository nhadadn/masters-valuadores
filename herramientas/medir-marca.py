# -*- coding: utf-8 -*-
"""Mide el amarillo del monograma en las cinco publicaciones que el cliente tiene vivas.
La pregunta que decide: ¿el amarillo plano es solo de maquinaria, o es de toda la marca?"""
from PIL import Image
import numpy as np
from collections import Counter

PIEZAS = [
 ("maquinaria",    "4d4eb4bd-image.jpg", (0.02, 0.02, 0.16, 0.14)),
 ("importaciones", "595b66cf-image.jpg", (0.03, 0.06, 0.15, 0.16)),
 ("renta ligera",  "8cc6197a-image.jpg", (0.20, 0.03, 0.32, 0.16)),
 ("joyería",       "5ae496f9-image.jpg", (0.03, 0.04, 0.15, 0.15)),
 ("monedas",       "ad990f6d-image.jpg", (0.02, 0.02, 0.14, 0.13)),
]

def hexs(c): return "#%02X%02X%02X" % tuple(int(x) for x in c)

def amarillos(px):
    """Píxeles claramente amarillos: R alto, G medio-alto, B bajo, y saturados."""
    r, g, b = px[:,:,0].astype(int), px[:,:,1].astype(int), px[:,:,2].astype(int)
    m = (r > 120) & (g > 80) & (b < 120) & (r - b > 70) & (r >= g)
    return px[m]

print(f"{'pieza':16} {'moda':9} {'p50':9} {'n px':>7}  top 3 modas")
print("-"*78)
todos = []
for nombre, arch, (x0,y0,x1,y1) in PIEZAS:
    im = Image.open(arch).convert("RGB")
    W, H = im.size
    caja = im.crop((int(x0*W), int(y0*H), int(x1*W), int(y1*H)))
    px = np.array(caja)
    am = amarillos(px)
    if len(am) < 50:
        print(f"{nombre:16} sin amarillo suficiente en la caja ({len(am)} px) — revisar recorte")
        continue
    # cuantizar a pasos de 4 para que el JPG no invente 400 tonos
    q = (am // 4 * 4)
    cont = Counter(map(tuple, q))
    top = cont.most_common(3)
    p50 = np.median(am, axis=0)
    todos.append(am)
    print(f"{nombre:16} {hexs(top[0][0]):9} {hexs(p50):9} {len(am):>7}  " +
          " ".join(hexs(c) for c,_ in top))

if todos:
    j = np.concatenate(todos)
    q = (j // 4 * 4)
    print("-"*78)
    print(f"{'LAS CINCO':16} {hexs(Counter(map(tuple,q)).most_common(1)[0][0]):9} {hexs(np.median(j,axis=0)):9} {len(j):>7}")
