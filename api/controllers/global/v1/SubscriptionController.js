var TAG = '[global][v1][SubscriptionController]';
var req = require('rekuire');
var Validation = req('Validation');
var constants = req('constants');
var _PaymentController = req('_PaymentController');
var _SubscriptionController = req('_SubscriptionController');
var _NotificationController = req('_NotificationControllerGlobal');

module.exports = {
  saveEmagSubscriptions: function(req, res) {
    var ACTION = '[saveEmagSubscriptions]';
    var _subscriptionController = new _SubscriptionController(req,null,EmagSubscriptions);
    var _paymentController = new _PaymentController(req);
    var _notificationController = new _NotificationController(req, constants.notif.type.global_emags_subs);
    var validation = new Validation();

    Logger.log('debug', TAG + ACTION + ' request params ', req.body);
    var params = validation.containKeys(require('rekuire')('emag_subscription'), req.body);
    if (!params.valid) {
      return res.error(params.error);
    }

    req.body.subscription_type = 'emags';

    async.auto({
      subscription: _subscriptionController.getEmagSubscriptions.bind(_subscriptionController),
      result: ['subscription',_subscriptionController.saveEmagSubscriptions.bind(_subscriptionController)],
      createNotification: ['result', _notificationController.createNotification.bind(_notificationController)],
    }, function(err, result) {
      if (err) return res.error(err);

      var response = {
        status: "success",
        message: "E-magazine Subscription was successfully saved",
        response_date: Math.floor(new Date().getTime() / 1000)
      };

      res.ok(response);
    });
  },

  saveMusicSubscriptions: function(req, res) {
    var ACTION = '[saveMusicSubscriptions]';
    var _subscriptionController = new _SubscriptionController(req,null,MusicSubscriptions);
    var _paymentController = new _PaymentController(req);
    var _notificationController = new _NotificationController(req, constants.notif.type.global_music_subs);
    var validation = new Validation();

    Logger.log('debug', TAG + ACTION + ' request params ', req.body);
    var params = validation.containKeys(require('rekuire')('gen_subscription'), req.body);
    if (!params.valid) {
      return res.error(params.error);
    }

    req.body.subscription_type = 'music';

    async.auto({
      subscription: _subscriptionController.getMovieAndMusicSubscriptions.bind(_subscriptionController),
      result: ['subscription',_subscriptionController.saveMovieAndMusicSubscriptions.bind(_subscriptionController)],
      createNotification: ['result', _notificationController.createNotification.bind(_notificationController)],
    }, function(err, result) {
      if (err) return res.error(err);

      result.result.is_active = 1;
      delete result.result.updated_at;

      var response = {
        result: result.result,
        response_date: Math.floor(new Date().getTime() / 1000)
      };

      res.ok(response);
    });
  },

  saveMovieSubscriptions: function(req, res) {
    var ACTION = '[saveMovieSubscriptions]';
    var _subscriptionController = new _SubscriptionController(req,null,MovieSubscriptions);
    var _paymentController = new _PaymentController(req);
    var _notificationController = new _NotificationController(req, constants.notif.type.global_movie_subs);
    var validation = new Validation();

    Logger.log('debug', TAG + ACTION + ' request params ', req.body);
    var params = validation.containKeys(require('rekuire')('gen_subscription'), req.body);
    if (!params.valid) {
      return res.error(params.error);
    }

    req.body.subscription_type = 'movie';

    async.auto({
      subscription: _subscriptionController.getMovieAndMusicSubscriptions.bind(_subscriptionController),
      result: ['subscription',_subscriptionController.saveMovieAndMusicSubscriptions.bind(_subscriptionController)],
      createNotification: ['result', _notificationController.createNotification.bind(_notificationController)],
    }, function(err, result) {
      if (err) return res.error(err);

      result.result.is_active = 1;
      delete result.result.updated_at;

      var response = {
        result: result.result,
        response_date: Math.floor(new Date().getTime() / 1000)
      };

      res.ok(response);
    });
  },

  getEmagSubscriptions: function(req, res) {
    var ACTION = '[getEmagSubscriptions]';
    var _subscriptionController = new _SubscriptionController(req,null,EmagSubscriptions);
    
    async.auto({
      result: _subscriptionController.getEmagSubscriptions.bind(_subscriptionController),
    }, function(err, result) {
      var activeFlag = 0;

      if (result.result[0] && result.result[0].is_recurring == 1) {
        activeFlag = 1;
      }

      var response = {
        result: result.result?result.result:[],
        is_active: activeFlag,
        response_date: Math.floor(new Date().getTime() / 1000)
      };

      res.ok(response);
    });

  },

  getMusicSubscriptions: function(req, res) {
    var ACTION = '[getMusicSubscriptions]';
    var _subscriptionController = new _SubscriptionController(req,null,MusicSubscriptions);
    
    req.query.subscription_type = 'music';

    async.auto({
      result: _subscriptionController.getMovieAndMusicSubscriptions.bind(_subscriptionController),
    }, function(err, result) {

      var response = {
        result: result.result?result.result:{},
        response_date: Math.floor(new Date().getTime() / 1000)
      };

      res.ok(response);
    });

  },

  getMovieSubscriptions: function(req, res) {
    var ACTION = '[getMovieSubscriptions]';
    var _subscriptionController = new _SubscriptionController(req,null,MovieSubscriptions);
    
    req.query.subscription_type = 'movie';

    async.auto({
      result: _subscriptionController.getMovieAndMusicSubscriptions.bind(_subscriptionController),
    }, function(err, result) {

      var response = {
        result: result.result?result.result:{},
        response_date: Math.floor(new Date().getTime() / 1000)
      };

      res.ok(response);
    });

  },

  saveSubscriptionFromInAppPurchase: function(req, res) {
    var ACTION = '[saveSubscriptionFromInAppPurchase]';
    var notif_type = null;
    var model;
    req.body.subscription_type = req.body.subscription_type.toLowerCase();
    if (req.body.subscription_type == 'movie') {
      notif_type = constants.notif.type.global_movie_subs;
      req.description = "Movie Subscription";
      model = MovieSubscriptions;
    } else if (req.body.subscription_type == 'music') {
      notif_type = constants.notif.type.global_music_subs;
      req.body.description = "Music Subscription";
      model = MusicSubscriptions;
    } else {
      notif_type = constants.notif.type.global_emags_subs;
      req.body.description = "E-magazines Subscription";
      model = EmagSubscriptions;
    }
    var _subscriptionController = new _SubscriptionController(req,null,model);
    var validation = new Validation();
    
    Logger.log('debug', TAG + ACTION + ' request params ', req.body);
    var params = validation.containKeys(require('rekuire')('inapp_subscription'), req.body);
    if (!params.valid) {
      return res.error(params.error);
    }

    req.body.amount =  parseFloat(req.body.amount);
    if (isNaN(req.body.amount)) {
      err_obj = Errors.raise("MISSING_INVALID_PARAMS");
      err_obj.error.params.push(Errors.getParam('payment_amount'));
      return cb(err_obj);
    }

    var _notificationController = new _NotificationController(req, notif_type);
    async.auto({
      result: _subscriptionController.saveSubscriptionsFromInApp.bind(_subscriptionController),
      createNotification: ['result', _notificationController.createNotification.bind(_notificationController)],
    }, function(err, result) {
      if (err) return res.error(err);

      var response = {
        result: result.result,
        response_date: Math.floor(new Date().getTime() / 1000)
      };

      if (req.body.subscription_type.toLowerCase() != "emags") {
        response.result.is_active = 1;
        delete response.result.updated_at;
      } else {
        response.is_active = 1;
      }

      res.ok(response);
    });
  },

  cancelSubscriptionFromInAppPurchase: function(req, res) {
    var ACTION = '[cancelSubscriptionFromInAppPurchase]';
    var model;
    req.body.subscription_type = req.body.subscription_type.toLowerCase();
    if (req.body.subscription_type == 'music') {
      model = MusicSubscriptions;
    } else if (req.body.subscription_type == 'movie') {
      model = MovieSubscriptions;
    } else {
      model = EmagSubscriptions;
    }
    var _subscriptionController = new _SubscriptionController(req,null,model);
    
    async.auto({
      result: _subscriptionController.cancelSubscription.bind(_subscriptionController),
    }, function(err, result) {
      if (err) return res.error(err);

      var response = {
        status: "success",
        message: "Subscription was successfully cancelled",
        response_date: Math.floor(new Date().getTime() / 1000)
      };

      res.ok(response);
    });
  },

  //METHODS BELOW THIS LINE ARE FOR TESTING ONLY

  deleteSubscription: function(req, res) {
    var ACTION = '[resetSubscription]';
    var model;
    req.body.subscription_type = req.body.subscription_type.toLowerCase();
    if (req.body.subscription_type == 'music') {
      model = MusicSubscriptions;
    } else if (req.body.subscription_type == 'movie') {
      model = MovieSubscriptions;
    } else {
      model = EmagSubscriptions;
    }
    var _subscriptionController = new _SubscriptionController(req,null,model);

    async.auto({
      result: _subscriptionController.deleteSubscription.bind(_subscriptionController),
    }, function(err, result) {
      if (err) return res.error(err);

      var response = {
        status: "success",
        message: "Subscription was successfully deleted",
        response_date: Math.floor(new Date().getTime() / 1000)
      };

      res.ok(response);
    });
  },

  deactivateSubscription: function(req, res) {
    var ACTION = '[resetSubscription]';
    var model;
    req.body.subscription_type = req.body.subscription_type.toLowerCase();
    if (req.body.subscription_type == 'music') {
      model = MusicSubscriptions;
    } else if (req.body.subscription_type == 'movie') {
      model = MovieSubscriptions;
    } else {
      model = EmagSubscriptions;
    }
    var _subscriptionController = new _SubscriptionController(req,null,model);

    async.auto({
      result: _subscriptionController.deactivateSubscription.bind(_subscriptionController),
    }, function(err, result) {
      if (err) return res.error(err);

      var response = {
        status: "success",
        message: "Subscription was successfully deactivated",
        response_date: Math.floor(new Date().getTime() / 1000)
      };

      res.ok(response);
    });
  },

};