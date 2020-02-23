module.exports = {
  autoCreatedAt: false,
  autoUpdatedAt: false,
  connection: 'mysql',
  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    },
    cilantro_id: {
      type: 'string',
      defaultsTo: null,
      size: 255
    },
    transaction_code: {
      type: 'text',
      defaultsTo: null,
      required: true,
    },
    mobile_number: {
      type: 'string',
      defaultsTo: null,
      required: false,
      size: 20
    },
    price: {
      type: 'integer',
      defaultsTo: null,
      required: true,
    },
    product_code: {
      type: 'string',
      defaultsTo: null,
      required: true,
      size:255
    },
    fulfillment_reference_code: {
      type: 'text',
      defaultsTo: null,
      required: true,
    },
    transaction_date:{
      type: 'datetime',
      defaultsTo: null,
      required: true,
      size: 50
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