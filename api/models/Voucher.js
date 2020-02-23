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
    created_by: {
      type: 'string',
      defaultsTo: null
    },
    voucher_name: {
      type: 'string',
      defaultsTo: null
    },
    voucher_code: {
      type: 'string',
      required: true,
      unique: true
    },
    cilantro_id: {
      type: 'string',
      defaultsTo: null
    },
    app_name: {
      type: 'string',
      defaultsTo: null
    },
    event: {
      type: 'string',
      defaultsTo: null
    },
    msisdn: {
      type: 'string',
      defaultsTo: null
    },
    status: {
      type: 'string',
      defaultsTo: 'unclaimed'
    },
    purchased_at: {
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
  }
};
