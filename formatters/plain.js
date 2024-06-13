import { ADD_ACTION, RM_ACTION } from '../src/actions.js';

const getValue = (value) => {
  if (typeof value === 'object' && value !== null) {
    return '[complex value]';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return value;
};

const getPropertyName = (objName, propName) => (objName !== null ? `${objName}.${propName}` : propName);

const makeLine = (objName, propName, value, type) => {
  switch (type) {
    case ADD_ACTION:
      return `Property '${getPropertyName(objName, propName)}' was added with value: ${getValue(value)}`;
    case RM_ACTION:
      return `Property '${getPropertyName(objName, propName)}' was removed`;
    default:
      return '';
  }
};

const makeUpdateLine = (objName, propName, value1, value2) => `Property \
'${getPropertyName(objName, propName)}' was updated. \
From ${getValue(value1)} to ${getValue(value2)}`;

const collectLines = (diffList, objName = null) => diffList
  .reduce((acc, { name, value, type }, index) => {
    const { name: prevName, value: prevValue, type: prevType } = diffList[index - 1] ?? {};
    if (Array.isArray(value) === true) {
      return [...acc, ...collectLines(value, getPropertyName(objName, name))];
    } if (name === prevName && prevType === RM_ACTION && type === ADD_ACTION) {
      return [...acc.slice(0, -1), makeUpdateLine(objName, name, prevValue, value)];
    } if (type === RM_ACTION || type === ADD_ACTION) {
      return [...acc, makeLine(objName, name, value, type)];
    }
    return acc;
  }, []);

export default (diffList) => collectLines(diffList).join('\n');
