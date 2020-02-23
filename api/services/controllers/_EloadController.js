var TAG = '[_EloadController]';
var crypto = require('crypto-js');
var req = require('rekuire');
var rules = req('rules');

function _EloadController(req, options) {
  if (typeof req === 'undefined') {
    throw new Error('Please pass the request to the constructor.');
  }
  this.req = req;
  this.options = options;
}

_EloadController.prototype.generateRequestId = function (cb, result) {

  var ACTION = '[generate]';
  var request_id = new Array(20);
  var _sym = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  var generated_code = '';

  for (var i = 0; i < request_id.length; i++) {
      generated_code +=  _sym[parseInt(Math.random() * (_sym.length))];
  }

  return cb(null, generated_code);
};

_EloadController.prototype.validate = function (cb, result) {
  var ACTION = '[validate]';
  var smart_prefixes = JSON.parse(JSON.stringify(rules.smart_prefixes));
  var prefix = '0'+this.req.body.msisdn.toString().substring(0,3);
  var eload_types = JSON.parse(JSON.stringify(rules.eload_types));
  var err_obj;

  if (this.req.body.msisdn.length != 10 || smart_prefixes.indexOf(prefix) == -1) {
    err_obj = Errors.raise("MISSING_INVALID_PARAMS");
    err_obj.error.params.push(Errors.getParam('msisdn'));
    return cb(err_obj);
  }

  return cb();
};


_EloadController.prototype.load = function (cb, result) {
  var ACTION = '[load]';
  var smart_prefixes = JSON.parse(JSON.stringify(rules.smart_prefixes));
  var prefix = '0'+this.req.body.msisdn.toString().substring(0,3);
  var eload_types = JSON.parse(JSON.stringify(rules.eload_types));
  var err_obj;

  if (result.payment && result.payment.error) {
    return cb(result.payment);
  }

  if (result.balance.balance == 0) {
    err_obj = Errors.raise("INSUFFICIENT_BALANCE");
    return cb(err_obj);
  }

  if (smart_prefixes.indexOf(prefix) == -1) {
    err_obj = Errors.raise("MISSING_INVALID_PARAMS");
    err_obj.error.params.push(Errors.getParam('msisdn'));
    return cb(err_obj);
  }

  if (eload_types.indexOf(this.req.body.eload_type) == -1) {
    err_obj = Errors.raise("MISSING_INVALID_PARAMS");
    err_obj.error.params.push(Errors.getParam('eload_type'));
    return cb(err_obj);
  }

  var public_key;
  var private_key;
  switch (this.req.body.eload_type) {
    case "smart":
      public_key = sails.config.eload.smart_public_key;
      private_key = sails.config.eload.smart_private_key;
      break;
    case "sun":
      public_key = sails.config.eload.sun_public_key;
      private_key = sails.config.eload.sun_private_key;
      break;
    case "pldt":
      public_key = sails.config.eload.pldt_public_key;
      private_key = sails.config.eload.pldt_private_key;
      break;
  }

  var request_id    = result.request_id;
  var product_code  = this.req.body.product_code;
  var target_number = '63'+this.req.body.msisdn;
  var dealer_code   = sails.config.eload.dealer_code;
  var hash = request_id+target_number+product_code+public_key;
 
  hash     = crypto.HmacSHA1(hash,private_key);
  
  var url = sails.config.eload.url + '/GTG/api/'+public_key+'/'+request_id+'/'+product_code;
  url += '/'+target_number+'/'+hash+'/'+dealer_code;

  var _this = this;

  Eload.request(url, function(err, data) {
    data = JSON.parse(data);
    if (data.status != "COMPLETE") {
      switch (data.message) {
        case "INVALID_TARGETNUMBER":
          err_obj = Errors.raise("INVALID_TARGETNUMBER");
          return cb(err_obj);
        case "INSUFFICIENT_BALANCE":
          err_obj = Errors.raise("INSUFFICIENT_BALANCE");
          return cb(err_obj);
        default:
          err_obj = Errors.raise("ELOAD_SERVICE_ERROR");
          return cb(err_obj);
      }
    }else{

      var transaction_info = {
        cilantro_id                 : _this.req.account.cilantro_id,
        transaction_code            : data.transactionCode,
        price                       : data.price,
        mobile_number               : '0'+_this.req.body.msisdn,
        product_code                : _this.req.body.product_code,
        fulfillment_reference_code  : data.fulfillmentReferenceCode,
        transaction_date            : new Date()
      };

      EloadTransactions.create(transaction_info, function(err, data) {
        if (err) {
          Logger.log('error','[ELOAD][SAVETRANSACTION]',err);
          return cb(err);
        }
      });

      data.response_date = Math.floor(new Date().getTime() / 1000);
      return cb(null, data);
    }
  });
};

