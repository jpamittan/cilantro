var TAG = '[_PerksController]';
var req = require('rekuire');
var uuid = require('node-uuid');
var SMSService = req('SMSService');
var _NotificationController = req('_NotificationControllerOdyssey');
var moment = require('moment-timezone');
var getPHTime = moment().tz("Asia/Manila").format();

function _PerksController(req, query_str) {
  this.req = req;
  this.query_str = query_str;
};

_PerksController.prototype.generate = function (cb, result) {
  var ACTION = '[generate]';
  var code = Utility.generateCode();
  return cb(null, code);
};

_PerksController.prototype.add = function (cb, result) {
  var _this = this.req;

  Perks.findOne({id: this.req.body.id}, function(err, data) {
    if (err) {
      return cb(null, false);
    } else {
      if (data == undefined) {
        //Add perk in the table if not exists
        Perks.create(_this.body, function(err, data) {
          if (err) { return cb(null, err); }
          return cb(null, data);
        });
      } else {
        if (data.modifiedDate != _this.body.modifiedDate) {
          //Update perk in the table if exists
          Perks.update({id: _this.body.id}, _this.body, function(err, data) {
            if (err) { return cb(null, err); }
            return cb(null, data);
          });
        } else {
          return cb(null, data);
        }
      }//else
    }//else
  });
};

