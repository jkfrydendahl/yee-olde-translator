/**
 * Icon Generator for Ye Olde Translator
 * 
 * Run this script to generate the PNG icons for iOS home screen and PWA.
 * 
 * Usage:
 *   node scripts/generate-icons.js
 * 
 * This will create:
 *   - public/apple-touch-icon.png (180x180)
 *   - public/icon-192.png (192x192)
 *   - public/icon-512.png (512x512)
 */

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

function generateIcon(size, filename) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background - forest green gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#3D7A52');
  gradient.addColorStop(1, '#2D5A3D');
  ctx.fillStyle = gradient;
  
  // Rounded rectangle background
  const radius = size * 0.2;
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(size - radius, 0);
  ctx.quadraticCurveTo(size, 0, size, radius);
  ctx.lineTo(size, size - radius);
  ctx.quadraticCurveTo(size, size, size - radius, size);
  ctx.lineTo(radius, size);
  ctx.quadraticCurveTo(0, size, 0, size - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.fill();

  // Gold border
  ctx.strokeStyle = '#D4A84B';
  ctx.lineWidth = size * 0.02;
  ctx.stroke();

  // Scroll emoji 📜
  ctx.font = `${size * 0.55}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji"`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('📜', size / 2, size / 2 + size * 0.02);

  // Save to file
  const buffer = canvas.toBuffer('image/png');
  const outputPath = path.join(__dirname, '..', 'public', filename);
  fs.writeFileSync(outputPath, buffer);
  console.log(`✓ Generated ${filename} (${size}x${size})`);
}

// Generate all icon sizes
console.log('Generating icons for Ye Olde Translator...\n');
generateIcon(180, 'apple-touch-icon.png');
generateIcon(192, 'icon-192.png');
generateIcon(512, 'icon-512.png');
console.log('\n✅ All icons generated successfully!');
