const User = require('./user');
const Event = require('./event');

User.hasMany(Event, {foreignKey: 'createdBy'});
Event.belongsTo(User, {foreignKey: 'createdBy'});

module.exports = {Event, User};