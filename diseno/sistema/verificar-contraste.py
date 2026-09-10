# -*- coding: utf-8 -*-
import re, glob, sys
def lin(c):
    c=c/255
    return c/12.92 if c<=0.04045 else ((c+0.055)/1.055)**2.4
def L(h):
    h=h.lstrip('#'); return 0.2126*lin(int(h[0:2],16))+0.7152*lin(int(h[2:4],16))+0.0722*lin(int(h[4:6],16))
def cr(a,b):
    la,lb=L(a),L(b); hi,lo=max(la,lb),min(la,lb); return (hi+0.05)/(lo+0.05)

fallos=[]

# 1 · cada ratio afirmado en la hoja de Color, recalculado
afirmados = [
 ("#0C0D0F","#FFFFFF","19.44",4.5),("#474C51","#FFFFFF","8.68",4.5),
 ("#FFFFFF","#0C0D0F","19.44",4.5),("#0C0D0F","#B58000","5.60",4.5),
 ("#D6A52F","#0C0D0F","8.59",4.5),("#B58000","#FFFFFF","3.47",3.0),
 ("#B58000","#F0EFED","3.02",3.0),("#8C6300","#FFFFFF","5.38",4.5),
 ("#AEB4B9","#FFFFFF","2.09",None),("#5F656B","#FFFFFF","5.90",3.0),
]
for a,b,dicho,minimo in afirmados:
    real = cr(a,b)
    if f"{real:.2f}" != dicho:
        fallos.append(f"RATIO MAL CITADO {a}/{b}: la hoja dice {dicho}, real {real:.2f}")
    if minimo and real < minimo:
        fallos.append(f"NO ALCANZA {a}/{b}: {real:.2f} < {minimo}")

# 2 · el par que la hoja marca como Falla debe fallar de verdad
for a,b,piso in [("#B58000","#FFFFFF",4.5),("#AEB4B9","#FFFFFF",3.0)]:
    if cr(a,b) >= piso:
        fallos.append(f"MARCADO COMO FALLA PERO PASA: {a}/{b} = {cr(a,b):.2f}")

# 3 · ningún token viejo sobrevive fuera de la mención deliberada
for f in glob.glob("*.dc.html")+["monograma.svg"]:
    s=open(f,encoding='utf-8').read()
    for tok in ("#9A7A22","#CCB642","#14181A","acero-"):
        if tok in s: fallos.append(f"TOKEN RETIRADO VIVO en {f}: {tok}")
    n = s.count("#E7C041")
    if n and f!="Color.dc.html": fallos.append(f"#E7C041 en {f} ({n})")
    if f=="Color.dc.html" and n!=1: fallos.append(f"#E7C041 en Color.dc.html aparece {n} veces, se esperaba 1 (la mención de reserva)")

# 4 · el oro nunca se usa como texto sobre superficie clara
for f in glob.glob("*.dc.html"):
    s=open(f,encoding='utf-8').read()
    for m in re.finditer(r'color:\s*#B58000', s):
        ctx  = s[max(0,m.start()-260):m.start()].replace(' ','')
        post = s[m.start():m.start()+300]
        sobre_oscuro = 'background:#0C0D0F' in ctx or 'background:#16181B' in ctx
        demostracion = 'Falla' in post          # el renglón que enseña a propósito que no alcanza
        if not sobre_oscuro and not demostracion:
            fallos.append(f"POSIBLE oro-500 COMO TEXTO SOBRE CLARO en {f} @{m.start()}")

print("\n".join(fallos) if fallos else "OK — 0 hallazgos")
sys.exit(1 if fallos else 0)