_EloadController.prototype.getProductsSun = function (cb, result) {
  var ACTION = '[getProducts]';

  var public_key = sails.config.eload.sun_public_key;
  var request_id = result.request_id_sun;
  var hash = request_id+public_key;
  hash     = crypto.HmacSHA1(hash,sails.config.eload.sun_private_key);
  var eload_filter = JSON.parse(JSON.stringify(rules.eload_filter));
  
  var url = sails.config.eload.url + '/GTG/api/getProducts/'+public_key+'/'+request_id+'/'+hash;
  
  Eload.request(url, function(err, data) {
    if (err) {err = err;}
    data = JSON.parse(data);
    var response = [];
    for (var i=0;i<data.product.length;i++) {
      if (eload_filter.indexOf(data.product[i].code) != -1) {
        data.product[i].eload_type = "sun";
        response.push(data.product[i]);
      }
    }
    return cb(err, response);
  });
};

_EloadController.prototype.getProductsSmart = function (cb, result) {
  var ACTION = '[getProducts]';

  var public_key = sails.config.eload.smart_public_key;
  var request_id = result.request_id_smart;
  var hash = request_id+public_key;
  hash     = crypto.HmacSHA1(hash,sails.config.eload.smart_private_key);
  var eload_filter = JSON.parse(JSON.stringify(rules.eload_filter));
  
  var url = sails.config.eload.url + '/GTG/api/getProducts/'+public_key+'/'+request_id+'/'+hash;
  
  Eload.request(url, function(err, data) {
    if (err) {err = err;}
    data = JSON.parse(data);
    var response = [];
    for (var i=0;i<data.product.length;i++) {
      if (eload_filter.indexOf(data.product[i].code) != -1) {
        data.product[i].eload_type = "smart";
        response.push(data.product[i]);
      }
    }
    return cb(err, response);
  });
};

_EloadController.prototype.getProductsPLDT = function (cb, result) {
  var ACTION = '[getProducts]';

  var public_key = sails.config.eload.pldt_public_key;
  var request_id = result.request_id_pldt;
  var hash = request_id+public_key;
  hash     = crypto.HmacSHA1(hash,sails.config.eload.pldt_private_key);
  var eload_filter = JSON.parse(JSON.stringify(rules.eload_filter));
  
  var url = sails.config.eload.url + '/GTG/api/getProducts/'+public_key+'/'+request_id+'/'+hash;
  
  Eload.request(url, function(err, data) {
    if (err) {err = err;}
    data = JSON.parse(data);
    var response = [];
    for (var i=0;i<data.product.length;i++) {
      if (eload_filter.indexOf(data.product[i].code) != -1) {
        data.product[i].eload_type = "pldt";
        response.push(data.product[i]);
      }
    }
    return cb(err, response);
  });
};

_EloadController.prototype.balance = function (cb, result) {
  var ACTION = '[getProducts]';

  var eload_types = JSON.parse(JSON.stringify(rules.eload_types));
  var err_obj;

  if(eload_types.indexOf(this.req.body.eload_type) == -1){
    err_obj = Errors.raise("MISSING_INVALID_PARAMS");
    err_obj.error.params.push(Errors.getParam('eload_type'));
    return cb(err_obj);
  }

  var public_key;
  var private_key;
  switch(this.req.body.eload_type){
    case "smart":
      public_key = sails.config.eload.smart_public_key;
      private_key = sails.config.eload.smart_private_key;
      break;
    case "sun":
      public_key = sails.config.eload.sun_public_key;
      private_key = sails.config.eload.sun_private_key;
      break;
    case "pldt":
      public_key = sails.config.eload.pldt_public_key;
      private_key = sails.config.eload.pldt_private_key;
      break;
  }

  var request_id = result.balance_request_id;
  var hash = request_id+public_key;
  hash     = crypto.HmacSHA1(hash,private_key);

  var url = sails.config.eload.url + '/GTG/api/balance/'+public_key+'/'+request_id+'/'+hash;

  Eload.request(url, function(err, data) {
    data = JSON.parse(data);
    if (err) {err = err;}

    return cb(err, data);
  });
};

_EloadController.prototype.listTransactions = function (cb, result) {
  var ACTION = '[listTransactions]';

  EloadTransactions.find({where:{cilantro_id: this.req.account.cilantro_id}, sort:'created_at DESC'}, function(err, data) {
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return res.error(Errors.raise('DB_ERROR'));
    }
    return cb(null, data);
  });
};

module.exports = _EloadController;
