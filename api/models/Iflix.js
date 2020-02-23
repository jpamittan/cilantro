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
    vcode: {
      type: 'string',
      required: true,
      unique: true
    },
    account_id: {
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
