module.exports = {
  log: function(type, tag, body) {
    body = this.formatObject(body);
    var date = new Date().toISOString();
    switch (type) {
      case 'debug' :
        sails.log.debug(date, tag + ' :\n', body);
        break;
      case 'error' :
        sails.log.error(date, tag + ' error :\n', body);
        break;
      default :
        sails.log.info(date, tag + ' :\n', body);
    }
  },

  formatObject: function(obj) {
    
    if ((typeof obj) == 'object' && !Array.isArray(obj) && obj !== null) {
      obj = JSON.parse(JSON.stringify(obj));
      if (obj.password) {
        obj.password = '[HIDDEN]';
      }
      if (obj.records && Array.isArray(obj.records) && obj.records.length > 0) {
        obj.records = [];
      }
      obj = JSON.stringify(obj);
    }
    if (Array.isArray(obj) && obj.length > 0) {
      obj = 'Array length = ' + obj.length;
    }
    return obj;
  },

  request: function(req) {
    if (typeof  req === 'undefined' ) {
      throw new Error('Please pass the request info.');
    }

    var request = "Request :: " + req.method + req.url;
    if (Utility.hasKeys(req.headers)) {
      request += '\nHeaders: ' + JSON.stringify(req.headers);
    }
    if (Utility.hasKeys(req.params)) {
      request += '\nParams: ' + JSON.stringify(req.params);
    }
    if (Utility.hasKeys(req.query)) {
      request += '\nQuery: ' + JSON.stringify(req.query);
    }
    if (Utility.hasKeys(req.body)) {
      request += '\nBody: ' + JSON.stringify(req.body);
    }
    if (Utility.hasKeys(req.files)) {
      request += '\nFiles: ' + JSON.stringify(req.files);
    }
    sails.log.info(request)
  },

  response: function(type, req, res) {
    if (typeof type === 'undefined' ) {
      throw new Error('Please pass a type.');
    }
    if (typeof  req === 'undefined' ) {
      throw new Error('Please pass the request info.');
    }

    var response = "Response :: " + req + '\n';
    if (Utility.hasKeys(res)) {
      response += JSON.stringify(res);
    } else {
      response += res;
    }

    if(type == 'error') {
      sails.log.error(response);
    } else {
      sails.log.info(response);
    }
  },
}