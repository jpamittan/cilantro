var moment = require('moment-timezone');
var getPHTime = moment().tz("Asia/Manila").format();

module.exports = {
  autoCreatedAt: false,
  autoUpdatedAt: false,
  connection: 'mysql',
  attributes: {
    id: {
      type: 'string',
      primaryKey: true,
      unique: true,
    },
    msisdn: {
      type: 'string',
      required: true,
    },
    auth_id: {
      type: 'string',
      required: true,
    },
    perks_id: {
      type: 'integer',
      required: true,
    },
    title: {
      type: 'string',
      defaultsTo: null,
      size: 255
    },
    category: {
      type: 'string',
      defaultsTo: null,
      size: 255
    },
    description: {
      type: 'string',
      defaultsTo: null,
      size: 2000
    },
    model_definition_id: {
      type: 'integer',
      defaultsTo: null
    },
    source: {
      type: 'string',
      defaultsTo: null,
      size: 255
    },
    url: {
      type: 'string',
      defaultsTo: null,
      size: 2000
    },
    is_web_view: {
      type: 'boolean',
      defaultsTo: null
    },
    no_detail: {
      type: 'boolean',
      defaultsTo: null
    },
    display_image: {
      type: 'json',
      defaultsTo: null,
      size: 2000
    },
    detailed_image: {
      type: 'json',
      defaultsTo: null,
      size: 2000
    },
    detailed_image_2: {
      type: 'json',
      defaultsTo: null,
      size: 2000
    },
    start_date: {
      type: 'string',
      defaultsTo: null,
      size: 255
    },
    modified_date: {
      type: 'string',
      defaultsTo: null,
      size: 255
    },
    transaction_id: {
      type: 'string',
      defaultsTo: null
    },
    code: {
      type: 'string',
      defaultsTo: null
    },
    item_code: {
      type: 'string',
      defaultsTo: null
    },
    message_one: {
      type: 'string',
      defaultsTo: null,
      size: 1000
    },
    message_two: {
      type: 'string',
      defaultsTo: null,
      size: 1000
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
      defaultsTo: function() { return new Date(getPHTime); }
    },
    updated_at: {
      type: 'datetime',
      defaultsTo: function() { return new Date(getPHTime); }
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