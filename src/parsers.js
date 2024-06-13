import path from 'node:path';
import fs from 'node:fs';
import yaml from 'js-yaml';

const parsers = {
  json: JSON.parse,
  yml: yaml.safeLoad,
  yaml: yaml.safeLoad,
  default: () => {},
};

const getParser = (ext) => (Object.hasOwn(parsers, ext) ? parsers[ext] : parsers.default);

const readObj = (filePath) => {
  const ext = path.extname(filePath).slice(1);
  const data = fs.readFileSync(path.resolve(filePath), 'utf8');
  const parse = getParser(ext);
  return parse(data);
};

export default readObj;
