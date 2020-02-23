var TAG = '[Basil]';
var qs = require('qs');

module.exports = {

  getList: function(options, cb) {
    var ACTION = '[getAccount]';
    var _this = this;
    var ref_num = Utility.getRefNum();
    var req_options = {};
    var query_string = qs.stringify(options);
    if (query_string) {
      query_string = '?' + query_string;
    }
    req_options.url = sails.config.basil.url + '/v1/accounts' + query_string;
    req_options.method = 'GET';
    req_options.json = true;

    var requestclient = new RequestClient();
    requestclient.request.bind(requestclient);
    requestclient.request('BASIL', req_options, ref_num, function(err, result) {
      if (err) {
        cb(_this.parseError(err, ref_num));
      } else {
        cb(null, result);
      }
    });
  },

  getAccount: function(options, cb) {
    var ACTION = '[getAccount]';
    var _this = this;
    var ref_num = Utility.getRefNum();
    
    options.url = sails.config.basil.url + '/v1/accounts/' + options.id;
    if (options.app_name) {
      options.url += "?app=" + options.app_name;
    }
    options.method = 'GET';
    options.json = true;

    var requestclient = new RequestClient();
    requestclient.request.bind(requestclient);
    requestclient.request('BASIL', options, ref_num, function(err, result) {
      if (err) {
        cb(_this.parseError(err, ref_num));
      } else {
        cb(null, result);
      }
    });
  },

  getAccounts: function(options, cb) {
    var ACTION = '[getAccounts]';
    var _this = this;
    var ref_num = Utility.getRefNum();
    
    options.url = sails.config.basil.url + '/v1/accounts/';
    if (options.app_name) {
      options.url += "?app=" + options.app_name;
    }
    options.method = 'GET';
    options.json = true;

    var requestclient = new RequestClient();
    requestclient.request.bind(requestclient);
    requestclient.request('BASIL', options, ref_num, function(err, result) {
      if (err) {
        cb(_this.parseError(err, ref_num));
      } else {
        cb(null, result);
      }
    });
  },

  createAccount: function(options, cb) {
    var ACTION = '[createAccount]';
    var _this = this;
    var ref_num = Utility.getRefNum();

    options.url = sails.config.basil.url + '/v1/accounts';
    options.method = 'POST';
    options.body = options.body;
    options.json = true;

    var requestclient = new RequestClient();
    requestclient.request.bind(requestclient);
    requestclient.request('BASIL', options, ref_num, function(err, result) {
      if (err) {
        cb(_this.parseError(err, ref_num));
      } else {
        cb(null, result);
      }
    });
  },

  linkList: function(options, cb) {
    var ACTION = '[createAccount]';
    var _this = this;
    var ref_num = Utility.getRefNum();

    options.url = sails.config.basil.url + '/v1/access/' + options.body.auth0_id + '/list';
    options.method = 'GET';
    options.body = options.body;
    options.json = true;

    var requestclient = new RequestClient();
    requestclient.request.bind(requestclient);
    requestclient.request('BASIL', options, ref_num, function(err, result) {
      if (err) {
        cb(_this.parseError(err, ref_num));
      } else {
        cb(null, result);
      }
    });
  },

  linkAccount: function(options, cb) {
    var ACTION = '[createAccount]';
    var _this = this;
    var ref_num = Utility.getRefNum();

    options.url = sails.config.basil.url + '/v1/access/' +options.body.auth0_id + '/link/';
    options.method = 'POST';
    options.body = options.body;
    options.json = true;

    var requestclient = new RequestClient();
    requestclient.request.bind(requestclient);
    requestclient.request('BASIL', options, ref_num, function(err, result) {
      if (err) {
        cb(_this.parseError(err, ref_num));
      } else {
        cb(null, result);
      }
    });
  },

  unlinkAccount: function(options, cb) {
    var ACTION = '[createAccount]';
    var _this = this;
    var ref_num = Utility.getRefNum();

    options.url = sails.config.basil.url + '/v1/access/' + options.body.auth0_id + '/unlink/';
    options.method = 'POST';
    options.body = options.body;
    options.json = true;

    var requestclient = new RequestClient();
    requestclient.request.bind(requestclient);
    requestclient.request('BASIL', options, ref_num, function(err, result) {
      if (err) {
        cb(_this.parseError(err, ref_num));
      } else {
        cb(null, result);
      }
    });
  },

  updateAccount: function(options, cb) {
    var ACTION = '[updateAccount]';
    var _this = this;
    var ref_num = Utility.getRefNum();

    options.url = sails.config.basil.url + '/v1/accounts/' + options.body.auth0_id;
    options.method = 'PUT';
    options.body = options.body;
    options.json = true;

    var requestclient = new RequestClient();
    requestclient.request.bind(requestclient);
    requestclient.request('BASIL', options, ref_num, function(err, result) {
      if (err) {
        cb(_this.parseError(err, ref_num));
      } else {
        cb(null, result);
      }
    });
  },

  updateMSISDN: function(options, cb) {
    var ACTION = '[updateMSISDN]';
    var _this = this;
    var ref_num = Utility.getRefNum();
    options.url = sails.config.basil.url + '/v1/accounts/' + options.id + '/update';
    options.method = 'PUT';
    options.body = options.body;
    options.json = true;

    var requestclient = new RequestClient();
    requestclient.request.bind(requestclient);
    requestclient.request('BASIL', options, ref_num, function(err, result) {
      if (err) {
        cb(_this.parseError(err, ref_num));
      } else {
        cb(null, result);
      }
    });
  },

  activateAccount: function(options, cb) {
    var ACTION = '[activateAccount]';
    var _this = this;
    var ref_num = Utility.getRefNum();

    options.url = sails.config.basil.url + '/v1/accounts/' + options.account_id + '/activate';
    options.method = 'PUT';
    options.body = options.body;
    options.json = true;

    var requestclient = new RequestClient();
    requestclient.request.bind(requestclient);
    requestclient.request('BASIL', options, ref_num, function(err, result) {
      if (err) {
        cb(_this.parseError(err, ref_num));
      } else {
        cb(null, result);
      }
    });
  },

  OLEget: function(options, cb) {
    var ACTION = '[getAccount]';
    var _this = this;
    var ref_num = Utility.getRefNum();
    
    options.url = sails.config.basil.url + '/v1/accounts/ole/' + options.body.cilantro_id;
    if (options.app_name) {
      options.url += "?app=" + options.app_name;
    }
    options.method = 'GET';
    options.json = true;

    var requestclient = new RequestClient();
    requestclient.request.bind(requestclient);
    requestclient.request('BASIL', options, ref_num, function(err, result) {
      if (err) {
        cb(_this.parseError(err, ref_num));
      } else {
        cb(null, result);
      }
    });
  },

  parseError: function(error, ref_num) {
    var err_obj = Errors.raise('BASIL_SERVICE_ERROR');
    if (error.error && error.error.code) {
      if (error.error && error.error.code == Errors.raise('BASIL_SERVER_ERROR').error.code) {
        return error;
      }
      switch (error.error.code) {
        case -3:
          err_obj = Errors.raise('ACCOUNT_NOT_FOUND');
          break;
        default:
          err_obj.error.details = {
            response_code: error.error.code || 'xxx',
            response_desc: error.error.msg || 'xxx',
            request_reference_no: ref_num || 'xxx'
          };
      }
    }
    return err_obj;
  },

}