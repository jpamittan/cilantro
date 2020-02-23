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
    description: {
      type: 'string',
      defaultsTo: null
    },
    image_url: {
      type: 'string',
      required: true
    },
    link: {
      type: 'string',
      defaultsTo: null
    },
    product_id: {
      type: 'string',
      defaultsTo: null
    },
    direct_purchase: {
      type: 'boolean',
      defaultsTo: false
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
}