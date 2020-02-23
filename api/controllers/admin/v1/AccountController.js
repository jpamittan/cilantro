var TAG = '[admin][v1][AccountController]';
var req = require('rekuire');
var _AccountController = req('_AccountControllerHermosa');
var _PurchaseController = req('_PurchaseController');
var Validation = req('Validation');

module.exports = {

  list: function(req, res) {
    var ACTION = '[list]';
    Logger.log('debug', TAG + ACTION + req.access.by + ' request query ', req.query);
    Basil.getList(req.query, function(err, obj) {
      if (err) return callback(err);
      obj = JSON.parse(JSON.stringify(obj));
      res.ok(obj);
    });
  },

  create: function(req, res) {
    var ACTION = '[create]';
    Logger.log('debug', TAG + ACTION + req.access.by + ' request body ', req.body);
    var _accountController = new _AccountController(req);
    
    var validation = new Validation();
    var params = validation.containKeys(require('rekuire')('create_subscriber'), req.body);
    if (!params.valid) {
      return res.error(params.error);
    }

    async.auto({
      create: _accountController.createSubscriber.bind(_accountController),
    }, function(err, result) {
        if (err) return res.error(err);
        var obj = {
          status: 'Provision Subscriber Success',
          request: req.body
        };
        res.ok(obj);
    });
  },

  preload: function(req, res) {
    var ACTION = '[create]';
    Logger.log('debug', TAG + ACTION + req.access.by + ' request body ', req.body);
    var _purchaseController = new _PurchaseController(req);
    var _accountController = new _AccountController(req);
    
    var validation = new Validation();
    var params = validation.containKeys(require('rekuire')('purchase'), req.body);
    if (!params.valid) {
      return res.error(params.error);
    }

    async.auto({
      getSubscriber: _accountController.getSubscriber.bind(_accountController),
      purchase: [ "getSubscriber", _purchaseController.matrixxPurchase.bind(_purchaseController)],
    }, function(err, result) {
        if (err) return res.error(err);
        var obj = {
          status: 'Provision Preload Offer Success',
          request: req.body
        };
        res.ok(obj);
    });
  },

  preactive: function(req, res) {
    var ACTION = '[create]';
    Logger.log('debug', TAG + ACTION + req.access.by + ' request body ', req.body);
    var _purchaseController = new _PurchaseController(req);
    var _accountController = new _AccountController(req);
    
    // var validation = new Validation();
    // var params = validation.containKeys(require('rekuire')('purchase'), req.body);
    // if (!params.valid) {
    //   return res.error(params.error);
    // }

    async.auto({
      getSubscriber: _accountController.getSubscriber.bind(_accountController),
      preactive: [ "getSubscriber", _accountController.preactiveSubscriber.bind(_purchaseController)],
    }, function(err, result) {
        if (err) return res.error(err);
        var obj = {
          status: 'Update Preactive Date Success',
          request: req.body
        };
        res.ok(obj);
    });
  },

  modify: function(req, res) {
    var ACTION = '[create]';
    Logger.log('debug', TAG + ACTION + ' request body ', req.body);
    var _accountController = new _AccountController(req);

    var validation = new Validation();
    var params = validation.containKeys(require('rekuire')('modify_subscriber'), req.body);
    if (!params.valid) {
      return res.error(params.error);
    }

    var obj = {
      status: 'Modify Subscriber IMSI Success',
      request: req.body
    };    
    res.ok(obj);

    // async.auto({
    //   getSubscriber: _accountController.getSubscriber.bind(_accountController),
    //   changeIMSI: ['getSubscriber', _accountController.changeIMSI.bind(_accountController)],
    // }, function(err, result) {
    //     if (err) return res.error(err);
    //     res.ok(result);
    // });
  },

  delete: function(req, res) {
    var ACTION = '[create]';
    Logger.log('debug', TAG + ACTION + ' request body ', req.body);
    var _accountController = new _AccountController(req);
    
    var validation = new Validation();
    var params = validation.containKeys(require('rekuire')('delete_subscriber'), req.body);
    if (!params.valid) {
      return res.error(params.error);
    }

    var obj = {
      status: 'Purge Subscriber Success',
      request: req.body
    };    
    res.ok(obj);

    // async.auto({
    //   create: _accountController.createSubscriber.bind(_accountController),
    // }, function(err, result) {
    //     if (err) return res.error(err);
    //     res.ok(result);
    // });
  },

  get: function(req, res) {
    var ACTION = '[get]';
    Logger.log('debug', TAG + ACTION + ' accessed by [' + req.headers.organization + '] request params ', req.query);
  
    var _accountController = new _AccountController(req);
    
    async.auto({
      getSubscriber: _accountController.getSubscriber.bind(_accountController),
    }, function(err, result) {
      if (err) return res.error(err);
      var obj = req.account;
      obj.profile.status = result.getSubscriber.status;
      obj.profile.load_protected = result.getSubscriber.load_protected;
      obj.balance = result.getSubscriber.balance;
      res.ok(obj);
    });
  },


};




