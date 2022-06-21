import { isObject, keys } from 'lodash';

export const paramsInterceptor = (params) => {
  const newParams = { ...params }
  if (isObject(newParams)) {
    keys(newParams).forEach(key => {
      if (!newParams[key]) {
        delete newParams[key];
      }
    });
  };
  return newParams
}
