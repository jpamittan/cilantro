var TAG = '[ActiveMQ]';
var Stomp = require('stompit');
var xmlParser = require('xml2json');
var uuid = require('node-uuid');
var req = require('rekuire');
var matrixx = req('_groupParser');
var spiels = req('spiels');
var constants = req('constants');
var rules = req('rules');
var offers = req('offers');

module.exports = {

  initialize: function() {
    var ACTION = '[initialize]';
    var _this = this;
    var connectOptions = {
      'host': sails.config.active_mq.host,
      'port': sails.config.active_mq.port,
      'ssl': false, //false for dev environment
      'rejectUnauthorized': false,
      'keepAlive': true,
      'connectHeaders':{
        'host': '/',
        'login': sails.config.active_mq.username,
        'passcode': sails.config.active_mq.password
      }
    };
    Logger.log('debug', TAG + ACTION, 'Initialize ActiveMQ.');
    Stomp.connect(connectOptions, function(error, client) {
      if (error) {
        console.log('connect error ' + error.message);
        return;
      }
      Logger.log('debug', TAG + ACTION, 'Connected to ActiveMQ');
      var subscribeHeaders = {
        'destination': sails.config.active_mq.url,
        'ack': 'auto'
      };
      client.subscribe(subscribeHeaders, function(error, message) {
        if (error) {
          console.log('subscribe error ' + error.message);
          return;
        }
        var notification, obj;
        message.readString('utf-8', function(error, body) {
          if (error) {
            console.log('read message error ' + error.message);
            return;
          }
          message = JSON.parse(xmlParser.toJson(body));
          switch(true) {
            case (message.MtxDeviceStatusNotification != undefined):
              notification = message.MtxDeviceStatusNotification;
              if (notification.DescriptionBefore == 'PreActive' && notification.DescriptionAfter == 'Active') {
                var msisdn = notification.ExternalId.toString().slice(1);
                obj = {
                  type: 'first use',
                  name: 'First Use'
                };
                _this.sendSMS(msisdn, constants.sms_notif.name, spiels.activeMQ.first_use.spiel);
              }
              break;
            case (message.MtxBalanceThresholdNotification != undefined):
              notification = message.MtxBalanceThresholdNotification;
              obj = {
                type: 'usage',
                name: notification.ThresholdName
              };
              _this.saveNotification(obj, notification);
              break;
            case (message.MtxBalanceExpirationNotification != undefined):
              notification = message.MtxBalanceExpirationNotification;
              var time_diff = (new Date(notification.EndTime)) - (new Date(notification.StartTime));
              if (time_diff < 3600000) {
                obj = undefined;
              } else {
                if (notification.NotificationTime < notification.EndTime) {
                  obj = {
                    type: 'expiration',
                    name: '1 Hour before Expiration'
                  };
                  _this.saveNotification(obj, notification);
                } else if (notification.NotificationTime >= notification.EndTime) {
                  obj = {
                    type: 'expiration',
                    name: 'Expired'
                  };
                  _this.saveNotification(obj, notification);
                }
              }
              break;
          }
        });
      });
    });
  },

  getMessage: function(template_id, threshold_name) {
    var ACTION = '[getMessage]';
    var message;
    var spiel = "";
    var temp_id = template_id.toString();
    var spiel_categories = rules.activeMQ.spiel_categories;
    spiel_categories.forEach(function(category) {
      var group = rules.activeMQ[category];
      if (group.template_id.indexOf(template_id) >= 0) {
        spiel = spiels.activeMQ[category].spiel[threshold_name];
        var offer_name = offers.offer_name[temp_id];
        message = spiel.replace('%offer_name%', offer_name);
      }
    });
    return message;
  },

  getUnit: function(template_id) {
    var ACTION = '[getUnit]';
    var unit;
    var spiel_categories = rules.activeMQ.spiel_categories;
    spiel_categories.forEach(function(category) {
      var group = rules.activeMQ[category];
      if (group.template_id.indexOf(template_id) >= 0) {
        unit = constants.unit.type[category];
      }
    });
    return unit;
  },

  saveNotification: function(obj, notification) {
    var ACTION = '[saveNotification]';
    var _this = this;
    Logger.log('debug', TAG + ACTION, 'notification : ' + JSON.stringify(obj));
    if (rules.activeMQ.template_id.indexOf(notification.TemplateId) >= 0) {
      console.log('CHECK');
      var msg = _this.getMessage(notification.TemplateId, obj.name);
      var balance_unit = _this.getUnit(notification.TemplateId);
      var details = {
        balance: {
          unit: balance_unit,
          value: Math.abs(notification.Amount)
        },
        validity: notification.EndTime,
        template_id: notification.TemplateId
      };

      var obj = {
        id: uuid.v4(),
        type: obj.type,
        name: obj.name,
        message: msg,
        details: JSON.stringify(details)
      };
      Basil.getAccount({id : notification.ObjectExternalId}, function(err, account) {
        if (err || account == undefined) {
          Logger.log('error', TAG + ACTION , err);
        } else {
          obj.cilantro_id = account.cilantro_id;
          var device = {
            device_os: account.profile.device_os, 
            device_arn: account.profile.device_arn
          };
          Notification.create(obj, function(err, data) {
            if (err) Logger.log('error', TAG + ACTION, err);
          });
          _this.sendPushNotif(device, msg);
          _this.sendSMS(msisdn, constants.sms_notif.name, msg);
        }
      });
      
    }
  },

  sendPushNotif: function(device, msg) {
    var ACTION = '[sendPushNotif]';
    Logger.log('debug', TAG + ACTION, 'message : ' + msg);
    Notifier.notify(device, msg);
  },

  sendSMS: function(msisdn, title, msg) {
    var ACTION = '[sendSMS]';
    Logger.log('debug', TAG + ACTION, 'Initialize SMS.');
    var sms_obj = {
      msisdn: msisdn,
      title: title,
      message: msg
    };
    SMSService.send(sms_obj, function(err, result) {
      if (err) {
        Logger.log('error', TAG + ACTION, err);
      } else {
      var obj = {
        message : msg,
        message_send_status : result
      };
      Logger.log('debug', TAG + ACTION, JSON.stringify(obj));
      }
    });
  }
}
