import { ADD_ACTION, RM_ACTION } from '../src/actions.js';

const getPrefix = (type) => {
  switch (type) {
    case ADD_ACTION:
      return '+ ';
    case RM_ACTION:
      return '- ';
    default:
      return '';
  }
};

const padStart = (type, n) => getPrefix(type).padStart(n);

const fmtLine = (type, key, value, padLength = 0) => `${padStart(type, padLength)}${key}: ${value}`;

const stylishComplex = (complexValue, lvl, pad = 4) => `${Object.entries(complexValue).reduce(
  (acc, [key, value]) => {
    if (typeof value === 'object' && value !== null) {
      return `${acc}\n${fmtLine(null, key, stylishComplex(value, lvl + pad), lvl + pad)}`;
    }
    return `${acc}\n${fmtLine(null, key, value, lvl + pad)}`;
  },
  '{',
)}\n${padStart(null, lvl)}}`;

const stylish = (diffList, lvl = 0, pad = 4) => {
  const getStylishValue = (value, valuePad, complex = false) => {
    if (Array.isArray(value) === true) {
      return stylish(value, valuePad);
    }
    if (complex === true) {
      return stylishComplex(value, valuePad);
    }
    return value;
  };

  return `${diffList.reduce((acc, {
    name, value, type, complex,
  }) => {
    const line = fmtLine(type, name, getStylishValue(value, lvl + pad, complex), lvl + pad);
    return `${acc}\n${line}`;
  }, '{')}\n${padStart(null, lvl)}}`;
};

export default stylish;
