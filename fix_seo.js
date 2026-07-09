const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!fullPath.includes('node_modules') && !fullPath.includes('.next')) {
        processDir(fullPath);
      }
    } else {
      if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.svg')) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let modified = false;

        // 1. Fix w3.org
        if (content.includes('http://www.w3.org')) {
          content = content.replace(/http:\/\/www\.w3\.org/g, 'https://www.w3.org');
          modified = true;
        }

        // 2. Fix h1 itemProp="name" to h2
        if (content.includes('<h1 itemProp="name">')) {
          content = content.replace(/<h1 itemProp="name">(.*?)<\/h1>/gs, '<h2 itemProp="name">$1</h2>');
          modified = true;
        }

        // 3. Fix x-default hreflang
        // Only if it has languages: { 'en-US': ... } and no x-default
        if (content.includes('languages: {') && !content.includes("'x-default':")) {
          // Find the value of 'en-US' and copy it for 'x-default'
          const regex = /languages:\s*\{\s*'en-US':\s*([^,]+),/g;
          content = content.replace(regex, "languages: {\n        'en-US': $1,\n        'x-default': $1,");
          modified = true;
        }

        if (modified) {
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log('Fixed', fullPath);
        }
      }
    }
  }
}

processDir('d:/Project/APXTeck/APX_OFFICIAL_FRONTEND/src');
processDir('d:/Project/APXTeck/APX_OFFICIAL_FRONTEND/public');
