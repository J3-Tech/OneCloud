var Sequelize = require('Sequelize');
var sequelize = require('./utils/Database');
var File = sequelize.define('file', {
  name: {
    type: Sequelize.STRING,
    field: 'name'
  },
  service: {
    type: Sequelize.STRING
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

var Service = sequelize.define('service', {
    name: {
        type: Sequelize.STRING,
        field: 'name',
    },
    accessToken: {
        type: Sequelize.STRING
    }
})

File.hasMany(Service);

exports.File = File;
exports.Service = Service;

/*
File.sync({force: true}).then(function () {
  // Table created
  return File.create({
    firstName: 'John',
    lastName: 'Hancock'
  });
});
*/
