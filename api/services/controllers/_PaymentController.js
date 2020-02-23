var TAG = '[_PaymentController]';
var req = require('rekuire');
var constants = req('constants');

function _PaymentController(req, options) {
  if (typeof req === 'undefined') {
    throw new Error('Please pass the request to the constructor.');
  }
  this.req = req;
  this.options = options;
}

_PaymentController.prototype.verifyPayment = function (cb, result) {
  var ACTION = '[verifyPayment]';
  var err_obj;

  this.req.body.amount =  parseFloat(this.req.body.amount);
  if(isNaN(this.req.body.amount)){
    err_obj = Errors.raise("MISSING_INVALID_PARAMS");
    err_obj.error.params.push(Errors.getParam('payment_amount'));
    return cb(err_obj);
  }

  var _this = this;

  Paypal.getPaymentDetails(this.req.body.transaction_id, function(err, data) {
    var err_obj;
    if (err) {
      err_obj = Errors.raise("PAYPAL_INVALID_PAYMENT");
      return cb(err_obj);
    }

    if (!data) {
      err_obj = Errors.raise("PAYPAL_INVALID_PAYMENT");
      return cb(err_obj);
    }

    if (data.state == 'approved' &&
       data.transactions[0].amount.total == _this.req.body.amount &&
       data.transactions[0].amount.currency == _this.req.body.currency.toUpperCase()
      ) {

      var masked_number = null;

      if (data.payer.funding_instruments) {
        masked_number = data.payer.funding_instruments[0].credit_card?
                        data.payer.funding_instruments[0].credit_card.number:
                        'xxxxxxxxxxxx'+data.payer.funding_instruments[0].credit_card_token.last4;
      } else {
        masked_number = 'Payer ID: '+data.payer.payer_info.payer_id;
      }

      var transaction_info = {
          cilantro_id           : _this.req.account.cilantro_id,
          transaction_id        : data.id,
          amount                : data.transactions[0].amount.total,
          card_number           : masked_number,
          description           : _this.req.body.description,
          currency              : data.transactions[0].amount.currency,
          transaction_date      : new Date()
      };

      PaymentTransactions.create(transaction_info, function(err, data) {
        if (err) {
          Logger.log('error','[PAYMENT][SAVETRANSACTION]',err);
          return cb(err);
        }
        //return cb(null, data);
      });

      return cb(null,data);

    } else {
      err_obj = Errors.raise("PAYPAL_INVALID_PAYMENT");
      return cb(err_obj);
    }

  });
};

_PaymentController.prototype.listTransactions = function (cb, result) {
  var ACTION = '[listTransactions]';

  PaymentTransactions.find({where:{cilantro_id: this.req.account.cilantro_id}, sort:'created_at DESC'}, function(err, data) {
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return res.error(Errors.raise('DB_ERROR'));
    }
    return cb(null, data);
  });
};

_PaymentController.prototype.convertCurrency = function (cb, result) {
  var ACTION = '[convertCurrency]';

  var from =  this.req.params.from;
  var to = this.req.params.to;
  var amount;

  if (this.req.params.amount) {
    amount = this.req.params.amount;
  } else {
    amount = 1;
  }

  var url = sails.config.currency_converter.url+'?a='+amount+'&from='+from+'&to='+to;

  CurrencyConverter.request(url, function(err, data) {
    if (err) {
      var err_obj = Errors.raise("CURRENCY_CONVERTER_ERROR");
      return cb(err_obj);
    }

    data = data.split("<span class=bld>");
    data = data[1].split("</span>");
    data = data[0].split(" ");
    rate = data[0];

    var response = {
      rate: rate,
      from: from,
      to: to
    };

    return cb(null, response);
  });
};

module.exports = _PaymentController;
