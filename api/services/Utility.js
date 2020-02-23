var TAG = "[Utility]";
var uuid = require('node-uuid');
var tc = require('timezonecomplete');
var libphonenumber = require('libphonenumber');
var req = require('rekuire');
var constants = req('constants');
var entities = require('entities');
var cryptoJS = require('crypto-js');
var moment = require('moment-timezone');
var getPHTime = moment().tz("Asia/Manila").format();


module.exports = {

  digestPassword: function(request_id) {
    var hash_request_id = cryptoJS.MD5(request_id).toString();
    var hash_password = cryptoJS.MD5(sails.config.epin.username + sails.config.epin.password).toString();
    var password_digest = cryptoJS.MD5(hash_request_id + hash_password).toString();
    return password_digest;
  },

  getRefNum: function() {
    return uuid.v4();
  },

  filterObject: function(object) {
    for (property in object) {
      if (object[property] === undefined || object[property] === null || ( (typeof object[property]) == 'object'
        && Object.keys(object[property]).length === 0) || ( (typeof object[property]) == 'string'
        && object[property].trim() == '') ) {
        delete object[property];
      }
    }
    return object;
  },

  formatToE164: function(string) {
    try {
      return libphonenumber.e164(string);
    } catch(e) {
      return null;
    }
  },

  formatMsisdn: function(string) {
    var msisdn = this.formatToE164(string) || this.formatToE164('+' + string) || this.formatToE164('+63' + string) || this.formatToE164('+63' + string.slice(1));
    return (msisdn != null ? msisdn.slice(1) : msisdn);
  },

  // Accepts an obj and type of conversion
  convert: function(obj, type) {
    var conversion;
    switch (type) {
      case 'currency':
        conversion = Utility.currencyConversion(obj);
        break;
      case 'expiration':
        conversion = Utility.expirationConversion(obj);
        break;
      case 'remaining':
        conversion = Utility.remainingConversion(obj);
        break;
      case 'data':
        conversion = Utility.dataConversion(obj);
        break;
      case 'text':
        conversion = Utility.textConversion(obj);
        break;
      case 'time':
        conversion = Utility.timeConversion(obj);
    }
    return conversion;
  },

  remainingConversion: function(obj) {
    var expiry = new tc.DateTime(obj);
    var now = tc.now();
    var expiration = expiry.diff(now);
    var conversion;
    switch (true) {
      case (expiration < 0):
        conversion = 'Expired';
        break;
      case (expiration.days() >= 1.5):
        days = Math.round(expiration.days());
        conversion = days + ' days'
        break;
      case (expiration.days() > 1):
        days = Math.round(expiration.days());
        conversion = days + ' day'
        break;
      case (expiration.hours() < 1.5):
        hrs = Math.round(expiration.hours());
        conversion = hrs + ' hour';
        break;
      case (expiration.hours() < 24):
        hrs = Math.round(expiration.hours());
        conversion = hrs + ' hours';
        break;
    }
    return conversion;
  },

  expirationConversion: function(obj) {
    var expiry = new tc.DateTime(obj);
    var now = tc.now();
    var expiration = expiry.diff(now);
    var conversion;
    switch (true) {
      case (expiration < 0):
        conversion = 'Expired';
        break;
      case (expiration.days() >= 1.5):
        days = Math.round(expiration.days());
        conversion = days + ' days'
        break;
      case (expiration.days() > 1):
        days = Math.round(expiration.days());
        conversion = days + ' day'
        break;
      case (expiration.hours() < 1.5):
        hrs = Math.round(expiration.hours());
        conversion = hrs + ' hour';
        break;
      case (expiration.hours() < 24):
        hrs = Math.round(expiration.hours());
        conversion = hrs + ' hours';
        break;
    }
    return conversion;
  },

  dataConversion: function(obj) {
    var divisor, unit, conversion;
    switch (true) {
      case (obj.value >= 1048576) && (obj.unit == 'kilobytes'):
        divisor = 1048576;
        unit = "GB";
        break;
      case (obj.value >= 1024)  && (obj.unit == 'kilobytes'):
        divisor = 1024;
        unit = "MB";
        break;
      case (obj.value >= 1024) && (obj.unit == 'megabytes' || obj.unit == 'MB'):
        divisor = 1024;
        unit = "GB";
        break;
      case (obj.value >= 1)  && (obj.unit == 'megabytes' || obj.unit == 'MB'):
        divisor = 1;
        unit = "MB";
        break;
      case (obj.value < 1)  && (obj.unit == 'megabytes' || obj.unit == 'MB'):
        divisor = 1/1024;
        unit = "KB";
        break;
      case (obj.value >= 0):
        divisor = 1;
        unit = "KB";
    }
    conversion = obj.value / divisor;
    conversion = Math.round(conversion * 100)/100;
    conversion = conversion + unit;
    return (obj.value == "infinity" ? obj.value : conversion);
  },

  timeConversion: function(obj) {
    var divisor, unit, conversion;
    switch (true) {
      case (obj.value > 1440) && (obj.unit == 'minutes'):
        divisor = 1440;
        unit = " days";
        break;
      case (obj.value > 60)  && (obj.unit == 'minutes'):
        divisor = 60;
        unit = " hours";
        break;
      case (obj.value > 1):
        divisor = 1;
        unit = " minutes";
      case (obj.value < 1):
        divisor = 1;
        unit = " minute";
    }
    conversion = obj.value / divisor;
    conversion = Math.round(conversion * 100)/100;
    conversion = conversion + unit;
    return (obj.value == "infinity" ? obj.value : conversion);
  },

  textConversion: function(obj) {
    var divisor, unit, conversion;
    switch (true) {
      case (obj.value > 0):
        unit = " texts";
        break;
      case (obj.value < 1):
        unit = " text";
    }
    conversion = obj.value;
    conversion = conversion + unit;
    return (obj.value == "infinity" ? obj.value : conversion);
  },
  // TODO: add currency conversion
  currencyConversion: function(obj) {
    var divisor, unit, conversion;
    switch (true) {
      case (obj.unit == 'PHP'):
        divisor = 1;
        unit = "Php";
    }
    conversion = obj.value / divisor;
    conversion = conversion.toFixed(2);
    conversion = unit + ' ' + conversion;
    return (obj.value == "infinity" ? obj.value : conversion);
  },

  hasKeys: function(obj) {
    if (obj && typeof obj === 'object') {
      return Object.keys(obj).length > 0;
    }
    return false;
  },

  trimObject: function(obj) {
    var result = null;
    if(obj instanceof Array) {
      for(var i = 0; i < obj.length; i++) {
        result = this.trimObject(obj[i]);
      }
    } else {
      for(var prop in obj) {
        if (obj[prop] instanceof Object || obj[prop] instanceof Array) {
          result = this.trimObject(obj[prop]);
        } else {
          obj[prop] = !isNaN(obj[prop]) ? obj[prop] : obj[prop].trim();
        }
      }
    }
    return result;
  },

  getObject: function (array, key, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        var obj = {
          obj: array[i],
          index: i
        };
        return obj
      }
    }
    return ({
      obj: {},
      index: -1
    });
  },

  getDefaultValues: function(obj, type) {
    obj.page = obj.page ? obj.page : 1;
    obj.limit = obj.limit ? obj.limit : 10;
    switch (type) {
      case 'message':
        obj.sort = obj.sort ? obj.sort : 'created_at';
        obj.order = (obj.order && obj.order.toUpperCase() == 'ASC') ? 1 : -1;
        break;
      case 'catalog':
        obj.sort = obj.sort ? obj.sort : 'charge_amount';
        obj.order = (obj.order && obj.order.toUpperCase() == 'DESC') ? -1 : 1;
        break;
      case 'transaction':
        obj.sort = obj.sort ? obj.sort : 'created_at';
        obj.order = (obj.order && obj.order.toUpperCase() == 'ASC') ? 1 : -1;
        break;
      case 'account':
        obj.sort = obj.sort ? obj.sort : 'created_at';
        obj.order = (obj.order && obj.order.toUpperCase() == 'ASC') ? 1 : -1;
        break;
      case 'perk':
        obj.sort = obj.sort ? obj.sort : 'created_at';
        obj.order = (obj.order && obj.order.toUpperCase() == 'ASC') ? 1 : -1;
        break;
    }
    obj.sort = obj.sort ? obj.sort : 'created_at';
    obj.order = obj.order ? obj.order : 1;
    return obj;
  },

  formQueryStr: function(param, type) {
    var query = {where: {}, sort: {}};
    
    query.sort[param.sort] = param.order;
    
    if (param.app_name) {
      query.where.app_name = param.app_name;
    }
    if (param.cilantro_id) {
      query.where.cilantro_id = param.cilantro_id;
    }
    if (type == 'message' || type == 'perk') {
      query.where.cilantro_id = param.cilantro_id;
    }
    if (param.category) {
      query.where.category = param.category;
    }
    if (param.account_id) {
      query.where.account_id = param.account_id;
    }
    if (param.activated) {
      query.where.activated = param.activated;
    }
    if (param.title) {
      query.where.game_name = param.title;
    }
    if (param.deleted) {
      //query.where.deleted = param.deleted;
      query.where.or = [];
      query.where.or.push({ deleted: param.deleted });
      if (param.deleted != 'true')
      query.where.or.push({ deleted: null });
    }

    if (param.search) {
      if (type == 'transaction') {
        query.where.or = query.where.or ? query.where.or : [];
        query.where.or.push({ id: { contains: param.search } });
        query.where.or.push({ item: { contains: param.search } });
      }
    }
    return query;
  },

  format: function (balance_list, balance_type) {
    var ACTION = "[format]";
    var obj = {};
    var _balance_type = balance_type;
    var balance_types = (balance_type == "group" || balance_type == "shared") ? constants.group_types : constants.balance_types;
    if (balance_type == "group" || balance_type == "shared") {
      balance_list = _.where(balance_list, { Name: "Shared" }); 
    } else {
      balance_list1 = _.where(balance_list, { Name: "Peso: Pre-Paid"});
      balance_list2 = _.where(balance_list, { Name: "Personal"});
      balance_list = balance_list1.concat(balance_list2);
    };
    balance_types.forEach(function(type) {
      var balance = Utility.getObject(balance_list, "ClassName", constants[type].class_name);
      balance.obj.QuantityUnit = (balance.obj.QuantityUnit != "none") ? balance.obj.QuantityUnit : constants[type].default_unit;
      if (balance_type == "shared") {
        balance.obj.Amount = balance.obj.AvailableAmount;
      };
      obj[constants[type].variable] = {
        date: balance.index >= 0 ? balance.obj.EndTime : null,
        unit: balance.index >= 0 ? balance.obj.QuantityUnit : constants[type].default_unit,
        value: balance.index >= 0 ? parseFloat(Math.abs(balance.obj.Amount)) : constants[type].default_value
      };
      obj[constants[type].variable].display = Utility.convert(obj[constants[type].variable], constants[type].type);
      if (_balance_type == 'personal' || _balance_type == 'shared') {
        obj[constants[type].variable].expiration = Utility.convert(balance.obj.EndTime, 'remaining');
      };
    });
    return obj;
  },

  formatDate: function(date) {
    var date = new Date(date);
    var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oc", "Nov", "Dec" ];
    var year = date.getFullYear() + '';
    var monthIndex = date.getMonth();
    var day = date.getDate(); 
    var zone = date.getTimezoneOffset() / 60
    var hour = date.getHours() + 8;
    var minute = date.getMinutes() + '';
    if (hour > 23){  hour = hour - 24; day++; }
    hour = hour + ''; 
    day = day + '';
    day = day.length == 2 ? day : '0' + day;
    hour = hour.length == 2 ? hour : '0' + hour;
    minute = minute.length == 2 ? minute : '0' + minute;
    date = day + ' ' + monthNames[monthIndex] + ' ' + year + ' ' + hour + ':' + minute;
    return date;
  },

  generateCode: function() {
    var chars = '0123456789';
    var result = '';
    for (var i = 5; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  },

  addMonths: function(date, value) {
    var d = new Date(date),
      now = d.getDate();
    var year = d.getFullYear();
    d.setDate(1);
    d.setMonth(date.getMonth() + value);
    //get Days in Month

    var leapyear = (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));

    var daysInMonth = [31, (leapyear ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    d.setDate(Math.min(now, daysInMonth[d.getMonth()]));
    return d;
  },

  decodeFeedsSpecialChars: function(text){
    var openparen = "&&#35;40;";
    var closeparen = "&&#35;41;";
    var apos = "&apos;";
    
    openparen = openparen.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    closeparen = closeparen.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    apos = apos.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    
    var text = entities.decodeHTML(text);
    text = text.replace(new RegExp(openparen, 'g'),"(");
    text = text.replace(new RegExp(closeparen, 'g'),")");
    text = text.replace(new RegExp(apos, 'g'),"'");

    return text;
  },

  getWeekDay: function() {
    var d = new Date();
    var weekday = new Array(7);
    weekday[0]=  "SUNDAY";
    weekday[1] = "MONDAY";
    weekday[2] = "TUESDAY";
    weekday[3] = "WEDNESDAY";
    weekday[4] = "THURSDAY";
    weekday[5] = "FRIDAY";
    weekday[6] = "SATURDAY";

    return weekday[d.getDay()];
  },

  unique: function(obj){
    var uniques=[];
    var stringify={};
    for(var i=0;i<obj.length;i++){
       var keys=Object.keys(obj[i]);
       keys.sort(function(a,b) {return a-b});
       var str='';
        for(var j=0;j<keys.length;j++){
           str+= JSON.stringify(keys[j]);
           str+= JSON.stringify(obj[i][keys[j]]);
        }
        if(!stringify.hasOwnProperty(str)){
            uniques.push(obj[i]);
            stringify[str]=true;
        }
    }
    return uniques;
  },

  daysBetween: function(date1, date2) {
    //Get 1 day in milliseconds
    var one_day=1000*60*60*24;

    var dt1 = new Date(date1);
    var dt2 = new Date(date2);

    // Convert both dates to milliseconds
    var date1_ms = dt1.getTime();
    var date2_ms = dt2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = date1_ms - date2_ms;
      
    // Convert back to days and return
    return Math.round(difference_ms/one_day);
  },

  checkCarrier: function(msisdn, carrier, callback) {
    var ACTION = "[checkCarrier]";
    var result = false;
    var number = msisdn;
    msisdn = msisdn.substring(2, 5);
    Prefix.findOne({ where: {prefix: msisdn, carrier: carrier}}, function(err, data) {
      if (err) Logger.log('error', TAG + ACTION, err);
      if (data != undefined) result = true;
      Logger.log('debug', TAG + ACTION, {msisdn: number, carrier: carrier, result: result});
      callback(null, result);
    });
  },

  genBCodeRefNo: function() {
    var date = new Date(getPHTime);
    var toSecs = date.getTime();
    var length = 7;
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return toSecs + result;
  },

  reverseString: function(s) {
    return s.split('').reverse().join('');
  },

  stringToBase64: function(s) {
    var b = new Buffer(s);
    var str64 = b.toString('base64');
    return str64;
  },
}
