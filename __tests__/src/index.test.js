import path from 'node:path';
import fs from 'node:fs';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import genDiff from '../../src/index.js';
import getFormatter from '../../formatters/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path
  .join(__dirname, '..', '..', '__fixtures__', filename);

const makeMsg = (ext, formatName) => `diff two ${ext} files with ${formatName} output'`;

const inputFiles = {};
const expectedOutput = { json: {}, yaml: {}, unknown: {} };

beforeAll(() => {
  inputFiles.json = [getFixturePath('file3.json'), getFixturePath('file4.json')];
  inputFiles.yaml = [getFixturePath('file3.yaml'), getFixturePath('file4.yaml')];
  inputFiles.unknown = [getFixturePath('file1.unknown'), getFixturePath('file2.unknown')];

  const stylishOutput = fs
    .readFileSync(getFixturePath('stylish34.txt'), 'utf8')
    .trim();
  const plainOutput = fs
    .readFileSync(getFixturePath('plain34.txt'), 'utf8')
    .trim();

  expectedOutput.json.stylish = stylishOutput;
  expectedOutput.json.plain = plainOutput;
  expectedOutput.json.json = stylishOutput;
  expectedOutput.yaml.stylish = stylishOutput;
  expectedOutput.yaml.plain = plainOutput;
  expectedOutput.yaml.json = stylishOutput;
  expectedOutput.unknown.stylish = '{\n}';
  expectedOutput.unknown.plain = '';
  expectedOutput.unknown.json = '{\n}';
});

[
  ['json', 'stylish'],
  ['json', 'plain'],
  ['yaml', 'stylish'],
  ['yaml', 'plain'],
  ['unknown', 'stylish'],
  ['unknown', 'plain'],
].forEach(([ext, formatName]) => test(makeMsg(ext, formatName), () => {
  const [filePath1, filePath2] = inputFiles[ext];
  const output = genDiff(filePath1, filePath2, formatName);
  expect(output).toEqual(expectedOutput[ext][formatName]);
}));

[
  ['json', 'json'],
  ['yaml', 'json'],
  ['unknown', 'json'],
].forEach(([ext, formatName]) => test(makeMsg(ext, formatName), () => {
  const [filePath1, filePath2] = inputFiles[ext];
  const jsonOutput = genDiff(filePath1, filePath2, formatName);
  expect(() => JSON.parse(jsonOutput)).not.toThrow();
  const output = getFormatter()(JSON.parse(jsonOutput));
  expect(output).toEqual(expectedOutput[ext][formatName]);
}));
