const { USER, ADMIN } = require('./user-role-state');
const {
  PRESENT,
  MISSING,
  PRESENT_IN_BUILDING,
  PRESENT_NEAR_APPLIANCE
} = require('./informational-plate-state');

module.exports = {
  USER,
  ADMIN,

  PRESENT,
  MISSING,
  PRESENT_IN_BUILDING,
  PRESENT_NEAR_APPLIANCE
};
