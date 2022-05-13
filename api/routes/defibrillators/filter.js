const { USER, ADMIN } = require('../../../shared/consts');

const createFilter = (req) => {
  const { query } = req;
  const filter = { $or: [] };
  const skipKeys = [
    'page',
    'per_page',
    'longitude',
    'latitude'
  ];

  Object.keys(query).forEach((key) => {
    if (!skipKeys.includes(key)) {
      filter.$or.push({ [key]: new RegExp(query[key], 'i') })
    }
  });

  if (filter.$or.length === 0) {
    delete filter.$or
  }

  const authorized =
    req.role === ADMIN || req.role === USER;
  if (!authorized) {
    filter['blocked'] = { $ne: true };
  }

  return filter;
};

module.exports = { createFilter };
