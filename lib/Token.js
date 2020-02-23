var crypto = require('crypto');

function MalformedToken(message) {
  this.message = message;
}

function TokenExpired(message) {
  this.message = message;
}

function Token(opts) {
  var IV_LENGTH = 16;
  var KEY_LENGTH = 16;

  if (typeof opts.key === 'undefined') {
    throw new Error('Key should be defined.');
  }
  if (opts.key.length !== KEY_LENGTH) {
    throw new Error('Key should have 16 characters.');
  }
  if (typeof opts.iv === 'undefined') {
    throw new Error('Initialization vector should be defined.');
  }
  if (opts.iv.length !== IV_LENGTH) {
    throw new Error('Initialization vector should have 16 characters.');
  }
  this.mode = opts.mode;
  this.key = opts.key;
  this.iv = opts.iv;
  this.lifetime = opts.lifetime;
}

function generateSalt(type) {
  var string = '';
  if (type == 'client_token' || type == 'organization_token') {
    var chars = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var length = 5;
    for (var i = 0; i < length; i++) {
      var randomNo = Math.floor(Math.random() * chars.length);
      string += chars.substring(randomNo, randomNo + 1);
    }
  } else {
    string = 'c1L@nTr0';
  }
  return string;
}

MalformedToken.prototype = new Error();
TokenExpired.prototype = new Error();
Token.prototype.MalformedToken = MalformedToken;
Token.prototype.TokenExpired = TokenExpired;

//type - client_token - content: { sid:'', lifetime:''}
//type - token - content: { msisdn:'', wallet_id: ''}
Token.prototype.generate = function (type, content) {
  var cipher = crypto.createCipheriv(this.mode, this.key, this.iv);
  var createdAt = this.unixEpochTimeInSecs();

  if (type == 'client_token') {
    var lifeTime = content.lifetime;
    var expiresAt = createdAt + lifeTime;
    var data = ['sid=' + content.sid,
        'created_at=' + createdAt,
        'expires_at=' + expiresAt,
        'salt=' + generateSalt(type)].join(',');
    var encrypted = cipher.update(data, 'binary');
    return new Buffer(encrypted, 'binary').toString('base64');
  } else if (type == 'organization_token') {
    var lifeTime = content.lifetime;
    var expiresAt = (lifeTime == "infinite") ? lifeTime : createdAt + lifeTime;
    var data = ['access_id=' + content.access_id,
        'created_at=' + createdAt,
        'expires_at=' + expiresAt,
        'salt=' + generateSalt(type)].join(',');
    var encrypted = cipher.update(data, 'binary');
    return new Buffer(encrypted, 'binary').toString('base64');
  } else {
    var data = ['msisdn=' + content.msisdn,
        'wallet_id=' + content.wallet_id,
        'salt=' + generateSalt(type)].join(',');
    var encrypted = cipher.update(data, 'binary');
    return new Buffer(encrypted, 'binary').toString('base64');
  }
};

Token.prototype.validate = function (type, token) {
  var decipher = crypto.createDecipheriv(this.mode, this.key, this.iv);
  var ciph = new Buffer(token, 'base64').toString('binary');
  //var decoded = decipher.update(ciph, 'hex', 'utf-8').split(',');
  var decoded = decipher.update(ciph);
  decoded += decipher.final();
  var properties = decoded.split(',');
  var obj = {};

  properties.forEach(function (property) {
    var tup = property.split('=');
    obj[tup[0]] = tup[1];
  });

  if (type == 'client_token') {
    if ((typeof(obj.sid) === 'undefined') ||
        (typeof(obj.created_at) === 'undefined') ||
        (typeof(obj.expires_at) === 'undefined') ||
        (typeof(obj.salt) === 'undefined')) {
      throw new MalformedToken('malformed-token');
    }
    var now = this.unixEpochTimeInSecs();
    if (parseInt(obj.expires_at) < now) {
      throw new TokenExpired('token-expired');
    }
  } else if (type == 'organization_token') {
    if ((typeof(obj.access_id) === 'undefined') ||
        (typeof(obj.created_at) === 'undefined') ||
        (typeof(obj.expires_at) === 'undefined') ||
        (typeof(obj.salt) === 'undefined')) {
      throw new MalformedToken('malformed-token');
    }
    var now = this.unixEpochTimeInSecs();
    if (obj.expires_at != "infinite" && parseInt(obj.expires_at) < now) {
      throw new TokenExpired('token-expired');
    }
  } else {
    if ((typeof(obj.msisdn) === 'undefined') ||
      (typeof(obj.wallet_id) === 'undefined') ||
      (typeof(obj.salt) === 'undefined')) {
      throw new MalformedToken('malformed-token');
    }
  }
  return obj;
};

Token.prototype.currentDate = function currentDate() {
  return new Date();
};

Token.prototype.unixEpochTimeInSecs = function unixEpochTimeInSecs() {
  return Math.round(this.currentDate() / 1000);
};

module.exports = Token;