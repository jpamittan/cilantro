// JSON Definition
// details:
// 1. Create Payment Card
// 2. Create Payment Operator Billing

module.exports = {
  autoCreatedAt: false,
  autoUpdatedAt: false,
  connection: 'redis',
  attributes: {
    id: {
      type: 'string',
      primaryKey: true
    },
    msisdn: {
      type: 'string',
      required: false
    },
    vcode: {
      type: 'string',
      required: false
    },
    details: { 
      type: 'json',
      required: false
    },
    incorrect_attempts : {
      type: 'integer',
      defaultsTo: 0
    },
    expiry: {
      type: 'datetime'
    },
    created_at: {
      type: 'datetime',
      defaultsTo: function() { return new Date(); }
    },
    updated_at: {
      type: 'datetime',
      defaultsTo: function() { return new Date(); }
    },
    toJSON: function() {
      var obj = this.toObject();
      return Utility.filterObject(obj);
    }
  },
  beforeCreate: function(values, next) {
    var ms = (new Date()).getTime() + sails.config.vcode.validity * 1000;
    values.expiry = new Date(ms);
    next();
  },
  beforeUpdate:function(values,next) {
    values.updated_at = new Date();
    next();
  }
}
