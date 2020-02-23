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
    username: {
      type: 'string',
      required: true
    },
    password_digest: {
      type: 'string',
      required: true
    },
    date_of_purchase: {
      type: 'string',
      required: true
    },
    type: {
      type: 'string',
      required: true
    },
    msisdn: {
      type: 'string',
      required: true
    },
    trans_id: {
      type: 'string',
      required: true
    },
    publisher_name: {
      type: 'string',
      required: true
      //unique: true
    },
    game_title: {
      type: 'string',
      required: true
      //unique: true
    },
    denom: {
      type: 'integer',
      required: true
      //unique: true
    },
    denom_unit: {
      type: 'string',
      required: true
      //unique: true
    },
    buy_amt: {
      type: 'integer',
      required: true
      //unique: true
    },
    epin_no: {
      type: 'string',
      required: true
      //unique: true
    },
    card_no: {
      type: 'string',
      required: true
      //unique: true
    },
    promo_code: {
      type: 'string',
      required: true
      //unique: true
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

