var TAG = '[odyssey][v1][AccountsController]';
var req = require('rekuire');
var matrixx = req('Matrixx');
var constants = req('constants');
var Validation = req('Validation');

var _AccountController = req('_AccountControllerOdyssey');
var _NotificationController = req('_NotificationControllerOdyssey');
var _VoucherController = req('_VoucherController');


module.exports = {

  list: function(req, res) {
    var ACTION = '[list]';
    var _accountController = new _AccountController(req);
    var validation = new Validation();

    Logger.log('debug', TAG + ACTION + ' request params ', req.params);

    Basil.getList({app: req.options.app_name}, function(err, obj) {
      if (err) return res.error(err);
      obj = JSON.parse(JSON.stringify(obj));
      res.ok(obj);
    });
  },

  get: function(req, res) {
    var ACTION = '[get]';
    var _accountController = new _AccountController(req);

    Logger.log('debug', TAG + ACTION + ' request params ', req.params);

    res.ok(req.account);
   
    // if (req.account.profile.msisdn == undefined) return res.ok(req.account);
    // var obj = {
    //   type: 'AccessNumber',
    //   value: req.account.profile.msisdn
    // };
    // matrixx.getSubscriber(obj, function(err, subscriber) {
    //   if (err) return res.error(err);
    //   var data = req.account;
    //   data.profile.role = subscriber.role;
    //   data.profile.load_protected = subscriber.load_protected;
    //   data.balance = subscriber.total_balance;
    //   res.ok(data);
    // });
  },

  create: function(req, res) {
    var ACTION = '[createSubscriber]';
    var _accountController = new _AccountController(req);
    var _voucherController = new _VoucherController(req);
    var _notificationController = new _NotificationController(req, constants.notif.type.odyssey_activate);
    var validation = new Validation();

    Logger.log('debug', TAG + ACTION + ' request params ', req.body);
    var params = validation.containKeys(require('rekuire')('create_account'), req.body);
    if (!params.valid) {
      return res.error(params.error);
    }

    async.auto({
      findAccount: _accountController.findAccount.bind(_accountController),
      create: ['findAccount', _accountController.create.bind(_accountController)],
      // getVirtualNumber: ['create', _accountController.getVirtualNumber.bind(_accountController)],
      update: ['findAccount', _accountController.update.bind(_accountController)],
      //registerSubscriber: ['getVirtualNumber', _accountController.registerSubscriber.bind(_accountController)],
      //createPurchase: ['registerSubscriber', _accountController.createPurchase.bind(_accountController)],
      // getActicationVoucher: ['create', _voucherController.odysseyActivate.bind(_voucherController)],
      // to create service for getting vouchers / vcode / epins
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
    var ACTION = '[get]';
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






