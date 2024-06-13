import { ADD_ACTION, RM_ACTION } from '../src/actions.js';

const padStart = (type, n) => {
  let preffix = '';
  switch (type) {
    case ADD_ACTION:
      preffix = '+ ';
      break;
    case RM_ACTION:
      preffix = '- ';
      break;
    default:
      break;
  }
  return preffix.padStart(n);
};

const fmtLine = (type, key, value, padLength = 0) => `${padStart(type, padLength)}${key}: ${value}`;

const stylishComplex = (complexValue, lvl, pad = 4) => `${Object.entries(complexValue).reduce((acc, [key, value]) => {
  let line = '';
  if (typeof value === 'object' && value !== null) {
    line = fmtLine(null, key, stylishComplex(value, lvl + pad), lvl + pad);
  } else {
    line = fmtLine(null, key, value, lvl + pad);
  }
  return `${acc}\n${line}`;
}, '{')}\n${padStart(null, lvl)}}`;

const stylish = (diffList, lvl = 0, pad = 4) => `${diffList.reduce((acc, {
  name, value, type, complex,
}) => {
  let stylishValue = value;
  if (Array.isArray(value) === true) {
    stylishValue = stylish(value, lvl + pad);
  }
  if (complex === true) {
    stylishValue = stylishComplex(value, lvl + pad);
  }
  const line = fmtLine(type, name, stylishValue, lvl + pad);
  return `${acc}\n${line}`;
}, '{')}\n${padStart(null, lvl)}}`;

export default stylish;