_PerksController.prototype.addBulk = function (cb, result) {
  var ACTION = '[addBulk]';
  var _this = this.req;
  var ref_num = Utility.getRefNum();
  var options = {
    url: sails.config.hopscotch.url,
    method: 'GET',
    json: true
  };
  var perksArr = new Array();
  var requestclient = new RequestClient();
  requestclient.request.bind(requestclient);
  requestclient.request('PERKS', options, ref_num, function(err, result) {
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return cb(Errors.raise('HOPSCOTCH_ERROR'));
    } else {
      var hopscotchData = result.data;
      ctrLength = hopscotchData.length
      for(var i = 0; i < hopscotchData.length; i++) {
        if(hopscotchData[i].category == "Feature"){
          var hopscotch_desc = hopscotchData[i].description;
          var descriptionArr = hopscotch_desc.split('|');

          // ctr|"description"|"message_one"|"message_two"|threshold_per_day|showday|showtime|"SUCCESSFUL_MESSAGE"|"ITEM_CODE"|CODE_NO

          var id = hopscotchData[i].id;
          var title = hopscotchData[i].title;
          var perk_description = descriptionArr[1];
          var perk_ctr = 0;
          var perk_validity = null;
          var perk_threshold = null;
          var perk_threshold_ctr = null;
          var perk_showday = null;
          var perk_showtime = null;
          var perk_message_one = null;
          var perk_message_two = null;
          var perk_modifiedDate = hopscotchData[i].modifiedDate;
          var perk_detailed_image = null;
          var perk_detailed_image_2 = null;
          var perk_success_msg = null;
          var perk_item_code = null;
          var perk_perk_type = null;

          if(descriptionArr[0].toUpperCase().trim() == "FREE FOR ALL" || 
             descriptionArr[0].toUpperCase().trim() == "ALL SMART SUBSCRIBERS" || 
             descriptionArr[0].toUpperCase().trim() == "UNLIMITED") {
              // Set perk counter to max integer
              perk_ctr = 2147483645;
          } else {
            var ctrArr = descriptionArr[0].split(' ');
            perk_ctr = ctrArr[0];
          }
          if(hopscotchData[i].endDate != null) {
            var endDate = hopscotchData[i].endDate;
            var endDateArr = endDate.split('T');
            perk_validity = endDateArr[0];
          } else {
            var startDate = hopscotchData[i].startDate;
            var startDateArr = startDate.split('T');
            perk_validity = startDateArr[0];
          }
          if(descriptionArr.length > 2) {
            if(descriptionArr[2].toUpperCase().trim() != "NULL" && descriptionArr[2] != "")
              perk_message_one = descriptionArr[2];
          }
          if(descriptionArr.length > 3) {
            if(descriptionArr[3].toUpperCase().trim() != "NULL" && descriptionArr[3] != "")
              perk_message_two = descriptionArr[3];
          }
          if(descriptionArr.length > 4) {
            if(descriptionArr[4].toUpperCase().trim() != "NULL" && descriptionArr[4] != "") {
              perk_threshold = descriptionArr[4];
              perk_threshold_ctr = descriptionArr[4];
            }
          }
          if(descriptionArr.length > 5) {
            if(descriptionArr[5].toUpperCase().trim() != "NULL" && descriptionArr[5] != "")
              perk_showday = descriptionArr[5];
          }
          if(descriptionArr.length > 6) {
            if(descriptionArr[6].toUpperCase().trim() != "NULL" && descriptionArr[6] != "")
              perk_showtime = descriptionArr[6];
          }
          if(hopscotchData[i].detailedImage != null) perk_detailed_image = JSON.stringify(hopscotchData[i].detailedImage);
          if(hopscotchData[i].detailedImage2 != null) perk_detailed_image_2 = JSON.stringify(hopscotchData[i].detailedImage2);
          if(descriptionArr.length > 7) {
            if(descriptionArr[7].toUpperCase().trim() != "NULL" && descriptionArr[7] != "")
              perk_success_msg = descriptionArr[7];
          }
          if(descriptionArr.length > 8) {
            if(descriptionArr[8].toUpperCase().trim() != "NULL" && descriptionArr[8] != "")
              perk_item_code = descriptionArr[8];
          }
          if(descriptionArr.length > 9) {
            if(descriptionArr[9].toUpperCase().trim() == "0")
              perk_perk_type = 0;
            else
              perk_perk_type = 1;
          }

          var perk = {
            id: id,
            title: title,
            description: perk_description,
            ctr: perk_ctr,
            validity: perk_validity,
            threshold: perk_threshold,
            threshold_ctr: perk_threshold_ctr,
            showday: perk_showday,
            showtime: perk_showtime,
            message_one: perk_message_one,
            message_two: perk_message_two,
            detailed_image: perk_detailed_image,
            detailed_image_2: perk_detailed_image_2,
            success_msg: perk_success_msg,
            item_code: perk_item_code,
            perk_type: perk_perk_type
          }

          console.log("***********************************************");
          console.log("ID: " + id);
          console.log("title: " + title);
          console.log("description: " + perk_description);
          console.log("ctr: " + perk_ctr);
          console.log("validity: " + perk_validity);
          console.log("threshold: " + perk_threshold);
          console.log("threshold_ctr: " + perk_threshold_ctr);
          console.log("showday: " + perk_showday);
          console.log("showtime: " + perk_showtime);
          console.log("message_one: " + perk_message_one);
          console.log("message_two: " + perk_message_two);
          console.log("detailed_image: " + perk_detailed_image);
          console.log("detailed_image_2: " + perk_detailed_image_2);
          console.log("success_msg: " + perk_success_msg);
          console.log("item_code: " + perk_item_code);
          console.log("perk_type: " + perk_perk_type);
          console.log("***********************************************");

          perksArr.push(perk);
        }//if
      }//for

      Perks.create(perksArr, function(err, data) {
         return cb(null, data);
      });
    }//else
  });
};

