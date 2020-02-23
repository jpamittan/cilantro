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
    cilantro_id: {
      type: 'string',
      required: true,
    },
    category: {
      type: 'string',
      required: true,
      unique: false
    },
    usage_unit: {
      type: 'string',
      required: true,
      unique: false
    },
    usage_today: {
      type: 'integer',
      required: true
    },
    usage_total: {
      type: 'integer',
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
      return format(obj);
    }
  },
  beforeUpdate:function(values,next) {
    values.updated_at = new Date();
    next();
  }
}

function format(datausage) {
  var obj = {
    id: datausage.account_id,
    usage: datausage.usage_today
  };
  return obj;
}
