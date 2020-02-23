var req = require('rekuire');
var jsonParser = require('js2xmlparser');
var XMLClient = req('XMLClient');
// var _BalanceController = req('_BalanceController');
var rules = req('rules');
var TAG = "[Matrixx][_groupParser]";

module.exports = {

  add: function(content, callback) {
    content.request_reference_no = Utility.getRefNum();
    var data = {
      "Name": content.first_name,
      "Tier": content.last_name,
      "NotificationPreference": content.notif_preference,
      "GroupReAuthPreference": content.external_id
    };
    if (content.search_data) {
      data["AdminArray"] = {
        "MtxSubscriberSearchData": {}
      };
      if (content.search_data.matrixx_id) {
        data["AdminArray"]["MtxSubscriberSearchData"]["ObjectId"] = content.search_data.matrixx_id;
      }
      if (content.search_data.external_id) {
        data["AdminArray"]["MtxSubscriberSearchData"]["ExternalId"] = content.search_data.matrixx_id;
      }
    }
    data = jsonParser("MtxRequestGroupCreate", data);
    var options = sails.config.matrixx.options;
    options.method = 'POST';
    options.path = sails.config.matrixx.base_path +'/group';

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

  get: function(content, callback) {
    content.request_reference_no = Utility.getRefNum();
    var data = "";
    var options = sails.config.matrixx.options;
    options.method = 'GET';
    options.path = sails.config.matrixx.base_path +'/group/' + content.group_id;
    XMLClient.request(options, data, content.request_reference_no, function(err, result) {
      if (err) {
        callback(err);
      } else {
        var obj = {
          group_matrixx_id : result.MtxResponseGroup.ObjectId,
          external_id: result.MtxResponseGroup.ExternalId,
          subscriber_members: result.MtxResponseGroup.SubscriberMemberIdArray.value,
          subscriber_count: result.MtxResponseGroup.SubscriberCount,
          group_balance: result.MtxResponseGroup.BalanceArray ? Utility.format(result.MtxResponseGroup.BalanceArray.MtxBalanceInfo, "shared") : '',
        };
        callback(null, obj);
      }
    });  
  }
  
}