_PerksController.prototype.perksCheck = function (cb, result) {
  var ACTION = '[perksCheck]';
  var _this = this.req;
  var _notificationController = new _NotificationController(_this, "perks");
  //Validate if the subs already availed the perk
  PerksSubs.findOne({auth_id: _this.account.cilantro_id, perks_id: _this.body.perks_id}, function(err, data) {
    if (err) return cb(null, err);
    if (data != undefined) {
      var notification = {};
      notification.title = "Smart Perks";
      notification.msg = "Sorry you have already availed '" + data.title + "'.";
      _notificationController.createNotification(function(){}, {notification: notification});
      var device = {
        device_os: _this.account.profile.device_os, 
        device_arn: _this.account.profile.device_arn
      };
      Notifier.notify(device, notification.msg);
      return cb(Errors.raise('PERKS_AVAILED_ERROR'));
    } else {
      Perks.findOne({id: _this.body.perks_id}, function(err, data) {
        if (err) { return cb(null, err); }
        if (data == undefined) { return cb(Errors.raise('PERKS_INVALID_ERROR')); }
        if ((new Date(data.validity) < new Date(getPHTime)) || (data.ctr == 0) || (data.threshold_ctr == 0)) { return cb(Errors.raise('PERKS_UNAVAILABLE_ERROR')); }
        return cb(null, true);
      });
    }
  });
};

_PerksController.prototype.bcode = function (cb, result) {
  var ACTION = '[bcode]';
  var _this = this.req;
  var ref_num = Utility.getRefNum();
  if(result.perksCheck) {
    Perks.findOne({id: _this.body.perks_id}, function(err, data) {
      // Return callback if mobile already passed a bcode
      if(_this.body.code != "" && (_this.body.code != null || typeof _this.body.code !== 'undefined')) {
        console.log("BCode from mobile: " + _this.body.code);
        return cb(null, _this.body.code);
      }
      // 1 value stand for perk has a counterpart of bcode
      if(data.perk_type == 1 && (_this.body.code == null || typeof _this.body.code === 'undefined')) {
        //Register subsriber for a perk limited or bcode type
        var bcode_ref = Utility.genBCodeRefNo();
        var bcode_url = sails.config.ecom.url + bcode_ref + "&pc=" + data.item_code;
        var options = {
          url: bcode_url,
          method: 'GET'
        };
        var requestclient = new RequestClient();
        requestclient.request.bind(requestclient);
        if(sails.config.environment == "production" || process.env.NODE_ENV == "production") {
          requestclient.request('BCODE', options, ref_num, function(err, bcode_result) {
            if (err) {
              Logger.log('error', TAG + ACTION, err);
              return cb(Errors.raise('BCODE_SERVER_ERROR'));
            } else {
              if(bcode_result == null || bcode_result == "") return cb(Errors.raise('BCODE_SERVER_ERROR'));
              var bcodeJSON = JSON.parse(bcode_result);
              var BCodeData = bcodeJSON.db;
              if(BCodeData[0].hasOwnProperty('eb')) return cb(Errors.raise('BCODE_SERVER_ERROR'));
              var BCode = BCodeData[0].bcode;
              if(BCode == null || BCode == "") return cb(Errors.raise('BCODE_SERVER_ERROR'));
              return cb(null, BCode);
            }//else
          });
        } else {
          return cb(null, "=TESTS=BCODE==ONLYS=7QJC5==QM7OA=WBPEH=");
        }//else if not prod send sample test bcode
      } else if (data.perk_type == 2 && (_this.body.code == null || typeof _this.body.code === 'undefined')) {
        //Register subsriber for a perk limited or voucher type
        // itmcp|AUTO|tu200|09221234567|100
        // 001|76543212290|002ut|OTUA|pcmsti
        // Convert the string to Base64 
        // MDAxfDc2NTQzMjEyMjkwfDAwMnV0fE9UVUF8cGNtc3Rp
        // http://10.157.51.38/mcp/voucher.pl?command=MDAxfDc2NTQzMjEyMjkwfDAwMnV0fE9UVUF8cGNtc3Rp

        // mcp00160001|RETURN|mcp|09229221234|test
        var userID = data.item_code;
        var accessType = "RETURN";
        var keyword = "mcp";
        var msisdn = _this.body.msisdn;

        if(msisdn.substring(0, 2) == "63")
          msisdn = '0' + msisdn.substring(2, 12);

        var remarks = "test";
        var command = userID + '|' + accessType + '|' + keyword + '|' + msisdn + '|' + remarks;
        console.log("First pass: " + command);
        command = Utility.reverseString(command);
        console.log("Second pass: " + command);
        command = Utility.stringToBase64(command);
        console.log("Third pass: " + command);
        if(sails.config.environment == "production" || process.env.NODE_ENV == "production") {
          var mcp_url = sails.config.mcp.url + "/mcp/" + "voucher.pl?command=" + command;
        } else {
          var mcp_url = sails.config.mcp.url + "/mcp_staging/" + "voucher.pl?command=" + command;
        }
        var options = {
          url: mcp_url,
          method: 'POST'
        };
        var requestclient = new RequestClient();
        requestclient.request.bind(requestclient);
        requestclient.request('MCP', options, ref_num, function(err, vcode_result) {
          if (err) {
            Logger.log('error', TAG + ACTION, err);
            return cb(Errors.raise('MCP_SERVER_ERROR'));
          } else {
            // 1000|SUCCESSFUL|09231234567|id#,xjefpI,p3
            // 1002|FAILED|09231234567|Your <userid> is not allowed to use this service.
            var VCode = String(vcode_result);
            if(VCode.indexOf('FAILED') > -1) return cb(Errors.raise('MCP_SERVER_ERROR'));
            var VoucherCodeArr = VCode.split('|');
            var VCArr = VoucherCodeArr[3].split(',');
            return cb(null, VCArr[1]);
          }//else
        });
      } else {
        return cb(null, null);
      }
    });
  } else {
    return cb(null, false);
  }
};

