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
    subscribed_month: {
      type: 'string',
      defaultsTo: null,
      required: true,
      size:20
    },
    subscription_date:{
      type: 'datetime',
      defaultsTo: null,
      required: true,
      size: 50
    },
    subscription_id: {
      type: 'string',
      defaultsTo: null,
      size: 255
    },
    is_recurring:{
      type: 'integer',
      defaultsTo: 0,
      required: true,
      size: 1
    },
    os: {
      type: 'string',
      defaultsTo: null,
      size: 10
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
      //delete obj.updated_at;
      return obj;
    }
  },
  beforeUpdate:function(values,next) {
    values.updated_at = new Date();
    next();
  }
};