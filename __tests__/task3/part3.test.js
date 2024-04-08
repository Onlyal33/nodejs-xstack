import path from 'node:path';
import { fileURLToPath } from 'node:url';

import csvToJson from '../../src/task3/csvToJson.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(__dirname, '../../__fixtures__/task3');

const csvFilePath = path.join(fixturesDir, 'csv/data.csv');
const txtFilePath = path.join(fixturesDir, 'output.txt');

csvToJson(csvFilePath, txtFilePath);