_PerksController.prototype.register = function (cb, result) {
  var ACTION = '[register]';
  var _this = this.req;
  var _notificationController = new _NotificationController(_this, "perks");
  var perkData = null;
  if(result.bcode == false) return cb(null, false);
  Perks.findOne({id: _this.body.perks_id}, function(err, data) {
    if (err) { return cb(null, err); }
    perkData = data;
    perkData.id = uuid.v4();
    perkData.status = "success";
    perkData.auth_id = _this.account.cilantro_id;
    perkData.msisdn = _this.body.msisdn;
    perkData.code = result.bcode;
    perkData.perks_id = _this.body.perks_id;
    if(perkData.message_one == null) perkData.message_one = "";
    if(perkData.message_two == null) perkData.message_two = "";
    PerksSubs.create(perkData, function(err, data) {
      if (err) { return cb(null, err); }
      var notification = {};
      notification.title = "Smart Perks";
      notification.msg = "Enjoy your " + data.title + " Exclusive Perk!";
      _notificationController.createNotification(function(){}, {notification: notification});
      var device = {
        device_os: _this.account.profile.device_os,
        device_arn: _this.account.profile.device_arn
      };
      Notifier.notify(device, notification.msg);
      data.success_msg = perkData.success_msg;
      return cb(null, data);
    });
  });
};

_PerksController.prototype.updatePerk = function (cb, result) {
  var ACTION = '[updatePerk]';
  var _this = this.req;
  if(result.registered == false) return cb(null, false);
  Perks.findOne({id: _this.body.perks_id}, function(err, data) {
    if (err) { return cb(null, err); }
    perkData = data;
    var perkctr = data.ctr - 1;
    var thresholdCtr = data.threshold_ctr - 1;
    //Update counter and threshold_ctr of a perk
    Perks.update({id: _this.body.perks_id}, {ctr: perkctr, threshold_ctr: thresholdCtr}, function(err, data) {
      if (err) { return cb(null, err); }
      return cb(null, data);
    });
  });
};

