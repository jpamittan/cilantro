var TAG = '[_SubscriptionController]';
var req = require('rekuire');
var rules = req('rules');
var constants = req('constants');
var Utility = req('Utility');
function _SubscriptionController(req, options,model) {
  if (typeof req === 'undefined') {
    throw new Error('Please pass the request to the constructor.');
  }
  this.req = req;
  this.options = options;
  this.model = model;
}

_SubscriptionController.prototype.saveEmagSubscriptions = function (cb, result) {
  var ACTION = '[saveEmagSubscriptions]';

  if (!result.create) {
      return cb();
  }

  var months = this.req.body.months.split(',');
  var subscriptions = [];
  var _this = this;
  var find = [];

  months.forEach( function(month, index) {
    var subscription_info = {
      cilantro_id           : _this.req.account?_this.req.account.cilantro_id:result.create.cilantro_id,
      subscribed_month      : month.trim(),
      subscription_date     : new Date(),
      is_recurring          : 1,
      subscription_id       : result.subscription?result.subscription[0].subscription_id:''
    };
    subscriptions.push(subscription_info);
    var infoToFind = {
      cilantro_id           : _this.req.account?_this.req.account.cilantro_id:result.create.cilantro_id,
      subscribed_month      : month.trim()
    };
    find.push(infoToFind);
  });

  //create or update
  subscriptions.forEach( function(value,index) {
    EmagSubscriptions.findOne(find[index], function(err, data) {
      if (err) {
        Logger.log('error', TAG + ACTION, err);
        return cb(Errors.raise('DB_ERROR'));
      }
      if (data) {
        EmagSubscriptions.update(find[index],value,function(err,data) {
          if (err) {
            return cb(err);
           }
          return cb(null, data);
        });
      } else {
        EmagSubscriptions.create(value,function(err,data) {
          if (err) {
            return cb(err);
           }
          return cb(null, data);
        });
      }
      return cb(null, data);
    });
  });
};

_SubscriptionController.prototype.saveMovieAndMusicSubscriptions = function (cb, result) {
  var ACTION = '[saveMovieAndMusicSubscriptions]';
  var _this = this;

  if (result.subscription) {
    var err_obj;
    if (result.subscription.is_active == 1) {
      err_obj = Errors.raise("EXISTING_SUBSCRIPTION");
      return cb(err_obj);
    } else {
      err_obj = Errors.raise("FREE_TRIAL_SUBSCRIPTION");
      return cb(err_obj);
    }
  }

  var subscription_info = {
    cilantro_id           : this.req.account.cilantro_id,
    subscription_date     : new Date(),
    is_recurring          : 0,
    subscription_id       : null
  };
    
  this.model.create(subscription_info,function(err,data) {
    if (err) {
      return cb(err);
     }
    return cb(null, data);
  });

};

_SubscriptionController.prototype.getEmagSubscriptions = function (cb, result) {
  var ACTION = '[getEmagSubscriptions]';

  EmagSubscriptions.find({where:{cilantro_id: this.req.account.cilantro_id}, sort:'created_at DESC'}, function(err, data) {
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return cb(Errors.raise('DB_ERROR'));
    }
    return cb(null, data);
  });
};

_SubscriptionController.prototype.getMovieAndMusicSubscriptions = function (cb, result) {
  var ACTION = '[getMovieAndMusicSubscriptions]';
  var subscriptions = JSON.parse(JSON.stringify(constants.subscriptions));
  var free_duration;
  var paid_duration;
  var subscription_type = this.req.body?this.req.body.subscription_type:this.req.query.subscription_type;
  if (subscription_type == 'music') {
    free_duration = subscriptions['music_free_duration'];
    paid_duration = subscriptions['music_duration'];
  } else if (subscription_type == 'movie') {
    free_duration = subscriptions['movie_free_duration'];
    paid_duration = subscriptions['music_duration'];
  }
  var _this = this;
  
  this.model.findOne({where:{cilantro_id: this.req.account.cilantro_id}, sort:'created_at DESC'}, function(err, data) {
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return cb(Errors.raise('DB_ERROR'));
    }
    if (data) {
      var duration;
      var subscription_date = new Date(data.subscription_date);
      var subscription_end_date;
      var date_updated = new Date(data.updated_at);
      var now = new Date();
      if (data.is_recurring == 0 && !data.subscription_id) {
        duration = free_duration.split(" ");
        if (duration.indexOf('day') != -1) {
          subscription_end_date = new Date(subscription_date.getTime() + duration[0]*24*60*60*1000);
        } else {
          subscription_end_date = Utility.addMonths(subscription_date,duration[0]);
        }

        if ((now > subscription_end_date) || (subscription_date.valueOf() != date_updated.valueOf())) {
          data.is_active = 0;
        } else {
          data.is_active = 1;
        }

      } else if(data.is_recurring == 0 && data.subscription_id) {
        duration = paid_duration.split(" ");
        if (duration.indexOf('day') != -1) {
          subscription_end_date = new Date(subscription_date.getTime() + duration[0]*24*60*60*1000);
        } else {
          subscription_end_date = Utility.addMonths(subscription_date,duration[0]);
        }

        if (now > subscription_end_date) {
          data.is_active = 0;
        } else {
          data.is_active = 1;
        }
      } else {
        data.is_active = 1;
      }

      if (_this.req.query.is_active) {
        data.is_active = _this.req.query.is_active;
      }

      delete data.updated_at;
    }

    return cb(null, data);
  });
};


