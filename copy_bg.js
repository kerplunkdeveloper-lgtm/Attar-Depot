const fs = require('fs');
const path = require('path');

const srcPath = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\f549dd6a-b487-437f-9e5a-a79f1646842f\\luxury_marble_bg_1789794069156.jpg';
const destPath = path.join(__dirname, 'frontend', 'public', 'images', 'luxury-marble-bg.jpg');

fs.copyFileSync(srcPath, destPath);
console.log('Successfully copied marble background image to:', destPath);