_PerksController.prototype.claim = function (cb, result) {
  var ACTION = '[claim]';
  var _this = this.req;
  PerksSubs.findOne({id: this.req.body.id}, function(err, data) {
    if (err) {
      return cb(null, err);
    } else {
      if (data == undefined) return cb(Errors.raise('PERKS_NOSUBS'));
      if (data.claimed == true) return cb(Errors.raise('PERKS_CLAIMED'));
      PerksSubs.update({id: _this.body.id}, {claimed: true, claimed_date: new Date(getPHTime)}, function(err, data) {
        if (err) {
          Logger.log('error', TAG + ACTION, err);
          return cb(Errors.raise('DB_ERROR'));
        }
        return cb(null, data);
      });
    }//else
  });
};

_PerksController.prototype.list = function (cb, result) {
  var ACTION = '[list]';
  var _this = this.req;
  PerksSubs.find({where:{auth_id: _this.account.cilantro_id, status: "success"}, sort:'updated_at DESC'}, function(err, data) {
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return cb(Errors.raise('DB_ERROR'));
    }
    return cb(null, data);
  });
};

_PerksController.prototype.listAll = function (cb, result) {
  var ACTION = '[listAll]';
  var _this = this.req;
  Perks.find({}, function(err, data) {
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return cb(Errors.raise('DB_ERROR'));
    }
    return cb(null, data);
  });
};

_PerksController.prototype.listAllExpired = function (cb, result) {
  var ACTION = '[listAllExpired]';
  var _this = this.req;
  var strDate = new Date(getPHTime);
  var weekday = Utility.getWeekDay();
  var expiredArr = null;
  var dd = strDate.getDate();
  var mm = strDate.getMonth() + 1;
  var yyyy = strDate.getFullYear();
  if(dd < 10) dd = '0' + dd;
  if(mm < 10) mm = '0' + mm;
  var today = mm+'/'+dd+'/'+yyyy;
  var currentDatetime = today + ' ' + strDate.getHours() + ":" + strDate.getMinutes();
  var bln = false;
  Perks.find({select: ['id'], where: {or: [{validity: {'<=': strDate }}, {ctr: 0}, {showday: {'!': weekday}}]}}, function(err, data) {
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return cb(Errors.raise('DB_ERROR'));
    }
    expiredArr = data;
    Perks.find({select: ['id','showtime','threshold_ctr'], where: {showtime: {'!': ""}, showtime: {'!': null}}}, function(err, data) {
      if (err) {
        Logger.log('error', TAG + ACTION, err);
        return cb(Errors.raise('DB_ERROR'));
      }
      for(var i = 0; i < data.length; i++) {
        var perkShowtime = today + ' ' + data[i].showtime;
        if(Date.parse(currentDatetime) < Date.parse(perkShowtime))
          expiredArr.push({"id":data[i].id});
      }
      expiredArr = Utility.unique(expiredArr);
      return cb(null, expiredArr);
    });
  });
};

_PerksController.prototype.listAllEmptyThreshold = function (cb, result) {
  var ACTION = '[listAllEmptyThreshold]';
  var _this = this.req;
  var strDate = new Date(getPHTime);
  var weekday = Utility.getWeekDay();
  var emptyThresholdArr = new Array();
  Perks.find({select: ['id','showday','threshold','threshold_ctr'], where: {ctr: {'!': 0}, validity: {'>=': strDate }}}, function(err, data) {
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return cb(Errors.raise('DB_ERROR'));
    }
    for(var i = 0; i < data.length; i++) {
      if(weekday != data[i].showday) {
        Perks.update({id: data[i].id}, {threshold_ctr: data[i].threshold}, function(err, data) {
          if (err) {
            Logger.log('error', TAG + ACTION, err);
            return cb(Errors.raise('DB_ERROR'));
          }
        });
      }
      if(weekday == data[i].showday) {
        if(data[i].threshold_ctr == 0)
          emptyThresholdArr.push({"id":data[i].id});
      }
    }
    return cb(null, emptyThresholdArr);
  });
};

module.exports = _PerksController;