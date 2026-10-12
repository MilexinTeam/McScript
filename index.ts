import { PNG } from "pngjs";
import fs from "fs";

async function loadPNG(path) {
  const buf = await fs.promises.readFile(path);
  return new Promise((resolve, reject) => {
    new PNG().parse(buf, (err, png) => {
      if (err) reject(err);
      else resolve(png);
    });
  });
}

function drawImage(png) {
  const { width, height, data } = png;

  for (let y = 0; y < height; y += 2) {
    let line = "";

    for (let x = 0; x < width; x++) {
      const i1 = (width * y + x) * 4;       // górny piksel RGBA
      const i2 = (width * (y + 1) + x) * 4; // dolny piksel RGBA

      const p1 = data.slice(i1, i1 + 3); // RGB
      const p2 = data.slice(i2, i2 + 3);

      const top = `\x1b[38;2;${p1[0]};${p1[1]};${p1[2]}m`;
      const bottom = `\x1b[48;2;${p2[0]};${p2[1]};${p2[2]}m`;

      line += `${top}${bottom}▀`;
    }

    console.log(line + "\x1b[0m");
  }
}

(async () => {
  const png = await loadPNG("mcscript.png");
  drawImage(png);
})();
drawImage("./mcscript.png")