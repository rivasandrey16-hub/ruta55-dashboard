const fs = require('fs');
const path = require('path');

const photosDir = path.join(__dirname, '../assets/photos');
const outputFile = path.join(__dirname, '../assets/photos-base64.js');

const files = {
  p1: 'p1_logo.png',
  p2: 'p2_collage.png',
  p3: 'p3_parrilla.png',
  p4: 'p4_picada.png',
  p5: 'p5_menu.png'
};

let output = 'window.PHOTOS = {\n';

for (const [key, filename] of Object.entries(files)) {
  const filepath = path.join(photosDir, filename);
  if (fs.existsSync(filepath)) {
    const data = fs.readFileSync(filepath);
    const b64 = data.toString('base64');
    const ext = filename.split('.').pop();
    const mime = ext === 'jpg' ? 'image/jpeg' : 'image/png';
    output += `  ${key}: "data:${mime};base64,${b64}",\n`;
    console.log(`✓ ${key} embebido (${Math.round(b64.length/1024)}kb)`);
  } else {
    output += `  ${key}: null,\n`;
    console.warn(`⚠ ${filename} no encontrado — usando null`);
  }
}

output += '};\n';
fs.writeFileSync(outputFile, output);
console.log('\n✅ photos-base64.js generado. Copia el contenido en window.PHOTOS del HTML.');
