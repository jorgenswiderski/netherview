import fs from 'fs';
import packageJson from '../package.json';

const content = `export const PACKAGE_VERSION = '${packageJson.version}';\n`;
fs.writeFileSync('version.ts', content);

// eslint-disable-next-line no-console
console.log('Version file created successfully!');
