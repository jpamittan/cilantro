module.exports = {
  autoCreatedAt: false,
  autoUpdatedAt: false,
  connection: 'mysql',
  attributes: {
    id: {
      type: 'string',
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    voucher_name: {
      type: 'string',
      defaultsTo: null
    },
    voucher_code: {
      type: 'string',
      required: true,
      unique: true
    },
    cilantro_id: {
      type: 'string',
      defaultsTo: null
    },
    is_redeemed:{
      type: 'integer',
      defaultsTo: 0,
      required: true,
      size: 1
    },
    date_redeemed: {
      type: 'datetime',
      defaultsTo: null
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
      delete obj.created_at;
      delete obj.updated_at;
      return obj;
    }
  },
  beforeUpdate:function(values,next) {
    values.updated_at = new Date();
    next();
  }
};
