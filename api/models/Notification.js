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
      required: true,
      unique: false
    },
    app_name: {
      type: 'string',
      required: false,
      unique: false
    },
    deleted: {
      type: 'boolean',
      defaultsTo: false,
    },
    type: {
      type: 'string',
      required: true,
      unique: false
    },
    name: {
      type: 'string',
      required: true,
      unique: false
    },
    message: {
      type: 'text',
      required: true,
      unique: false
    },
    details: {
      type: 'text',
      required: false,
      unique: false
    },
    reference_number: {
      type: 'string',
      required: false,
      unique: false
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
      delete obj.updated_at;
      obj.created_at_epoch = Math.floor(new Date(obj.created_at).getTime() / 1000);
      return format(obj);
    }
  },
  beforeUpdate:function(values,next) {
    values.updated_at = new Date();
    next();
  }
}

function format(notification) {
  var obj = notification;
  obj.timestamp = obj.created_at;
  obj.details = typeof(obj.details) == 'string' ? JSON.parse(obj.details) : obj.details;
  delete obj.created_at;
  return obj;
}


