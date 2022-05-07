const { USER, ADMIN } = require('../../../shared/consts');

const createFilter = (req) => {
  const { query } = req;
  const filter = {};
  const skipKeys = [
    'page',
    'per_page',
    'longitude',
    'latitude'
  ];

  Object.keys(query).forEach((key) => {
    if (!skipKeys.includes(key)) {
      filter[key] = new RegExp(query[key], 'i');
    }
  });

  const authorized =
    req.role === ADMIN || req.role === USER;
  if (!authorized) {
    filter['blocked'] = { $ne: true };
  }

  return filter;
};

module.exports = { createFilter };
