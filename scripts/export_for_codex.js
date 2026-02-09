
import fs from 'fs';
import path from 'path';

const rootDir = '/Users/jeffersonreis/.gemini/antigravity/scratch/dentist-copilot/modern-aura';
const outputFile = path.join(rootDir, 'modern-aura-codex-export.md');

const ignoreDirs = ['node_modules', '.git', 'dist', '.gemini', 'assets'];
const ignoreExtensions = ['.svg', '.png', '.jpg', '.jpeg', '.pdf', '.zip'];

function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (!ignoreDirs.includes(file)) {
        getFiles(filePath, fileList);
      }
    } else {
      if (!ignoreExtensions.includes(path.extname(file))) {
        fileList.push(filePath);
      }
    }
  });
  return fileList;
}

const allFiles = getFiles(rootDir);
let exportContent = '# Modern Aura - Full Project Export for Codex\n\n';

allFiles.forEach(file => {
  const relativePath = path.relative(rootDir, file);
  const content = fs.readFileSync(file, 'utf8');
  const ext = path.extname(file).slice(1) || 'text';
  
  exportContent += `## File: ${relativePath}\n`;
  exportContent += `\`\`\`${ext}\n`;
  exportContent += content;
  exportContent += `\n\`\`\`\n\n---\n\n`;
});

fs.writeFileSync(outputFile, exportContent);
console.log(`✅ Project exported to: ${outputFile}`);
