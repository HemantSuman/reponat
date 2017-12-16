var fs        = require("fs");
var path      = require("path");
//var Sequelize = require("sequelize");
//var env       = process.env.NODE_ENV || "development";
//var config    = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
//if (process.env.DATABASE_URL) {
//  var sequelize = new Sequelize(process.env.DATABASE_URL,config);
//} else {
//  var sequelize = new Sequelize(config.database, config.username, config.password, config);
//}
var db        = {};
//var sequelize = require('./config/db');
var mysql = require('mysql');
var Sequelize = require('sequelize');
var env = require('../config/env');

var sequelize = new Sequelize(env.db.database, env.db.user, env.db.password, {
    host: env.db.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    define: {
        timestamps: false, // true by default
        dateStrings:true
    },
    logging: true,
    dateStrings:true
});
//console.log(sequelize);
fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

//db.Country.hasOne(db.Currency,{foreignKey : 'currency_id'})
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;