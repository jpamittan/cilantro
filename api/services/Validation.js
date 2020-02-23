var TAG = '[Validation]';
var validator = require('validator');
var libphonenumber = require('libphonenumber');

var NAME_PATTERN = new RegExp(/^[A-Za-zÑñ. -]*$/);
var UPPERCASE_PATTERN = new RegExp(/^[A-Z]*$/);
var EMAIL_PATTERN = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);

function Validation() {};

Validation.prototype.containKeys = function (params, body, file) {
  var _this = this;
  if (typeof params === 'undefined' || params.constructor !== Array) {
    throw new Error('Please pass an array of valid params obj.');
  }
  if (typeof body === 'undefined') {
    throw new Error('Please pass an object.');
  }
  var errors = _this.hasValidationErrors(params, body, file);
  if (errors.length == 0) {
    return { valid: true, error: null };
  }
  var ret = { valid: false, error: Errors.raise('MISSING_INVALID_PARAMS') };
  ret.error.error.params = errors;
  return ret;
};

Validation.prototype.hasValidationErrors = function (params, body, file) {
  var _this = this;
  var errors = [];
  if (typeof params === 'undefined' || params.constructor !== Array) {
    throw new Error('Please pass an array of valid params obj.');
  }
  /*
    TO-DO: Validation of params array(each object must contain name, type, & required keys)
  */
  params.forEach(function(param) {
    var obj = (param.type == 'file') ? file : body;

    if (param.condition && _.isFunction(param.condition)) {
      param.required = param.condition(obj);
    }
    if ( ( param.required && ( !obj || !obj.hasOwnProperty(param.name) || !_this.isValidFormat(param.type, obj[param.name], param) )) ||
      ( !param.required && obj && obj.hasOwnProperty(param.name) && !_this.isValidFormat(param.type, obj[param.name], param) ) ){
      if (param.type == 'json' && obj[param.name]) {
        try {
          var json_errors = _this.alterErrorFields(param.name, _this.hasValidationErrors(require('rekuire')(param.json_file || param.name), obj[param.name]));
          errors = errors.concat(json_errors);
        } catch(e) {
          sails.log.error(e);
          errors.push(Errors.getParam(param.name));
        }
      } else {
        errors.push(Errors.getParam(param.error || param.name));
      }
    }
  });
  return errors;
};

Validation.prototype.isValidFormat = function (type, value, opts) {
  var _this = this;
  var opts = opts? opts : {};

  if (typeof type === 'undefined') {
    throw new Error('Please pass a type.');
  }

  switch (type) {
    case 'string':
      var isLength = (opts.min_length && opts.max_length)? validator.isLength(value, opts.min_length, opts.max_length) : true;
      var isValidValue = true;
      if (opts.values) {
        isValidValue = opts.values.indexOf(value) >= 0 ? true : false;
      }
      return (typeof value == 'string' && value.trim() != '' && isLength && isValidValue);
    case 'numeric':
      return _this.isValidFormat('string', value, opts) && validator.isNumeric(value);
    case 'name':
      return _this.isValidFormat('string', value, opts) && NAME_PATTERN.test(value);
    case 'uppercase':
      return _this.isValidFormat('string', value, opts) && UPPERCASE_PATTERN.test(value);
    case 'email':
        return _this.isValidFormat('string', value, opts) && EMAIL_PATTERN.test(value);
    case 'mobile':
      return _this.isValidMobile(value);
    case 'date':
      return validator.isDate(value);
    case 'birth_date':
      return validator.isDate(value);
    case 'int':
      return (value !== "" && value % 1 == 0);
    case 'array':
      return (value.constructor === Array);
    case 'file':
      return value.originalFilename != '';
    default:
      return false;
  }
};

Validation.prototype.alterErrorFields = function (prefix, errors) {
  if (typeof prefix === 'undefined') {
    throw new Error('Please pass a prefix.');
  }
  if (typeof errors === 'undefined' || errors.constructor !== Array) {
    throw new Error('Please pass a valid error array.');
  }
  errors.forEach(function(error) {
    if (error.field) {
      error.field = prefix + '.' + error.field;
    }
  });
  return errors;
};

Validation.prototype.isValidMobile = function (string) {
  try {
    libphonenumber.validate('+' + string);
    return true;
  } catch(e) {
    return false;
  }
};

module.exports = Validation;
