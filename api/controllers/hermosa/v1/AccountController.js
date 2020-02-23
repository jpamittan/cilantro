var TAG = '[hermosa][v1][AccountController]';
var req = require('rekuire');
var constants = req('constants');
var Validation = req('Validation');

var _AccountController = req('_AccountControllerHermosa');
var _NotificationController = req('_NotificationController');

module.exports = {

  create: function(req, res) {
    var ACTION = '[create]';
   
    var _accountController = new _AccountController(req);
    var validation = new Validation();
    
    Logger.log('debug', TAG + ACTION + ' request body ', req.body);
    var params = validation.containKeys(require('rekuire')('create_account'), req.body);
    if (!params.valid) {
      return res.error(params.error);
    }

    async.auto({
      findAccount: _accountController.findAccount.bind(_accountController),
      getSubscriber: ['findAccount', _accountController.getSubscriber.bind(_accountController)],
      getDevice: ['getSubscriber', _accountController.getDevice.bind(_accountController)],
      create: ['getDevice', _accountController.create.bind(_accountController)],
      update: ['getDevice', _accountController.update.bind(_accountController)],
    }, function(err, result) {
        if (err) return res.error(err);

        var obj = result.create || result.update;

        obj = JSON.parse(JSON.stringify(obj));
        //TODO: automated determination of services
        obj.profile.services = ['Data','SMS','Voice'];
        obj.profile.status = result.getDevice ? result.getDevice.status : undefined;
        obj.profile.brand = result.getSubscriber ? result.getSubscriber.brand : null;
        obj.profile.load_protected = result.getSubscriber ? result.getSubscriber.load_protected : undefined;
        obj.balance = result.getSubscriber ? result.getSubscriber.balance : undefined;
        if (result.getSubscriber) obj.success = "login";
        else obj.success = "registration";

        res.ok(obj);
    });
  },

  sendCode: function(req, res) {
    var ACTION = '[activate]';
    var _accountController = new _AccountController(req);
    var _notificationController = new _NotificationController(req, constants.notif.type.activate_account);
    req.body.msisdn = Utility.formatMsisdn(req.body.msisdn);
    Logger.log('debug', TAG + ACTION + ' request body ', req.body);
    var validation = new Validation();
    var params = validation.containKeys(require('rekuire')('send_code'), req.body);
    if (!params.valid) {
      return res.error(params.error);
    }
    async.auto({
      generateCode: _accountController.generateCode.bind(_accountController),
      sendCode: ['generateCode', _accountController.sendCode.bind(_accountController)],
    }, function(err, result) {
        if (err) return res.error(err);
        res.ok(result.generateCode);
    });
  },


  activate: function(req, res) {
    var ACTION = '[activate]';
    var _accountController = new _AccountController(req);
    var _notificationController = new _NotificationController(req, constants.notif.type.activate_account);
    req.body.msisdn = Utility.formatMsisdn(req.body.msisdn);
    Logger.log('debug', TAG + ACTION + ' request body ', req.body);
    var validation = new Validation();
    var params = validation.containKeys(require('rekuire')('activate_account'), req.body);
    if (!params.valid) {
      return res.error(params.error);
    }
    async.auto({
      validateCode: _accountController.validateCode.bind(_accountController),
      getSubscriber: ['validateCode', _accountController.getSubscriber.bind(_accountController)],
      activateSubscriber: ['getSubscriber', _accountController.activateSubscriber.bind(_accountController)],
      activateAccount: ['activateSubscriber', _accountController.activateAccount.bind(_accountController)],
      activatePurchaseSubscriber: ['activateSubscriber', _accountController.activatePurchaseSubscriber.bind(_accountController)],
      getActivatedSubscriber: ['activatePurchaseSubscriber', _accountController.getSubscriber.bind(_accountController)],
      getDevice: ['getActivatedSubscriber', _accountController.getDevice.bind(_accountController)],
      createNotification: ['getActivatedSubscriber', _notificationController.createNotification.bind(_notificationController)]
    }, function(err, result) {
        if (err) return res.error(err);
        var obj = req.account;
        obj.matrixx_id = result.activateAccount[0].matrixx_id;
        obj.profile.msisdn = result.activateAccount[0].msisdn;
        obj.profile.activated = result.activateAccount[0].activated;
        obj.profile.load_protected = result.getActivatedSubscriber.load_protected;
        //TODO: automated determination of services
        obj.profile.services = ['Data','SMS','Voice'];
        obj.profile.brand = result.getActivatedSubscriber.brand;
        obj.profile.status = result.getDevice.status;
        obj.balance = result.getActivatedSubscriber.balance;
        res.ok(obj);
    });
  },

  get: function(req, res) {
    var ACTION = '[get]';
    Logger.log('debug', TAG + ACTION + ' request query ', req.query);
  
    var _accountController = new _AccountController(req);
    
    async.auto({
      getSubscriber: _accountController.getSubscriber.bind(_accountController),
    }, function(err, result) {
      if (err) return res.error(err);
      var obj = req.account;
        //TODO: automated determination of services
      obj.profile.services = ['Data','SMS','Voice'];
      obj.profile.brand = result.getSubscriber ? result.getSubscriber.brand : null;
      obj.profile.load_protected = result.getSubscriber ? result.getSubscriber.load_protected : null;
      obj.profile.status = result.getSubscriber ? result.getSubscriber.status : undefined;
      obj.balance = result.getSubscriber.balance;

      res.ok(obj);
    });
  },

  getMembers: function(req, res) {
    // TODO: Add separate call for get members
  },

  loadProtect: function(req, res) {
    var ACTION = '[loadProtect]';
    var _accountController = new _AccountController(req);
    Logger.log('debug', TAG + ACTION + ' request body ', req.body);
    var validation = new Validation();
    
    var params = validation.containKeys(require('rekuire')('load_protect'), req.body);
    if (!params.valid) {
      return res.error(params.error);
    }

    async.auto({
      getSubscriber: _accountController.getSubscriber.bind(_accountController),
      loadProtectSubscriber: ['getSubscriber', _accountController.loadProtectSubscriber.bind(_accountController)]
    }, function(err, result) {
        if (err) return res.error(err);
        res.ok({success: 'Load Protect', load_protected: req.body.load_protect.toUpperCase() == "YES" ? true : false});
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

  updateMSISDN: function(req, res) {
    var ACTION = '[updateMSISDN]';
    var _accountController = new _AccountController(req);
    var validation = new Validation();
    req.params.id_type = validation.isValidMobile(req.params.id) ? 'msisdn' : 'id';
    req.body.new_id_type = validation.isValidMobile(req.body.new_id) ? 'msisdn' : 'id';
    req.options.app_name = 'hermosa';
    Logger.log('debug', TAG + ACTION + ' request params ', req.params);
    req.body.id = req.params.id;
    if (req.params.id_type == 'msisdn' && req.body.new_id_type == 'id') {
      var obj = Errors.raise('MISSING_INVALID_PARAMS');
      obj.error.params.push('Cannot update auth0_id based on MSISDN.');
      return res.error(obj);
    }
    async.auto ({
      findAccount:  _accountController.findAccount.bind(_accountController),
      updateMSISDN:  ['findAccount', _accountController.updateMSISDN.bind(_accountController)]
    }, function(err, result) {
      if (err) return res.error(err);
      if (!result.findAccount) return res.error(Errors.raise('ACCOUNT_NOT_FOUND'));
      res.ok({status: "Update Successful", accounts: result.updateMSISDN});
    });
  },

}