var TAG = '[Winston]';
var winston = require('winston')
var winstonRemoteTransport = require('winston-remote').Transport;

module.exports = {

  initialize: function() {
    var ACTION = '[initialize]';
    winston.remove(winston.transports.Console);
    if (process.env.NODE_ENV == "production") {
      winston = new (winston.Logger)({
        transports: [
          new (winstonRemoteTransport)({
            host: sails.config.winston.remote_host, // Remote server ip
            port: sails.config.winston.remote_port // Remote server port
          })
        ]
      });
    } else {
      winston.add(
        winston.transports.File, {
          filename: sails.config.winston.filename,
          level: sails.config.winston.level,
          json: false,
          eol: sails.config.winston.eol,
          timestamp: function() {
            return Date.now();
          },
          formatter: function(options) {
            return options.message;
          }
        }
      );
    }
  },

  log: function(level, tag, body) {
    
    body = this.formatObject(body);
    var date = new Date().toISOString();

    if (level == 'error') {
      tag += ' error';
    }
    winston.log(level, level + ': ' + date + ' ' + tag + ' :\n' + body);

  },


  formatObject: function(obj) {
    if ((typeof obj) == 'object' && !Array.isArray(obj) && obj !== null) {
      obj = JSON.parse(JSON.stringify(obj));
      if (obj.password) {
        obj.password = '[HIDDEN]';
      }
      obj = JSON.stringify(obj);
    }
    if (Array.isArray(obj) && obj.length > 0) {
      obj = 'Array length = ' + obj.length;
    }
    return obj;
  },

}