//Cancellation when a subscription is not in paid in the middle of subscription
//A Webhook is triggered by stripe to cancel subscription of customer
_SubscriptionController.prototype.cancelSubscription = function (cb, result) {
  var ACTION = '[cancelSubscription]';
  var _this = this;
  
  if (result.cancel && result.cancel.err) {
    return cb(result.cancel);
  }
  
  var subscription_info = {
    is_recurring          : 0,
    subscription_id: null
  };

  var cilantro_id = this.req.account.cilantro_id?this.req.account.cilantro_id:result.subscriber.cilantro_id;

  if (this.req.body.subscription_type != "emags") {
    this.model.findOne({where:{cilantro_id: cilantro_id}}, function(err, data) {
      if (err) {
        Logger.log('error', TAG + ACTION, err);
        return cb(Errors.raise('DB_ERROR'));
      }
      if (data) {
        if (!data.subscription_id) {
          err_obj = Errors.raise("NO_EXISTING_SUBSCRIPTION");
          return cb(err_obj);
        }
        _this.model.update({cilantro_id: cilantro_id},subscription_info,function(err,data) {
          if (err) {
            return cb(err);
           }
          return cb(null, data);
        });
      }
      return cb(null, data);
    });
  } else {
    this.model.update({cilantro_id: cilantro_id},subscription_info, function(err, data) {
      if (err) {
        return cb(err);
      }
      return cb(null, data);
    });
  }

};

_SubscriptionController.prototype.saveSubscriptionsFromInApp = function (cb, result) {
  var ACTION = '[saveSubscriptionsFromInApp]';
  var _this = this;
  var subscriptions = JSON.parse(JSON.stringify(constants.subscriptions));
  var paid_duration;
  var now = new Date();
  var subscription_info = {
    cilantro_id           : this.req.account.cilantro_id,
    subscription_date     : new Date(),
    is_recurring          : this.req.body.is_recurring?this.req.body.is_recurring:0,
    subscription_id       : this.req.body.subscription_id,
    os                    : this.req.body.os,
  };

  if (this.req.body.subscription_type != 'emags') {
    this.model.findOne({where:{cilantro_id: this.req.account.cilantro_id}}, function(err, data) {
      if (err) {
        Logger.log('error', TAG + ACTION, err);
        return cb(Errors.raise('DB_ERROR'));
      }

      if (data) {
        var subscription_date = new Date(data.subscription_date);
        var subscription_end_date;
        if (_this.req.body.subscription_type == 'movie') {
          paid_duration = subscriptions['movie_duration'];
        } else {
          paid_duration = subscriptions['music_duration'];
        }
        
        if (data.subscription_id && data.is_recurring == 1) {
          var err_obj = Errors.raise("EXISTING_SUBSCRIPTION");
          return cb(err_obj);
        } else if (data.subscription_id && data.is_recurring == 0) {
          duration = paid_duration.split(" ");
          if (duration.indexOf('day')) {
            subscription_end_date = new Date(subscription_date.getTime() + duration[0]*24*60*60*1000);
          } else {
            subscription_end_date = Utility.addMonths(subscription_date,duration[0]);
          }

          if (now < subscription_end_date) {
            var err_obj = Errors.raise("EXISTING_SUBSCRIPTION");
            return cb(err_obj);
          }
        }
        _this.model.update({cilantro_id: _this.req.account.cilantro_id},subscription_info,function(err,data) {
          if (err) {
            return cb(err);
          }
          return cb(null, data);
        });
      } else {
        _this.model.create(subscription_info,function(err,data) {
          if (err) {
            return cb(err);
           }
          return cb(null, data);
        });
      }
    });
  } else {
    var months = this.req.body.months.split(',');
    var subscriptions = [];
    var find = [];

    months.forEach( function(month, index) {
      var subscription_info = {
        cilantro_id           : this.req.account.cilantro_id,
        subscribed_month      : month.trim(),
        subscription_date     : new Date(),
        is_recurring          : this.req.body.is_recurring?this.req.body.is_recurring:0,
        subscription_id       : this.req.body.subscription_id
      };
      subscriptions.push(subscription_info);
      var infoToFind = {
        cilantro_id           : this.req.account.cilantro_id,
        subscribed_month      : month.trim()
      };
      find.push(infoToFind);
    });

    //create or update
    subscriptions.forEach( function(value,index) {
      EmagSubscriptions.findOne(find[index], function(err, data) {
        if (err) {
          Logger.log('error', TAG + ACTION, err);
          return cb(Errors.raise('DB_ERROR'));
        }
        if (data) {

          EmagSubscriptions.update(find[index],value,function(err,data) {
            if (err) {
              return cb(err);
             }
            return cb(null, data);
          });
        } else {
          EmagSubscriptions.create(value,function(err,data) {
            if (err) {
              return cb(err);
             }
            return cb(null, data);
          });
        }
      });
    });
  }
};

_SubscriptionController.prototype.deleteSubscription = function (cb, result) {
  var ACTION = '[deleteSubscription]';

  this.model.destroy({cilantro_id: this.req.account.cilantro_id}).exec(function(err, data) {
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return cb(Errors.raise('DB_ERROR'));
    }
    return cb(null,data);
  });
  

};

_SubscriptionController.prototype.deactivateSubscription = function (cb, result) {
  var ACTION = '[deactivateSubscription]';

  var subscription_info = {
    subscription_date : new Date('2011-01-01'),
    is_recurring      : 0,
    subscription_id   : '',
  };

  this.model.update({cilantro_id: this.req.account.cilantro_id},subscription_info,function(err,data) {
    if (err) {
      return cb(err);
    }
    return cb(null, data);
  });

};

module.exports = _SubscriptionController;