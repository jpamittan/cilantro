var req = require('rekuire');
var jsonParser = require('js2xmlparser');
var XMLClient = req('XMLClient');
var _BalanceController = req('_BalanceController');
var rules = req('rules');
var TAG = "[Matrixx][_subscriberParser]";

module.exports = {

  register: function(content, callback) {
    content.request_reference_no = Utility.getRefNum();
    var data = {
      "RequestList": {
        "MtxRequestSubscriberCreate": {
          "ExternalId": content.external_id,
          "Status": content.subscriber_status,
          "TimeZone": content.time_zone,
          "Attr": { 
            "HermosaSubscriberExtension": {
              "AccountBrand" : content.account_brand,
              "SubCreateDate" : content.creation_date,
            } 
          }
        },
        "MtxRequestDeviceCreate": {
          "Status": content.device_status,
          "DeviceType": content.device_type,
          "ExternalId": 'D' + content.external_id,
          "Attr": {
            "HermosaDeviceExtension": {
              "DevCreateDate" : content.creation_date,
              "ShelfLife" : content.shelf_life,
              "Imsi": content.imsi,
              "AccessNumberArray": {
                "value": content.external_id
              }
            }
          }
        },
        "MtxRequestSubscriberAddDevice": {
          "SubscriberSearchData": {
            "MtxSubscriberSearchData": {
              "MultiRequestIndex": 0
            }
          },
          "DeviceSearchData": {
            "MtxDeviceSearchData": {
              "MultiRequestIndex": 1
            }
          }
        },
        "MtxRequestSubscriberPurchaseOffer": {
          "SubscriberSearchData": {
            "MtxSubscriberSearchData": {
              "MultiRequestIndex": 0
            }
          },
          "OfferRequestArray" : {
            "MtxPurchasedOfferData" : [
            {
              "ExternalId" : "Setup Services"
            }
            ]
          }
        }
      }
    };
    // if (content.preload_name) {
    //   var offer = {
    //     "ExternalId" : content.preload_name
    //   };
    //   data.RequestList.MtxRequestSubscriberPurchaseOffer.OfferRequestArray.MtxPurchasedOfferData.push(offer);
    // }
    data = jsonParser("MtxRequestMulti", data);
    var options = sails.config.matrixx.options;
    options.method = 'POST';
    options.path = sails.config.matrixx.base_path +'/subscriber';
    XMLClient.request(options, data, content.request_reference_no, function(err, result) {
      if (err) {
        callback(err);
      } else {
        var obj = {
          matrixx_id: result.MtxResponseMulti.ResponseList.MtxResponseCreate[0].ObjectId
        };
        callback(null, result);
      }
    });  
  },

  get: function(content, callback) {
    content.request_reference_no = Utility.getRefNum();
    var data = "";
    var options = sails.config.matrixx.options;
    options.method = 'GET';
    if (content.type == 'ObjectId') {
      options.path = sails.config.matrixx.base_path +'/subscriber/' + content.value;
    } else {
      options.path = sails.config.matrixx.base_path +'/subscriber/query/' + content.type + '/' + content.value;
    }
    var _balanceController = new _BalanceController();
    XMLClient.request(options, data, content.request_reference_no, function(err, result) {
      if (err) {
        callback(err);
      } else {
        var hermosa_attr = result.MtxResponseSubscriber.Attr.HermosaSubscriberExtension;
        var obj = {
          matrixx_id: result.MtxResponseSubscriber.ObjectId,
          external_id: result.MtxResponseSubscriber.ExternalId + "",
          mtx_device_id: result.MtxResponseSubscriber.DeviceIdArray.value,
          // status: result.MtxResponseSubscriber.StatusDescription,
          // activated: false,
          brand: hermosa_attr.AccountBrand + "",
          load_protected: true
        };
        // if (hermosa_attr && hermosa_attr.ActivationSuccess) {
        //   obj.activated = hermosa_attr.ActivationSuccess.toUpperCase() == "YES" ? true : false;
        // }
        if (hermosa_attr && hermosa_attr.LoadProtect) {
          obj.load_protected = hermosa_attr.LoadProtect.toUpperCase() == "YES" ? true : false;
        }
        if (result.MtxResponseSubscriber.BalanceArray) {
          // obj.usage = result.MtxResponseSubscriber.BalanceArray.MtxBalanceInfo;
          // obj.balance = _balanceController.format(result.MtxResponseSubscriber.BalanceArray.MtxBalanceInfo, "personal");
          // obj.group = _balanceController.format(result.MtxResponseSubscriber.BalanceArray.MtxBalanceInfo, "group");
          // obj.group_balance = _balanceController.format(result.MtxResponseSubscriber.BalanceArray.MtxBalanceInfo, "shared");
          // obj.all_balance = result.MtxResponseSubscriber.BalanceArray.MtxBalanceInfo;
          // obj.total_balance = _balanceController.getTotalBalance(obj.balance, obj.group_balance);
          // obj.preload_balance = _balanceController.format1(result.MtxResponseSubscriber.BalanceArray.MtxBalanceInfo,'preload');
          if (content.format_type == "all_balance_no_format") {
            obj.balance = result.MtxResponseSubscriber.BalanceArray.MtxBalanceInfo;
          } else {
            obj.balance = _balanceController.format(result.MtxResponseSubscriber.BalanceArray.MtxBalanceInfo,'balance');
          }
        }
        return callback(null, obj);
      }
    });  
  },

  getPurchaseBalance: function(content, callback) {
    content.request_reference_no = Utility.getRefNum();
    var data = "";
    var options = sails.config.matrixx.options;
    var _balance = new _BalanceController();
    options.method = 'GET';
    if (content.type == 'ObjectId') {
      options.path = sails.config.matrixx.base_path +'/subscriber/' + content.value;
    } else {
      options.path = sails.config.matrixx.base_path +'/subscriber/query/' + content.type + '/' + content.value;
    }
    XMLClient.request(options, data, content.request_reference_no, function(err, result) {
      if (err) {
        callback(err);
      } else {
        var balance = _balance.extract(
          result.MtxResponseSubscriber.BalanceArray.MtxBalanceInfo, 
          content.balance_list
        );
        callback(null, balance);
      }
    });  
  },

  modify: function(content, callback) {
    content.request_reference_no = Utility.getRefNum();
    content.subscriber = content.subscriber ? content.subscriber : {};
    content.subscriber.profile = content.subscriber.profile ? content.subscriber.profile : {};
    var data = {
      "SubscriberSearchData": {
        "MtxSubscriberSearchData": {
          "ObjectId": content.subscriber.matrixx_id
        }
      },
      "ExternalId": content.subscriber.external_id,
      "NotificationPreference": content.subscriber.notif_preference,
      "TimeZone": content.subscriber.timezone,
      "Attr": { "HermosaSubscriberExtension": {} },
    };
    // if (content.subscriber.role !== undefined) {
    //   data.Attr.HermosaSubscriberExtension.Role = content.subscriber.role;
    // }
    if (content.subscriber.activated !== undefined) {
      data.Attr.HermosaSubscriberExtension.RegistrationSuccess = (content.subscriber.activated == true) ? 'Yes' : 'No';
      // rules.rating_group.list.forEach(function(app_meter) {
      //   data.Attr.HermosaSubscriberExtension[rules.rating_group[app_meter].name] = {};
      //   data.Attr.HermosaSubscriberExtension[rules.rating_group[app_meter].name].value = rules.rating_group[app_meter].rg_list;
      // });
    }
    if (content.subscriber.load_protected !== undefined) {
      data.Attr.HermosaSubscriberExtension.LoadProtect = (content.subscriber.load_protected == true) ? 'Yes' : 'No';
    }
    // if (content.subscriber.status !== undefined) {
    //   //data.Status = content.subscriber.status;
    // }
    data = jsonParser("MtxRequestSubscriberModify", Utility.filterObject(data));
    var options = sails.config.matrixx.options;
    options.method = 'PUT';
    options.path = sails.config.matrixx.base_path +'/subscriber/' + content.subscriber.matrixx_id;

    XMLClient.request(options, data, content.request_reference_no, function(err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, result);
      }
    });  
  },
  
}