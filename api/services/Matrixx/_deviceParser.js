var req = require('rekuire');
var jsonParser = require('js2xmlparser');
var XMLClient = req('XMLClient');
var rules = req('rules');
var TAG = "[Matrixx][_deviceParser]";

module.exports = {

  create: function(content, callback) {
    content.request_reference_no = Utility.getRefNum();
    var data = {
      "SubscriberId": content.external_id,
      "DeviceType": content.device_type,
      "Attr": {
        "HermosaDeviceExtension": {
          "Imsi": content.imsi,
          "AccessNumberArray": {
            "value": content.msisdn
          }
        }
      }
    };
    data = jsonParser("MtxRequestDeviceCreate", data);
    var options = sails.config.matrixx.options;
    options.method = 'POST';
    options.path = sails.config.matrixx.base_path + '/device';

    XMLClient.request(options, data, content.request_reference_no, function(err, result) {
      console.log('RESULT' + result);
      if (err) {
        callback(err);
      } else {
        var obj = {
          request_reference_no : content.request_reference_no
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
      options.path = sails.config.matrixx.base_path +'/device/' + content.value;
    } else {
      options.path = sails.config.matrixx.base_path +'/device/query/' + content.type + '/' + content.value;
    }
    XMLClient.request(options, data, content.request_reference_no, function(err, result) {
      if (err) {
        callback(err);
      } else {
        var obj = {
          mtx_device_id: result.MtxResponseDevice.ObjectId,
          status: result.MtxResponseDevice.StatusDescription,
        };
        return callback(null, obj);
      }
    });  
  },

  modify: function(content, callback) {
    content.request_reference_no = Utility.getRefNum();
    content.subscriber = content.subscriber ? content.subscriber : {};
    content.subscriber.profile = content.subscriber.profile ? content.subscriber.profile : {};
    var data = {
      "DeviceSearchData": {
        "MtxDeviceSearchData": {
          "ObjectId": content.subscriber.mtx_device_id
        }
      },
      "Attr": { "HermosaDeviceExtension": {} },
    };
    // if (content.subscriber.role !== undefined) {
    //   data.Attr.HermosaDeviceExtension.Role = content.subscriber.role;
    // }
    // if (content.subscriber.activated !== undefined) {
    //   data.Attr.HermosaDeviceExtension.RegistrationSuccess = (content.subscriber.activated == true) ? 'Yes' : 'No';
    //   // rules.rating_group.list.forEach(function(app_meter) {
    //   //   data.Attr.HermosaDeviceExtension[rules.rating_group[app_meter].name] = {};
    //   //   data.Attr.HermosaDeviceExtension[rules.rating_group[app_meter].name].value = rules.rating_group[app_meter].rg_list;
    //   // });
    // }
    // if (content.subscriber.load_protected !== undefined) {
    //   data.Attr.HermosaDeviceExtension.LoadProtect = (content.subscriber.load_protected == true) ? 'Yes' : 'No';
    // }
    if (content.subscriber.device_status !== undefined) {
      data.Status = content.subscriber.device_status;
    }
    data = jsonParser("MtxRequestDeviceModify", Utility.filterObject(data));
    var options = sails.config.matrixx.options;
    options.method = 'PUT';
    options.path = sails.config.matrixx.base_path +'/device/' + content.subscriber.mtx_device_id;

    XMLClient.request(options, data, content.request_reference_no, function(err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, result);
      }
    });  
  },

  changeIMSI: function(content, callback) {
    content.request_reference_no = Utility.getRefNum();
    var data = {
      "RequestList": {
        "MtxRequestSubscriberRemoveDevice": {
          "SubscriberSearchData": {
            "MtxSubscriberSearchData": {
              "ExternalId": content.external_id
            }
          },
          "DeviceSearchData": {
            "MtxDeviceSearchData": {
              "AccessNumber": content.external_id
            }
          }
        },
        "MtxRequestDeviceModify": {
          "DeviceSearchData": {
            "MtxDeviceSearchData": {
              "ObjectId": '0-2-5-215'
            }
          },
          "Status" : 2
        },
        "MtxRequestDeviceDelete": {
          "DeviceSearchData": {
            "MtxDeviceSearchData": {
              "ObjectId": '0-2-5-215'
            }
          }
        },
        "MtxRequestDeviceCreate": {
          "Status": content.device_status,
          "DeviceType": content.device_type,
          "Attr": {
            "HermosaDeviceExtension": {
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
              "ExternalId": content.external_id
            }
          },
          "DeviceSearchData": {
            "MtxDeviceSearchData": {
              "AccessNumber": content.external_id
            }
          }
        }
      }
    };
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

  delete: function(content, callback) {
    content.request_reference_no = Utility.getRefNum();
    var data = {
      "RequestList": {
        "MtxRequestSubscriberRemoveDevice": {
          "SubscriberSearchData": {
            "MtxSubscriberSearchData": {
              "ExternalId": content.external_id
            }
          },
          "DeviceSearchData": {
            "MtxDeviceSearchData": {
              "AccessNumber": content.external_id
            }
          }
        },
        "MtxRequestDeviceCreate": {
          "Status": content.device_status,
          "DeviceType": content.device_type,
          "Attr": {
            "HermosaDeviceExtension": {
              "Imsi": content.new_imsi,
              "AccessNumberArray": {
                "value": content.external_id
              }
            }
          }
        },
        "MtxRequestSubscriberAddDevice": {
          "SubscriberSearchData": {
            "MtxSubscriberSearchData": {
              "ExternalId": content.external_id
            }
          },
          "DeviceSearchData": {
            "MtxDeviceSearchData": {
              "AccessNumber": content.external_id
            }
          }
        }
      }
    };
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
}

