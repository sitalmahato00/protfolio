const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imageDir = path.resolve(__dirname, '..', 'public', 'images');
const maxWidth = 800;

fs.readdirSync(imageDir).forEach(file => {
  const ext = path.extname(file).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return;

  const input = path.join(imageDir, file);
  const name = path.basename(file, ext);
  const output = path.join(imageDir, `${name}.webp`);

  if (fs.existsSync(output)) return;

  sharp(input)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(output)
    .then(() => {
      const orig = fs.statSync(input).size;
      const webp = fs.statSync(output).size;
      console.log(`${file} (${(orig/1024).toFixed(0)}KB) → ${name}.webp (${(webp/1024).toFixed(0)}KB)`);
    })
    .catch(err => console.error(`${file}: ${err.message}`));
});
