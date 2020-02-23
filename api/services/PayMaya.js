var TAG = '[PayMaya]';

module.exports = {

  initialize: function() {
    var ACTION = '[initialize]';
    Logger.log('debug', TAG + ACTION, 'Initialize PayMaya.'); 
    var webhooks = {};
    var ref_num = Utility.getRefNum();
    var requestclient = new RequestClient();
    requestclient.request.bind(requestclient);
    var options = {
      json: true,
      headers: { Authorization: sails.config.paymaya.authorization}
    };
    async.auto({
      getWebhooks: function(cb) {
        options.method = 'GET';
        options.url = sails.config.paymaya.url + '/checkout/v1/webhooks';
        requestclient.request('PAYMAYA', options, ref_num, function(err, result) {
          if (err) return cb(err);
          Logger.log('debug', TAG + ACTION + ' webhooks', result);
          result.forEach(function(webhook) {
            webhooks[webhook.name] = webhook.id;
          });
          return cb();
        });
      },
      registerSuccessWebhook: ['getWebhooks', function(cb) {

        async.eachSeries(["CHECKOUT_SUCCESS", "CHECKOUT_FAILURE"], function(type, async_cb) {
          delete options.pool;
          options.url = sails.config.paymaya.url + '/checkout/v1/webhooks';
          options.body = {
            name: type,
            callbackUrl: sails.config.paymaya.callback_host
              + ((type == "CHECKOUT_SUCCESS") ? sails.config.paymaya.callback_success : sails.config.paymaya.callback_failure)
          };
          if (webhooks[type]) {
            options.method = 'PUT';
            options.url = options.url + '/' + webhooks[type];
            requestclient.request('PAYMAYA', options, ref_num, function(err, result) {
              return async_cb(err, result);
            });
          } else {
            options.method = 'POST';
            requestclient.request('PAYMAYA', options, ref_num, function(err, result) {
              return async_cb(err, result);
            });
          }
        }, function(err, data) {
          return cb(err, data);
        });
      }],
    }, function(err, result) {
      if (err) {
        Logger.log('error', TAG + ACTION, 'PayMaya webhooks registered error.');
      } else {
        Logger.log('debug', TAG + ACTION, 'PayMaya webhooks registered.');
      }
    });    
  },

  getCheckoutDetail: function(options, cb) {
    var ACTION = '[getCheckoutDetail]';
    var _this = this;
    var response_desc;
    var ref_num = Utility.getRefNum();
    options.url = sails.config.paymaya.url + options.url;
    
    var requestclient = new RequestClient();
    requestclient.request.bind(requestclient);
    requestclient.request('PAYMAYA', options, ref_num, function(err, result) {
      if (err) {
        cb(_this.parseError(err, ref_num));
      } else {
        if (result.status == 'COMPLETED') {
          if (result.paymentStatus != 'PAYMENT_SUCCESS') {
            response_desc = result.paymentStatus;
          }
        } else {
          response_desc = result.status;
        }

        if (response_desc) {
          err = Errors.raise('PAYMAYA_SERVICE_ERROR');
          err.error.details = {
            response_code: 'xxx',
            response_desc: response_desc ,
            request_reference_no: ref_num || 'xxx'
          };
        }
        cb(err, true);
      }
    });
  },

  parseError: function(error, ref_num) {
    var err_obj = Errors.raise('PAYMAYA_SERVICE_ERROR');
    if (error.error && error.error.code) {
      if (error.error.code == Errors.raise('PAYMAYA_SERVER_ERROR').error.code) {
        return error;
      }
      switch (error.error.code) {
        default:
          err_obj.error.details = {
            response_code: error.error.code || 'xxx',
            response_desc: error.error.message || 'xxx',
            request_reference_no: ref_num || 'xxx'
          };
      }
    }
    return err_obj;
  },
}