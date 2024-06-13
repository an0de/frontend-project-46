import readObj from './parsers.js';
import getFormatter from '../formatters/index.js';
import { ADD_ACTION, HOLD_ACTION, RM_ACTION } from './actions.js';

const makeDiffItem = (name, value, type) => ({
  name,
  value,
  type,
  complex: typeof value === 'object' && value !== null && !Array.isArray(value),
});

const makeDiffList = (obj1, obj2) => Object.keys({ ...obj1, ...obj2 })
  .sort()
  .reduce((acc, name) => {
    const value1 = obj1[name];
    const value2 = obj2[name];
    if (value1 === undefined) {
      acc.push(makeDiffItem(name, value2, ADD_ACTION));
    } else if (value2 === undefined) {
      acc.push(makeDiffItem(name, value1, RM_ACTION));
    } else if (typeof value1 === typeof value2 && typeof value1 === 'object') {
      acc.push(
        makeDiffItem(name, makeDiffList(value1, value2), HOLD_ACTION),
      );
    } else if (value1 !== value2) {
      acc.push(makeDiffItem(name, value1, RM_ACTION));
      acc.push(makeDiffItem(name, value2, ADD_ACTION));
    } else {
      acc.push(makeDiffItem(name, value1, HOLD_ACTION));
    }
    return acc;
  }, []);

const genDiff = (filePath1, filePath2, formatName) => {
  const obj1 = readObj(filePath1);
  const obj2 = readObj(filePath2);
  const format = getFormatter(formatName);
  const diffs = makeDiffList(obj1, obj2);
  return format(diffs);
};

export default genDiff;
