const { Jimp } = require('jimp');
const path = require('path');

const src  = path.join(__dirname, '../assets/photos/p1_logo.png');
const dest = path.join(__dirname, '../assets/photos/p1_logo.png');

async function trimWhite() {
  const img = await Jimp.read(src);

  const w = img.bitmap.width;
  const h = img.bitmap.height;
  const data = img.bitmap.data;

  // Find bounding box of non-white pixels (threshold: R,G,B all > 240 = white)
  let top = h, bottom = 0, left = w, right = 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      // If NOT white-ish
      if (!(r > 230 && g > 230 && b > 230)) {
        if (y < top)    top    = y;
        if (y > bottom) bottom = y;
        if (x < left)   left   = x;
        if (x > right)  right  = x;
      }
    }
  }

  const pad = 4; // small padding around the content
  top    = Math.max(0, top - pad);
  left   = Math.max(0, left - pad);
  bottom = Math.min(h - 1, bottom + pad);
  right  = Math.min(w - 1, right + pad);

  const cropW = right  - left + 1;
  const cropH = bottom - top  + 1;

  console.log(`Original: ${w}x${h}`);
  console.log(`Crop box: top=${top} left=${left} w=${cropW} h=${cropH}`);

  img.crop({ x: left, y: top, w: cropW, h: cropH });
  await img.write(dest);

  console.log(`✅ Guardado: ${dest}`);
}

trimWhite().catch(console.error);
