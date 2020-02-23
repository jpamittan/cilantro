module.exports = {
  autoCreatedAt: false,
  autoUpdatedAt: false,
  connection: 'mysql',
  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    organization: {
      type: 'string',
      defaultsTo: null,
      unique: true
    },
    access_id: {
      type: 'string',
      defaultsTo: null,
      required: true,
      unique: true
    },
    token: {
      type: 'string',
      defaultsTo: null,
      unique: true
    },
    expires_at: {
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
      delete obj.id;
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