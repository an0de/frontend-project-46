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

const collectLines = (diffList, objName = null) => {
  const lines = [];
  let index = 0;
  while (index !== diffList.length) {
    const { name, value, type } = diffList[index];
    const {
      name: nextName,
      value: nextValue,
      type: nextType,
    } = diffList[index + 1] ?? {};
    if (Array.isArray(value) === true) {
      lines.push(...collectLines(value, getPropertyName(objName, name)));
      index += 1;
    } else if (
      name === nextName
      && type === RM_ACTION
      && nextType === ADD_ACTION
    ) {
      lines.push(makeUpdateLine(objName, name, value, nextValue));
      index += 2;
    } else if (type === RM_ACTION || type === ADD_ACTION) {
      lines.push(makeLine(objName, name, value, type));
      index += 1;
    } else {
      index += 1;
    }
  }
  return lines;
};

export default (diffList) => collectLines(diffList).join('\n');
