import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadTestData(fileName) 
{
  const filePath = path.resolve(__dirname, `../test-data/${fileName}`);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}