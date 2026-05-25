const fs = require('fs');
const path = require('path');

const dir = __dirname;
console.log('Extracting buildNav from HTML files in ' + dir);

fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.html')) {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const regex = /(async\s+)?function\s+buildNav\s*\([\s\S]*?\{/;
    const match = content.match(regex);
    if (match) {
      const startIdx = match.index;
      let braceCount = 0;
      let endIdx = -1;
      for (let i = startIdx; i < content.length; i++) {
        if (content[i] === '{') braceCount++;
        else if (content[i] === '}') {
          braceCount--;
          if (braceCount === 0) {
            endIdx = i + 1;
            break;
          }
        }
      }
      if (endIdx !== -1) {
        const funcStr = content.substring(startIdx, endIdx);
        const lines = funcStr.split('\n');
        console.log(`\n==================== ${file} ====================`);
        if (lines.length <= 40) {
          console.log(funcStr);
        } else {
          console.log(lines.slice(0, 20).join('\n'));
          console.log('...');
          console.log(lines.slice(-20).join('\n'));
        }
      }
    }
  }
});
