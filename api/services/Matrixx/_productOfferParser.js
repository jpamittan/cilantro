var req = require('rekuire');
var jsonParser = require('js2xmlparser');
var XMLClient = req('XMLClient');

var TAG = "[Matrixx][_groupParser]";

module.exports = {

  purchase: function(content, callback) {
    content.request_reference_no = Utility.getRefNum();
    content.mtx_device_id = content.mtx_device_id || (content.subscriber ? content.subscriber.mtx_device_id : "");
    var data = {
      "OfferRequestArray": {
        "MtxPurchasedOfferData": {
          "ExternalId": content.offer.external_id,
          "Attr": {
            "HermosaPurchasedOfferExtension": {
              // "ChargeAmount": content.offer.charge_amount,
              // "ChargeUnit": content.offer.charge_unit,
              // "GrantAmount": content.offer.grant_amount,
              // "GrantUnit": content.offer.grant_unit,
              // "ValidityAmount": content.offer.validity_amount,
              // "ValidityUnit": content.offer.validity_unit,
              // "Impact": content.offer.impact,
              // "ApplicationRGList": content.offer.rg_list ? {"value": content.offer.rg_list} : undefined
              "ChannelName": content.offer.channel_name,
              "FundSource": content.offer.fund_source
            }
          }
        }
      }
    };
    data.OfferRequestArray.MtxPurchasedOfferData.Attr.HermosaPurchasedOfferExtension = Utility.filterObject(data.OfferRequestArray.MtxPurchasedOfferData.Attr.HermosaPurchasedOfferExtension);
    var options = sails.config.matrixx.options;
    options.method = 'PUT';
    if (content.offer.impact != 'Group'){
      // data = jsonParser("MtxRequestSubscriberPurchaseOffer", data);
      // options.path = sails.config.matrixx.base_path +'/subscriber/' + content.matrixx_id + '/offers'
      data = jsonParser("MtxRequestDevicePurchaseOffer", data);
      options.path = sails.config.matrixx.base_path +'/device/' + content.mtx_device_id + '/offers'
    } else {
      data = jsonParser("MtxRequestGroupPurchaseOffer", data);
      options.path = sails.config.matrixx.base_path +'/group/' + content.matrixx_id + '/offers'
    }
    XMLClient.request(options, data, content.request_reference_no, function(err, result) {
      if (err) {
        callback(err);
      } else {
        var obj = {
          balance_list: result.MtxResponsePurchase.PurchaseInfoArray.MtxPurchaseInfo.RequiredBalanceArray.MtxRequiredBalanceInfo || []
        };
        if (!obj.balance_list.length) {
          obj.balance_list = [obj.balance_list];
        }
        callback(null, obj);
      }
    });
  },

  create: function(content, callback) {
    content.request_reference_no = Utility.getRefNum();
    var data = {
      "OfferRequestArray": {
        "MtxPurchasedOfferData": {
          "ExternalId": content.offer.external_id,
          }
        }
    };
    var options = sails.config.matrixx.options;
    options.method = 'PUT';
    data = jsonParser("MtxRequestSubscriberPurchaseOffer", data);
    options.path = sails.config.matrixx.base_path +'/subscriber/' + content.matrixx_id + '/offers'
    XMLClient.request(options, data, content.request_reference_no, function(err, result) {
      if (err) {
        callback(err);
      } else {
        var obj = {
          request_reference_no : content.request_reference_no,
        };
        callback(null, result);
      }
    });
  },

  setupPurchase: function(content, callback) {
    content.request_reference_no = Utility.getRefNum();
    var data = {
      "RequestList": {
        "MtxPurchasedOfferData": {
          "ExternalId": content.external_id,
        },
        "MtxPurchasedOfferData": {
          "ExternalId": content.external_id,
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
        }
      }
    };
    data = jsonParser("MtxRequestMulti", data);
    var options = sails.config.matrixx.options;
    options.method = 'POST';
    options.path = sails.config.matrixx.base_path +'/subscriber/' + content.matrixx_id + '/offers'
  
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

}