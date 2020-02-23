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
      required: true,
    },
    perk_id: {
      type: 'integer',
      required: true,
    },
    msisdn: {
      type: 'string',
      defaultsTo: null
    },
    title: {
      type: 'string',
      defaultsTo: null
    },
    code: {
      type: 'string',
      defaultsTo: null
    },
    claimed: {
      type: 'boolean',
      defaultsTo: false,
    },
    claimed_date: {
      type: 'datetime',
      defaultsTo: null,
    },
    status: {
      type: 'string',
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
      return obj;
    }
  },
  beforeUpdate:function(values,next) {
    values.updated_at = new Date();
    next();
  }
}