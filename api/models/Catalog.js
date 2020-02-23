var req = require('rekuire');
var rules = req('rules');


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
    offer_group: {
      type: 'string',
      required: true,
      unique: false
    },
    offer_name: {
      type: 'string',
      required: true,
      unique: false
    },
    offer_external_id: {
      type: 'string',
      required: true,
      unique: false
    },
    inclusion: {
      type: 'string',
      required: true,
      unique: false
    },
    charge_amount: {
      type: 'integer',
      required: true,
      unique: false
    },
    charge_unit: {
      type: 'string',
      required: true,
      unique: false
    },
    validity: {
      type: 'string',
      required: true,
      unique: false
    },
    image_url: {
      type: 'string',
      required: false,
      unique: false
    },
    description: {
      type: 'string',
      required: true,
      unique: false
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

function format(catalog) {
  var obj = {
    id: catalog.purchase_name,
    name: catalog.name,
    category: catalog.category,
    amount: {
      value: catalog.charge_amount.toFixed(2),
      unit: catalog.charge_unit
    },
    description: catalog.description,
    image_url: catalog.image_url != null ? catalog.image_url : 'none',
    data_plan: {
      open_data: {
        value: catalog.open_grant_amount,
        unit: catalog.open_grant_unit,
        validity: catalog.open_validity_amount + ' ' + catalog.open_validity_unit
      },
      smart_life_data: {
        value: catalog.smart_grant_amount,
        unit: catalog.smart_grant_unit,
        validity: catalog.smart_validity_amount + ' ' + catalog.smart_validity_unit,
        free_apps: []
      }
    }
  };
  obj.data_plan.open_data.display = Utility.convert(obj.data_plan.open_data);
  obj.data_plan.smart_life_data.display = Utility.convert(obj.data_plan.smart_life_data);
  if (rules.booster_type2.indexOf(catalog.smart_external_id) >= 0){
    obj.data_plan.open_data = null;
    obj.data_plan.smart_life_data.display = (catalog.smart_grant_amount > 70) ? 'Unlimited' : obj.data_plan.smart_life_data.display;
  }
  return obj;
}

