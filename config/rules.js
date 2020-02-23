var rules = {
  activation: [
    // {
    //   external_id : "Registration Bonus",
    //   fund_source: "Subscriber",
    //   channel_name: "Mobile App"
    // } 
    // { external_id : "Transfer Data",
    //   fund_source: "Subscriber",
    //   channel_name: "Mobile App"
    //  }
  ],
  activation_primary : [
    {
      type : "personal",
      grant_amount : "500",
      grant_unit : "peso", // B, KB, MB, GB
      validity_amount : "0",
      validity_unit : "days",
      impact : "Subscriber",
      external_id : "Peso Wallet - Personal"
    },
    {
      type : "personal",
      grant_amount : "0",
      grant_unit : "MB",
      validity_amount : "0",
      validity_unit : "days",
      impact : "Subscriber",
      external_id : "Open Data - Personal"
    },
    {
      type : "personal",
      grant_amount : "0",
      grant_unit : "MB",
      validity_amount : "0",
      validity_unit : "days",
      impact : "Subscriber",
      external_id : "Smart Data - Personal",
      rg_list: [ 102, 103, 409, 403, 806, 410, 807, 204, 503, 508, 304, 707, 706, 818, 805 ]
    },
    {
      type : "shared",
      grant_amount : "2",
      grant_unit : "GB",
      validity_amount : "30",
      validity_unit : "days",
      impact : "Group",
      external_id : "Open Data - Shared"
    },
    {
      type : "shared",
      grant_amount : "1",
      grant_unit : "GB",
      validity_amount : "30",
      validity_unit : "days",
      impact : "Group",
      external_id : "Smart Data - Shared",
      rg_list: [ 102, 103, 409, 403, 806, 410, 807, 204, 503, 508, 304, 707, 706, 818, 805 ]
    }
  ],
  activation_supplemental : [
    {
      type : "personal",
      grant_amount : "0",
      grant_unit : "peso", // B, KB, MB, GB
      validity_amount : "0",
      validity_unit : "days",
      impact : "Subscriber",
      external_id : "Peso Wallet - Personal"
    },
    {
      type : "personal",
      grant_amount : "0",
      grant_unit : "MB",
      validity_amount : "0",
      validity_unit : "days",
      impact : "Subscriber",
      external_id : "Open Data - Personal"
    },
    {
      type : "personal",
      grant_amount : "0",
      grant_unit : "MB",
      validity_amount : "0",
      validity_unit : "days",
      impact : "Subscriber",
      external_id : "Smart Data - Personal",
      rg_list: [ 102, 103, 409, 403, 806, 410, 807, 204, 503, 508, 304, 707, 706, 818, 805 ]
    }
  ],
  creation_subscriber : [
    {
      external_id : "Setup Offer Data - Personal"
    },
    {
      external_id : "Coin Awards - Personal"
    },
  ],
  topup: {
    type: ["own", "gift"],
    offer: {
      external_id: "Update: Peso Wallet - Personal",
      grant_unit : "Peso",
      charge_amount: 0,
      charge_unit: "Peso",
      validity_amount : "120",
      validity_unit : "days",
      impact: "Subscriber"
    }
  },
  purchase: {
    type: ["own", "gift"],
    offer: {
      external_id: "Update: Open Data - Personal",
      grant_amount: 0,
      grant_unit: "MB",
      charge_amount: 0,
      charge_unit: "Peso",
      validity_amount: "120",
      validity_unit: "days",
      impact: "Subscriber"
    }
  },
  rating_group: {
    list: ["app_meter_1", "app_meter_2", "app_meter_3", "app_meter_4", "app_meter_5"],
    app_meter_1: {
      name: "AppMeter1",
      rg_list: [100, 101, 102, 103, 201, 202, 203, 204, 300, 301, 302, 303, 304, 305, 306]
    },
    app_meter_2: {
      name: "AppMeter2",
      rg_list: [401, 403, 404, 405, 406, 407, 409, 410]
    },
    app_meter_3: {
      name: "AppMeter3",
      rg_list: [500, 503, 505, 506, 508]
    },
    app_meter_4: {
      name: "AppMeter4",
      rg_list: [600, 601, 602, 603, 604, 605, 607, 608, 609, 610, 613, 617, 618, 619, 622]
    },
    app_meter_5: {
      name: "AppMeter5",
      rg_list: [700, 701, 702, 706, 707, 710, 711, 718, 722, 723, 726, 727, 800, 803, 804, 805, 806, 807, 808, 809, 810, 811, 812, 813, 814, 815, 816, 817, 818, 819, 820, 821, 822, 823, 824, 99]
    }
  },
  category: {
    primary: ['Personal Data Offers', 'Shared Data Offers', 'Booster Load'],
    supplemental: ['Personal Data Offers', 'Booster Load']
  },

  activeMQ: {
    template_id: [21001, 21030, 21009, 21010, 21027, 21043, 21023, 21041, 21024, 21059, 21061, 21025, 21058, 21060, 21026, 21057, 21056, 21042, 21044, 21045, 21047, 21028, 21063, 21029, 21062, 21055, 21015, 21092, 21020, 21018, 21022, 21093, 21094, 21088, 21089, 21090, 21091, 21064, 21069, 21070, 21110, 21112, 21095, 21096, 21100, 21101, 21102, 21087],
    spiel_categories: ['peso', 'data','sms', 'voice'],
    peso : {
      template_id: [21001, 21104, 21105]
    },
    data : {
      template_id: [21030, 21009, 21010, 21027, 21043, 21023, 21041, 21024, 21025, 21026, 21042, 21044, 21045, 21028, 21029, 21015, 21092, 21020, 21018, 21022, 21093, 21094, 21088, 21089, 21090, 21091, 21110, 21095, 21096, 21100, 21101, 21102]
    },
    sms : {
      template_id: [21061, 21060, 21056, 21063, 21062, 21087, 21064, 21069, 21112]
    },
    voice : {
      template_id: [21059, 21058, 21057, 21047, 21055, 21070]
    }
  },

  usage_type : [
    "App Meter 1",
    "App Meter 2",
    "App Meter 3",
    "App Meter 4",
    "App Meter 5"
  ],
  usage_type_name : [
    "Entertainment",
    "e-Commerce",
    "Travel",
    "Social",
    "Others"
  ],
  color_palette : [
    "#079BF6",
    "#f88e0a",
    "#48f98d",
    "#b479fb",
    "#fba4eb"
  ],
  usage_type2 : [
    "Category Smart Videos",
    "Category Smart Music",
    "Category Smart Games",
    "Category Smart Payment/e-Commerce",
    "Category Smart Travel/Navigation",
    "Category Smart Social",
    "Category Smart Info",
    "Category Other"
  ],
  shared_name : [
    "big_bytes_50_shared",
    "big_bytes_99_shared",
    "big_bytes_299_shared",
    "big_bytes_799_shared"
  ],
  booster_name : [
    "facebook_5",
    "youtube_5",
    "wechat_5",
    "line_5",
    "waze_5",
    "snapchat_5",
    "tumblr_5",
    "instagram_5"
  ],
  booster_type : [
    "Facebook UNL",
    "YouTube",
    "Wechat UNL",
    "Line UNL",
    "Waze UNL",
    "Snapchat UNL",
    "Tumblr UNL",
    "Instagram"
  ],
  booster_image_url : [
    "https://s3-us-west-2.amazonaws.com/project-hermosa/products/facebook.png",
    "https://s3-us-west-2.amazonaws.com/project-hermosa/products/youtube.png",
    "https://s3-us-west-2.amazonaws.com/project-hermosa/products/wechat.png",
    "https://s3-us-west-2.amazonaws.com/project-hermosa/products/line.png",
    "https://s3-us-west-2.amazonaws.com/project-hermosa/products/waze.png",
    "https://s3-us-west-2.amazonaws.com/project-hermosa/products/snapchat.png",
    "https://s3-us-west-2.amazonaws.com/project-hermosa/products/tumblr.png",
    "https://s3-us-west-2.amazonaws.com/project-hermosa/products/instagram.png"
  ],
  booster_type2 : [
    "Facebook UNL - Personal",
    "YouTube - Personal",
    "Wechat UNL - Personal",
    "Line UNL - Personal",
    "Waze UNL - Personal",
    "Snapchat UNL - Personal",
    "Tumblr UNL - Personal",
    "Instagram - Personal"
  ],
  booster_type3 : [
    "Facebook UNL",
    "Wechat UNL",
    "Line UNL",
    "Waze UNL",
    "Snapchat UNL",
    "Tumblr UNL",
  ],
  smart_prefixes : [
    "0813" ,"0900" ,"0907" ,
    "0908" ,"0909" ,"0910" ,
    "0911" ,"0912" ,"0918" ,
    "0919" ,"0921" ,"0922" ,
    "0923" ,"0925" ,"0928" ,
    "0929" ,"0930" ,"0931" ,
    "0932" ,"0933" ,"0934" ,
    "0938" ,"0939" ,"0940" ,
    "0942" ,"0943" ,"0946" ,
    "0947" ,"0948" ,"0949" ,
    "0971" ,"0980" ,"0989" ,
    "0998" ,"0999" ,"0922" ,
    "0923" ,"0925" ,"0932" ,
    "0933" ,"0934" ,"0942" ,
    "0943" ,"0944"
  ],
  eload_types : ['smart','sun','pldt'],
  eload_filter:[
    'PLAN1000',
    'PLAN115',
    'PLAN300',
    'PLAN500',
    'PlanYBU85',
    'SBW100',
    '150',
    '300',
    '500',
    'CTU100',
    'CTU150',
    'CTU450',
    'TODOIDD100',
    'TODOIDD300',
    'TU150',
    'TU200'
  ]

};

module.exports = rules;














