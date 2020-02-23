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
      defaultsTo: null,
      size: 255
    },
    subscription_date:{
      type: 'datetime',
      defaultsTo: null,
      required: true,
      size: 50
    },
    is_recurring:{
      type: 'integer',
      defaultsTo: 0,
      required: true,
      size: 1
    },
    subscription_id: {
      type: 'string',
      defaultsTo: null,
      size: 255
    },
    os: {
      type: 'string',
      defaultsTo: null,
      size: 10
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
      //delete obj.updated_at;
      return obj;
    }
  },
  beforeUpdate:function(values,next) {
    values.updated_at = new Date();
    next();
  },
  updateOrCreate: function (findInfo,info) {
    return MusicSubscriptions.findOne({where:findInfo}).then(function (ua) {
      if (ua) {
        return MusicSubscriptions.update(info);
      } else {
        // Music Subscription does not exist. Create.
        return MusicSubscriptions.create(info);
      }
    });
  }
};