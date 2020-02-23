var mysql = require('mysql');
var fs = require('fs');
var async = require('async');
var parse = require('csv-parse');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'devuser',
  password : 'devuser123',
  database : 'cilantro'
});
  
connection.connect();

async.auto({
  dropTable: function(callback) {
    connection.query('DROP TABLE IF EXISTS activationcode', function(err, rows, fields) {
      if (err) {
        console.log("Database error dropTable");
        console.log(err);
        return callback(err);
      }
      callback();
    });
  },
  createTable: ['dropTable', function(callback) {
    var query = 'CREATE TABLE `activationcode` ( ' +
      '`id` varchar(255) DEFAULT NULL,' +
      '`msisdn` varchar(255) DEFAULT NULL,' +
      '`activation_code` varchar(255) DEFAULT NULL,' +
      'UNIQUE KEY `id` (`id`)' +
       ' ) ENGINE=InnoDB DEFAULT CHARSET=utf8;';

    connection.query(query, function(err, rows, fields) {
      if (err) {
        console.log("Database error createTable");
        console.log(err);
        return callback(err);
      }
      callback();
    });
  }],
  generateInsert: ['createTable', function(callback) {
    var query = "INSERT INTO `activationcode` (id, msisdn, activation_code) VALUES ";
    var ctr = 1;
    var parser = parse({delimiter: ';'}, function(err, data) {
      data.splice(0,1);
      data.forEach(function(row) {
        var temp = row[0].split(',');
        query += '('+ ctr +', "' + temp[1] + '", "' + temp[2] + '")';
        query += ctr < data.length ? ',' : ';';
        ctr++;
      });
      callback(null, query);
    });
    fs.createReadStream(__dirname+'/Activation_Codes.csv').pipe(parser);
  }],
  insert: ['generateInsert', function(callback, result) {
    console.log(result.generateInsert);
    connection.query(result.generateInsert, function(err, rows, fields) {
      if (err) {
        console.log("Database error insert");
        console.log(err);
        return callback(err);
      }
      callback();
    });
  }]
}, function(err, result) {
  connection.end();
});





