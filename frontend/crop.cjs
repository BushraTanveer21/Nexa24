const Jimp = require('jimp');
const path = require('path');

async function cropTree() {
  const imagePath = path.join('public', 'tree-bg.jpg');
  const outPath = path.join('public', 'cropped-tree.png');
  
  try {
    const image = await Jimp.read(imagePath);
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    
    // The tree is located in the hero section (top right)
    const cropX = Math.floor(width * 0.45); // Right half
    const cropY = Math.floor(height * 0.05); // Skip header
    const cropWidth = Math.floor(width * 0.5); 
    const cropHeight = Math.floor(height * 0.25); // Roughly the hero height
    
    image.crop(cropX, cropY, cropWidth, cropHeight);
    await image.writeAsync(outPath);
    console.log('Successfully cropped tree to public/cropped-tree.png');
  } catch (err) {
    console.error('Error cropping image:', err);
  }
}

cropTree();
