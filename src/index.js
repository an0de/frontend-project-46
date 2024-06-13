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
  .toSorted()
  .reduce((acc, name) => {
    const value1 = obj1[name];
    const value2 = obj2[name];
    if (value1 === undefined) {
      return [...acc, makeDiffItem(name, value2, ADD_ACTION)];
    } if (value2 === undefined) {
      return [...acc, makeDiffItem(name, value1, RM_ACTION)];
    } if (typeof value1 === typeof value2 && typeof value1 === 'object') {
      return [
        ...acc, makeDiffItem(name, makeDiffList(value1, value2), HOLD_ACTION),
      ];
    } if (value1 !== value2) {
      return [...acc, makeDiffItem(name, value1, RM_ACTION),
        makeDiffItem(name, value2, ADD_ACTION)];
    }
    return [...acc, makeDiffItem(name, value1, HOLD_ACTION)];
  }, []);

const genDiff = (filePath1, filePath2, formatName) => {
  const obj1 = readObj(filePath1);
  const obj2 = readObj(filePath2);
  const format = getFormatter(formatName);
  const diffs = makeDiffList(obj1, obj2);
  return format(diffs);
};

export default genDiff;
