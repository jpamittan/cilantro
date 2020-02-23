var TAG = '[_UsageController]';
var req = require('rekuire');
var matrixx = req('Matrixx');
var rules = req('rules');
var constants = req('constants');
var tc = require('timezonecomplete');

function _UsageController(req, options) {
  this.req = req;
  this.options = options;
};

_UsageController.prototype.getPreviousUsage = function (cb, result) {
  var ACTION = '[getPreviousUsage]';
  DataUsage.find({cilantro_id: this.req.account.cilantro_id}, function(err, data) {
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return cb(Errors.raise('DB_ERROR'));
    }
    return cb(null, data);
  });
};

_UsageController.prototype.getGroupUsage = function (cb, result) {
  var ACTION = '[getGroupUsage]';
  var shared = {};
  var _this = this;

  for (balance in result.getSubscriber.group_balance) {
    shared[balance] = {
      expiration: result.getSubscriber.group_balance[balance].remaining,
      subscribers: []
    };
    shared[balance].total = JSON.parse(JSON.stringify(result.getSubscriber.group_balance[balance]));
    shared[balance].balance = JSON.parse(JSON.stringify(result.getSubscriber.group_balance[balance]));
  }
  async.eachSeries(result.getGroup.subscriber_members, function iterator(member_id, async_cb) {
    var obj = {
      type: 'ObjectId',
      value: member_id
    };
    matrixx.getSubscriber(obj, function(err, data) {
      if (err) return async_cb(err);
      for (balance in data.group) {
        var group_member = {
          role: data.role,
          msisdn: data.external_id,
          usage: data.group[balance]
        };
        shared[balance].total.value += data.group[balance].value;
        shared[balance].total.display = Utility.convert(shared[balance].total);
        shared[balance].subscribers.push(group_member);
      }
      async_cb(null, data);
    });
  }, function(err, data) {
    cb(err, shared);
  });
};

_UsageController.prototype.format = function (results) {
  var ACTION = '[format]';
  var prev_usage_categories = {};
  var obj = {
    shared: results.getGroupUsage,
    personal: {
      categories: [],
      boosters: []
    }
  };

  for (balance in results.getSubscriber.balance) {
    obj.personal[balance] = {
      expiration: results.getSubscriber.balance[balance].expiration,
      balance: {}
    };
    obj.personal[balance].balance.date = results.getSubscriber.balance[balance].date;
    obj.personal[balance].balance.unit = results.getSubscriber.balance[balance].unit;
    obj.personal[balance].balance.value = results.getSubscriber.balance[balance].value;
    obj.personal[balance].balance.display = results.getSubscriber.balance[balance].display;
  }

  //Get previous usage per category
  rules.usage_type.forEach(function(category, index) {
    var prev_usage = _.where(results.getPreviousUsage, {category: category});
    var total_usage = 0;
    var usage_category = {
      category_name: rules.usage_type_name[index],
      color_name: rules.color_palette[index],
      dates: []
    };
    prev_usage.forEach(function(element) {
      var date = {
        date: element.created_at,
        usage: {
          value: element.usage_today,
          unit: element.usage_unit
        }
      };
      date.usage.display = Utility.convert(date.usage);
      total_usage += parseFloat(element.usage_today);
      usage_category.dates.push(date);
    });
    prev_usage_categories[category] = {
      total_usage: total_usage,
      usage : usage_category
    };
  });

  // Iterate over all subcriber balance
  results.getSubscriber.usage.forEach(function(usage) {
    // Category Usage
    if (rules.usage_type.indexOf(usage.Name) >= 0) {
      var difference = parseFloat(usage.Amount) - prev_usage_categories[usage.Name].total_usage;
      var usage_detail = {
        date: new Date(),
        usage: {
          value: difference < 0 ? 0 : difference,
          unit: usage.QuantityUnit
        }
      };
      usage_detail.usage.display = Utility.convert(usage_detail.usage);
      prev_usage_categories[usage.Name].usage.dates.push(usage_detail);
      obj.personal.categories.push(prev_usage_categories[usage.Name].usage);
    };

    // Booster Usage
    var booster_index = rules.booster_type.indexOf(usage.Name);
    if (booster_index >= 0) {
      var booster_detail = {
        name: usage.Name,
        image_url: rules.booster_image_url[booster_index],
        expiration: Utility.convert(usage.EndTime, 'expiration'),
        balance: {
          date: usage.EndTime,
          value: Math.abs(usage.Amount),
          unit: usage.QuantityUnit
        }
      };
      if (rules.booster_type3.indexOf(usage.Name) >= 0){
        booster_detail.balance.display = 'Unlimited';
      } else {
      booster_detail.balance.display = Utility.convert(booster_detail.balance);
      }
      if (booster_detail.expiration == 'Expired') {
        booster_detail.balance.display = 'Expired';
      }
      obj.personal.boosters.push(booster_detail);
    }
  });

  return obj;
};

_UsageController.prototype.getUsage = function (cb, result) {
  var ACTION = '[getUsage]';
  var start_date = new Date(this.req.body.start_date);
  var end_date = new Date(this.req.body.end_date);
  end_date.setDate(end_date.getDate() + 1);
  DataUsage.find({created_at: { '>': start_date, '<': end_date}}, function(err, data) {
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return cb(Errors.raise('DB_ERROR'));
    } else {
      if (data == undefined) return cb(Errors.raise('NOT_FOUND'));
      data = JSON.parse(JSON.stringify(data));
      cb(null, data);
    }
  });
};

_UsageController.prototype.getSummary = function (cb, result) {
  var ACTION = "[getSummary]";
  var obj = [];
  var accounts = result.getActiveAccounts.account;
  var profiles = result.getActiveAccounts.profile;
  for (key in accounts) {
    var usage = _.where(result.getUsage, {cilantro_id: accounts[key].cilantro_id});
    var profile = _.where(profiles, {cilantro_id: accounts[key].cilantro_id})
    var total = _.map(usage, 'usage');
    total = total != '' ? total.reduce(function(a, b) { return parseInt(a) + parseInt(b); }) : 0;
    var detail = {
      msisdn: accounts[key].msisdn,
      user_name: profile.first_name + ' ' + profile.last_name,
      usage: total
    }
    obj.push(detail);
  }
  cb(null,obj);
};

module.exports = _UsageController;




