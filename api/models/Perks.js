var moment = require('moment-timezone');
var getPHTime = moment().tz("Asia/Manila").format();

module.exports = {
  autoCreatedAt: false,
  autoUpdatedAt: false,
  connection: 'mysql',
  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
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
    ctr: {
      type: 'integer',
      defaultsTo: null
    },
    validity: {
      type: 'datetime',
      defaultsTo: null
    },
    threshold: {
      type: 'integer',
      defaultsTo: null
    },
    threshold_ctr: {
      type: 'integer',
      defaultsTo: null
    },
    showday: {
      type: 'string',
      defaultsTo: null
    },
    showtime: {
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
    success_msg: {
      type: 'string',
      defaultsTo: null,
      size: 1000
    },
    item_code: {
      type: 'string',
      defaultsTo: null,
      size: 1000
    },
    perk_type: {
      type: 'boolean',
      defaultsTo: null,
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
      delete obj.created_at;
      delete obj.updated_at;
      return obj;
    }
  },
  beforeCreate:function(values,next) {
    var day = values.showday;
    if(day != null)
      values.showday = day.toUpperCase();
    next();
  },
  beforeUpdate:function(values,next) {
    values.updated_at = new Date();
    next();
  },
}