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
    transaction_id: {
      type: 'string',
      defaultsTo: null,
      required: true,
      size: 255
    },
    card_number: {
      type: 'string',
      defaultsTo: null,
      required: true,
      size: 255
    },
    amount: {
      type: 'integer',
      defaultsTo: null,
      required: true,
    },
    description: {
      type: 'text',
      defaultsTo: null,
      required: true,
    },
    currency: {
      type: 'string',
      defaultsTo: null,
      required: true,
      size: 20
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