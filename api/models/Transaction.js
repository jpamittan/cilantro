module.exports = {
  autoCreatedAt: false,
  autoUpdatedAt: false,
  connection: 'mysql',
  attributes: {
    id: {
      type: 'string',
      required: true,
      unique: true
    },
    cilantro_id: {
      type: 'string',
      required: true
    },
    app_name: {
      type: 'string',
      defaultsTo: null
    },
    type: {
      type: 'string',
      required: true
    },
    item: {
      type: 'text',
      defaultsTo: null
    },
    description: {
      type: 'string',
      defaultsTo: null
    },
    checkout_id: {
      type: 'string',
      defaultsTo: null,
    },
    amount: {
      type: 'string',
      required: true,
    },
    currency: {
      type: 'string',
      required: true,
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
      obj.timestamp = obj.created_at;
      delete obj.updated_at;
      // delete obj.created_at;
      return obj;
    }
  },
  beforeUpdate:function(values,next) {
    values.updated_at = new Date();
    next();
  }
}


