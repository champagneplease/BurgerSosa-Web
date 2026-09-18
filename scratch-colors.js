const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'frontend/src');

const colorMap = {
  'bg-zinc-950': 'bg-brand-dark',
  'bg-zinc-900': 'bg-brand-surface',
  'bg-zinc-800': 'bg-white/5',
  'border-zinc-800': 'border-white/10',
  'border-zinc-700': 'border-white/20',
  'text-zinc-400': 'text-brand-light/60',
  'text-zinc-500': 'text-brand-light/40',
  'text-zinc-300': 'text-brand-light/80',
  'text-zinc-100': 'text-brand-light',
  'text-zinc-50': 'text-brand-light',
  'amber-500': 'brand-accent',
  'amber-600': 'brand-accent/80',
  'amber-400': 'brand-accent/90',
  'yellow-500': 'brand-accent',
  'yellow-400': 'brand-accent/90',
  'text-white': 'text-brand-light',
  'bg-white': 'bg-brand-btn',
  'text-black': 'text-brand-dark'
};

function replaceColorsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  for (const [oldColor, newColor] of Object.entries(colorMap)) {
    const regex = new RegExp(`\\b${oldColor}\\b`, 'g');
    content = content.replace(regex, newColor);
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated colors in ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      replaceColorsInFile(filePath);
    }
  }
}

walkDir(directoryPath);
console.log('Color replacement complete.');
