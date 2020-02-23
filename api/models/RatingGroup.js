module.exports = {
  autoCreatedAt: false,
  autoUpdatedAt: false,
  connection: 'mysql',
  attributes: {
    name: {
      type: 'string',
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    code: {
      type: 'string',
      required: true,
      unique: true
    },
    category: {
      type: 'string',
      required: true,
    },
    active: {
      type: 'boolean',
      defaultsTo: true,
      required: true
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

