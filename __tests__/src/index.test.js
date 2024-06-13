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

const jsonFilePath3 = getFixturePath('file3.json');
const jsonFilePath4 = getFixturePath('file4.json');
const yamlFilePath3 = getFixturePath('file3.yaml');
const yamlFilePath4 = getFixturePath('file4.yaml');
const unknownFilePath1 = getFixturePath('file1.unknown');
const unknownFilePath2 = getFixturePath('file2.unknown');

const stylishOutput = fs
  .readFileSync(path.resolve('./__fixtures__/stylish34.txt'), 'utf8')
  .trim();
const plainOutput = fs
  .readFileSync(path.resolve('./__fixtures__/plain34.txt'), 'utf8')
  .trim();

test('diff two json files with stylish output', () => {
  const output = genDiff(jsonFilePath3, jsonFilePath4, 'stylish');
  expect(output).toEqual(stylishOutput);
});

test('diff two json files with plain output', () => {
  const output = genDiff(jsonFilePath3, jsonFilePath4, 'plain');
  expect(output).toEqual(plainOutput);
});

test('diff two json files with json output', () => {
  const jsonOutput = genDiff(jsonFilePath3, jsonFilePath4, 'json');
  expect(() => JSON.parse(jsonOutput)).not.toThrow();
  const output = getFormatter()(JSON.parse(jsonOutput));
  expect(output).toEqual(stylishOutput);
});

test('diff two yaml files with stylish output', () => {
  const output = genDiff(yamlFilePath3, yamlFilePath4, 'stylish');
  expect(output).toEqual(stylishOutput);
});

test('diff two yaml files with plain output', () => {
  const output = genDiff(yamlFilePath3, yamlFilePath4, 'plain');
  expect(output).toEqual(plainOutput);
});

test('diff two yaml files with json output', () => {
  const jsonOutput = genDiff(yamlFilePath3, yamlFilePath4, 'json');
  expect(() => JSON.parse(jsonOutput)).not.toThrow();
  const output = getFormatter()(JSON.parse(jsonOutput));
  expect(output).toEqual(stylishOutput);
});

test('diff two unknown files with stylish output', () => {
  const output = genDiff(unknownFilePath1, unknownFilePath2, 'stylish');
  expect(output).toEqual('{\n}');
});

test('diff two unknown files with plain output', () => {
  const output = genDiff(unknownFilePath1, unknownFilePath2, 'plain');
  expect(output).toEqual('');
});

test('diff two unknown files with json output', () => {
  const jsonOutput = genDiff(unknownFilePath1, unknownFilePath2, 'json');
  expect(() => JSON.parse(jsonOutput)).not.toThrow();
  const output = JSON.parse(jsonOutput);
  expect(output).toHaveLength(0);
});
