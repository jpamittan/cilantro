var TAG = '[global][v1][AccountController]';
var req = require('rekuire');
var matrixx = req('Matrixx');
var constants = req('constants');
var Validation = req('Validation');
var _AccountController = req('_AccountControllerGlobal');
var _NotificationController = req('_NotificationControllerGlobal');
var _SubscriptionController = req('_SubscriptionController');

module.exports = {

  list: function(req, res) {
    var ACTION = '[listAccounts]';
    var _accountController = new _AccountController(req);

    Logger.log('debug', TAG + ACTION + ' request params ', req.params);

    async.auto({
      accounts: _accountController.listAccounts.bind(_accountController),
    }, function(err, result) {
      if (err) return res.error(err);
      res.ok(result.accounts);
    });
  },

  get: function(req, res) {
    var ACTION = '[get]';
    var _accountController = new _AccountController(req);

    Logger.log('debug', TAG + ACTION + ' request params ', req.params);

    res.ok(req.account);
  },

  create: function(req, res) {
    var ACTION = '[createSubscriber]';
    var _accountController = new _AccountController(req);
    var _notificationController = new _NotificationController(req, constants.notif.type.global_activate);
    var _subscriptionController = new _SubscriptionController(req,null,EmagSubscriptions);
    var validation = new Validation();

    Logger.log('debug', TAG + ACTION + ' request params ', req.body);
    var params = validation.containKeys(require('rekuire')('create_account'), req.body);
    if (!params.valid) {
      return res.error(params.error);
    }

    req.body.months = constants.free_emags.join();

    async.auto({
      findAccount: _accountController.findAccount.bind(_accountController),
      create: ['findAccount', _accountController.create.bind(_accountController)],
      update: ['findAccount', _accountController.update.bind(_accountController)],
      saveEmags : ['create', _subscriptionController.saveEmagSubscriptions.bind(_subscriptionController)],
      createNotification: ['create', _notificationController.createNotification.bind(_notificationController)],
    }, function(err, result) {
      if (err) return res.error(err);
      var obj = result.create || result.update;

      if (result.create) obj.success = "registration";
      if (result.update) obj.success = "login";
      
      obj = JSON.parse(JSON.stringify(obj));
      res.ok(obj);
    });
  },

  linkList: function(req, res) {
    var ACTION = '[linkSubscriber]';
    var _accountController = new _AccountController(req);
    var validation = new Validation();

    Logger.log('debug', TAG + ACTION + ' request params ', req.body);

    var body = req.body;
    body.auth0_id = req.params.id;
    
    Basil.linkList({ body: body }, function(err, obj) {
      if (err) return res.error(err);
      obj = JSON.parse(JSON.stringify(obj));
      res.ok({status: "Links Successful", accounts: obj});
    });
  },

  link: function(req, res) {
    var ACTION = '[linkSubscriber]';
    var _accountController = new _AccountController(req);
    var validation = new Validation();

    Logger.log('debug', TAG + ACTION + ' request params ', req.body);

    var body = req.body;
    body.auth0_id = req.params.id;
    
    Basil.linkAccount({ body: body }, function(err, obj) {
      if (err) return res.error(err);
      obj = JSON.parse(JSON.stringify(obj));
      res.ok({status: "Link Successful", accounts: obj});
    });
  },

  unlink: function(req, res) {
    var ACTION = '[unlinkSubscriber]';
    var _accountController = new _AccountController(req);
    var validation = new Validation();

    Logger.log('debug', TAG + ACTION + ' request params ', req.body);

    var body = req.body;
    body.auth0_id = req.params.id;
    
    Basil.unlinkAccount({ body: body }, function(err, obj) {
      if (err) return res.error(err);
      obj = JSON.parse(JSON.stringify(obj));
      res.ok({status: "Unlink Successful", accounts: obj});
    });
  },

  OLEget: function(req, res) {
    var ACTION = '[OLEget]';
    var _accountController = new _AccountController(req);

    Logger.log('debug', TAG + ACTION + ' request params ', req.params);

    var body = req.body;
    body.cilantro_id = req.params.id;
    
    Basil.OLEget({ body: body }, function(err, obj) {
      if (err) return res.error(err);
      console.log(obj);
      obj = JSON.parse(JSON.stringify(obj));
      res.ok(obj);
    });
  },

}






