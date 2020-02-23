var TAG = '[odyssey][v1][EpinController]';
var req = require('rekuire');
var request = require('request');
var Validation = req('Validation');
var Spiels = req('spiels');
var _EpinController = req('_EpinController');
var sys = require('sys');
var exec = require('child_process').exec;

module.exports = {

  denomList: function(req, res) {
    var ACTION = '[denomList]';

    Logger.log('debug', TAG + ACTION + ' request body ', req.body);

    Epin.find({game_name: req.params.title}, function(err, data) {
      if (err) {
        Logger.log('error', TAG + ACTION, err);
        return res.error(Errors.raise('DB_ERROR'));
      } 
      res.ok({"data":data});
    });
  },

  create: function(req, res) {
    var ACTION = '[create]';
    Logger.log('debug', TAG + ACTION + ' request body ', req.body);

    Epin.create(req.body, function(err, data) {
      if (err) {
        Logger.log('error', TAG + ACTION, err);
        return res.error(Errors.raise('DB_ERROR'));
      }
      res.ok(data);
    });
  },

  get: function(req, res) {
    var ACTION = '[get]';
    Epin.findOne({pin_denom_id: req.params.id}, function(err, data) {
      if (err) {
        Logger.log('error', TAG + ACTION, err);
        return cb(Errors.raise('DB_ERROR'));
      }
      res.ok(data);
    });
  },

  update: function(req, res) {
    var ACTION = '[update]';
    Epin.update({pin_denom_id: req.params.id}, req.body, function(err, data) {
      if (err) {
        Logger.log('error', TAG + ACTION, err);
        return res.error(Errors.raise('DB_ERROR'));
      } 
      res.ok(data);
    });
  },

  list: function(req, res) {
    var ACTION = '[list]';
    Logger.log('debug', TAG + ACTION + ' request query', req.query);
    req.query = Utility.getDefaultValues(req.query, 'epin');
    var query_str = Utility.formQueryStr(req.query);
    var _epin = new _EpinController(req, query_str);
    async.auto({
      queryTotal: _epin.queryTotal.bind(_epin),
      queryList: _epin.queryList.bind(_epin),
      parseResult: [ 'queryTotal', 'queryList', _epin.parseResult.bind(_epin)],
    }, function(err, results) {
      if (err) return res.error(err);
      results.parseResult.records.forEach(function(denom) {
        denom.game_denomination = parseFloat(denom.game_denomination).toLocaleString('en');
        denom.game_currency = parseFloat(denom.game_currency).toLocaleString('en');
      });
      res.ok(results.parseResult);
    });
  },

  register: function(req, res) {
    var ACTION = '[register]';
    var _epin = new _EpinController(req);
    var validation = new Validation();

    Logger.log('debug', TAG + ACTION + ' request body ', req.body);
    var params = validation.containKeys(require('rekuire')('purchase_epin'), req.body);
    if (!params.valid) return res.error(params.error);

    async.auto({
      checkMSISDN: _epin.checkMSISDN.bind(_epin),
      getEpin: ['checkMSISDN', _epin.getEpin.bind(_epin)],
      chargeMSISDN: ['getEpin', _epin.chargeMSISDN.bind(_epin)],
      saveTransaction: ['chargeMSISDN', _epin.saveTransaction.bind(_epin)],
    }, function(err, results) {
      if (err) return res.error(err);
      var obj = results.chargeMSISDN;
      obj.epin_details = {
        msisdn: req.body.msisdn,
        game_id: req.body.game_id,
        denom_id: req.body.denom_id
      };
      res.ok(obj);
    });

  },

  verify: function(req, res) {
    var ACTION = '[verify]';
    var _epin = new _EpinController(req);
    var validation = new Validation();

    Logger.log('debug', TAG + ACTION + ' request body ', req.body);
    var params = validation.containKeys(require('rekuire')('purchase_epin_verify'), req.body);
    if (!params.valid) return res.error(params.error);
    
    async.auto({
      verifyVCode: _epin.verifyVCode.bind(_epin),
      getTransaction: _epin.getTransaction.bind(_epin),
      requestSmartEpin: ['verifyVCode', _epin.requestSmartEpin.bind(_epin)],
      updateTransaction: ['requestSmartEpin', _epin.updateTransaction.bind(_epin)],
      createNotification: ['updateTransaction', _epin.createNotification.bind(_epin)],
    }, function(err, results) {
      // TODO: Update txn
      // TODO: Call Opbill Refund when requestEPIN fails
      if (err) return res.error(err);
      var obj = {
        msisdn: results.getTransaction.item.msisdn,
        title: "Smart ePIN",
        message: Spiels.epin_notification.sms
      };
      SMSService.send(obj, function() {});
      res.ok(results.updateTransaction);
    });
  },

}