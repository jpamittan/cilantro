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
    amount_unit: {
      type: 'string',
      required: true
    },
    amount_value: {
      type: 'string',
      required: true
    },
    type: {
      type: 'string',
      defaultsTo: 'PayMaya'
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

function format(denomination) {
  var obj = {
    id: denomination.id,
    type: denomination.type,
    amount: {
      unit: denomination.amount_unit,
      value: parseFloat(denomination.amount_value).toFixed(2)
    }
  };
  obj.amount.display = Utility.convert(obj.amount, 'currency');
  return obj;
}
