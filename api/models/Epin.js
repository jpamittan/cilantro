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
    pin_denom_id: {
      type: 'string',
      required: true
    },
    publisher_name: {
      type: 'string',
      required: true
    },
    game_id: {
      type: 'string',
      required: true
    },
    game_name: {
      type: 'string',
      required: true
    },
    game_currency: {
      type: 'string',
      required: true
    },
    game_denomination: {
      type: 'string',
      required: true
    },
    game_denomination_unit: {
      type: 'string',
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

