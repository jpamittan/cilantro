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
    prefix: {
      type: 'string',
      required: true,
      unique: true
    },
    carrier: {
      type: 'string',
      required: true,
      enum: ['SMART & TNT', 'SUN', 'GLOBE & TM', 'GLOBE PREPAID', 'EXETEL', 'NOW'],
    },
    status: {
      type: 'boolean',
      defaultsTo: true
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

