var TAG = '[_BalanceController]';
var req = require('rekuire');
var matrixx = req('Matrixx');
var rules = req('rules');
var constants = req('constants');
var offers = req('offers');


function _BalanceController(req, options) {
  this.req = req;
  this.options = options;
};

// _BalanceController.prototype.format = function (balance_list, balance_classname) {
//   var ACTION = "[format]";
//   var obj = {};
//   var _balance_type = balance_classname;
//   var balance_types = (_balance_type == "group" || _balance_type == "shared") ? constants.group_types : constants.class_name;
//   if (_balance_type == "group" || _balance_type == "shared") {
//     balance_list = _.where(balance_list, { Name: "Shared" }); 
//   } else {
//     balance_list = _.where(balance_list, { ClassName: "Peso"});
//     // balance_list2 = _.where(balance_list, { Name: "Personal"});
//     // balance_list = balance_list1.concat(balance_list2);
//   };
//   balance_types.forEach(function(type) {
//     var balance = Utility.getObject(balance_list, "ClassName", constants[type].class_name);
//     balance.obj.QuantityUnit = (balance.obj.QuantityUnit != "none") ? balance.obj.QuantityUnit : constants[type].default_unit;
//     // if (balance_type == "shared") {
//     //   balance.obj.Amount = balance.obj.AvailableAmount;
//     // };
//     obj[constants[type].variable] = {
//       availment_date: balance.index >= 0 ? balance.obj.StartTime : null,
//       expiration_date: balance.index >= 0 ? balance.obj.EndTime : null,
//       unit: balance.index >= 0 ? balance.obj.QuantityUnit : constants[type].default_unit,
//       value: balance.index >= 0 ? parseFloat(Math.abs(balance.obj.Amount)) : constants[type].default_value
//     };
//     obj[constants[type].variable].display = Utility.convert(obj[constants[type].variable], constants[type].type);
//     if (_balance_type == 'Peso' || _balance_type == 'shared') {
//       obj[constants[type].variable].expiration = Utility.convert(balance.obj.EndTime, 'remaining');
//     };
//   });
//   return obj;
// };

_BalanceController.prototype.format = function (balance_list, balance_name) {
  var ACTION = "[format]";
  var balance = [];
  balance_names = constants[balance_name];
  // balance_names.forEach(function(offer_name) {
  balance_list.forEach(function(data) {
    var obj = offers.offer_name[data.TemplateId] ? data : null;
    if (obj) { 
      temp = {
        name: offers.offer_name[data.TemplateId],
        family: constants[obj.ClassName].family ? constants[obj.ClassName].family : offers.offer_name[data.TemplateId],
        apps: offers.apps[data.TemplateId] ? offers.apps[data.TemplateId] : null,
        availment_date: obj.StartTime ? obj.StartTime : null,
        expiration_date: obj.EndTime ? obj.EndTime : null,
        unit: obj.QuantityUnit != "none" ? obj.QuantityUnit : constants[obj.ClassName].default_unit,
        value: obj.Amount ? parseFloat(Math.abs(obj.Amount)) : constants[obj.ClassName].default_value,
        expiration: obj.EndTime ? Utility.convert(obj.EndTime, 'remaining') : null,
      };
      if (temp.expiration != 'Expired') {
        temp.display =  (obj.AvailableAmount != 'infinity') ? Utility.convert(temp, constants[obj.ClassName].type) : 'Unlimited';
      } else {
        temp.display = 'none';
      };
      balance.push(temp);
    }
  });
  return balance;
};

_BalanceController.prototype.extract = function (balance_list, updated_balance) {
  var ACTION = "[extract]";
  var balance = {};
  updated_balance.forEach(function(obj) {
    obj = _.where(balance_list, { ResourceId: obj.ResourceId })[0];
    if (obj) {
      balance[obj.Name] = {
        availment_date: obj.StartTime,
        expiration_date: obj.EndTime,
        unit: obj.QuantityUnit != "none" ? obj.QuantityUnit : constants[obj.ClassName].default_unit,
        value: obj.Amount ? parseFloat(Math.abs(obj.Amount)) : constants[obj.ClassName].default_value,
        expiration: Utility.convert(obj.EndTime, 'remaining')
      };
      balance[obj.Name].display = balance[obj.Name].value;
    }
  });
  return balance;
};

_BalanceController.prototype.getTotalBalance = function (personal, group) {
  var ACTION = "[getTotalBalance]";
  personal = JSON.parse(JSON.stringify(personal));
  for(key in personal) {
    if (group[key]) {
      personal[key].value += group[key].value;
      personal[key].display = Utility.convert(personal[key]);
    }
    delete personal[key].expiration;
  }

  return personal;
};

module.exports = _BalanceController;
