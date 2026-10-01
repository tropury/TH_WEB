"""Extrai o monograma 'th' do PNG oficial (fundo preto opaco) gerando
uma versão com fundo transparente e recorte apertado, preservando a
cor exata da marca (#0038F4)."""
import numpy as np
from PIL import Image

SRC = "/home/z/my-project/scripts/brand/treehouse-logo-blue.png"
OUT = "/home/z/my-project/public/brand/th.png"

img = np.array(Image.open(SRC).convert("RGB")).astype(np.float32)

# Alpha derivado do canal dominante (glifo azul sobre preto)
lum = img.max(axis=2)
alpha = np.clip(lum / 190.0 * 255.0, 0, 255).astype(np.uint8)

# Recorte apertado do glifo
ys, xs = np.where(alpha > 10)
y0, y1 = ys.min(), ys.max() + 1
x0, x1 = xs.min(), xs.max() + 1

h, w = alpha.shape
rgba = np.zeros((h, w, 4), np.uint8)
rgba[..., 0] = 0    # R — azul de marca
rgba[..., 1] = 56   # G
rgba[..., 2] = 244  # B
rgba[..., 3] = alpha
crop = rgba[y0:y1, x0:x1]

Image.fromarray(crop, "RGBA").save(OUT)
print("saved", OUT, "size:", crop.shape[1], "x", crop.shape[0])
