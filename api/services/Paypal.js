var TAG = '[Paypal]';
var paypal = require('paypal-rest-sdk');

module.exports = {

  getPaymentDetails: function(transaction_id, cb) {
    var ACTION = '[getPaymentDetails]';
    var _this = this;
   
    paypal.configure({
      mode: sails.config.paypal.mode, //sandbox or live
      client_id: sails.config.paypal.client_id,
      client_secret: sails.config.paypal.client_secret
    });

    paypal.payment.get(transaction_id, function(error, payment){
      if(error){
        Logger.log('error', TAG + ACTION + '[PAYMENT][RESPONSE] ', error);
        return cb(error);
      } else {
        Logger.log('debug', TAG + ACTION + '[PAYMENT][RESPONSE]', payment);
        return cb(null,payment);
      }
    });

  },
  
};