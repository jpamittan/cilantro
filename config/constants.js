var constants = {

  'balance': ['PrePaid','Flexitime', 'Big Bytes 5 - OA', 'Big Bytes 15 - OA','Registration Bonus'],
  'preload': ['WelcomeP100','Registration Bonus'],
  // 'PrePaid': {
  //   class_name: "Peso",
  //   default_unit: "PHP",
  //   default_value: 0,
  //   type: "currency",
  //   variable: "peso"
  // },
  // 'Flexitime': {
  //   class_name: "Voice",
  //   default_unit: "minutes",
  //   default_value: 0,
  //   type: "time",
  //   variable: "flexitime"
  // },
  // 'Big Bytes 5 - OA': {
  //   class_name: "Open Access",
  //   default_unit: "megabytes",
  //   default_value: 0,
  //   type: "data",
  //   variable: "open_data"
  // },
  
  // 'WelcomeP100': {
  //   class_name: "Peso",
  //   default_unit: "PHP",
  //   default_value: 0,
  //   type: "currency",
  //   variable: "peso"
  // },
  // 'Free SMS': {
  //   class_name: "Text",
  //   default_unit: "sms",
  //   default_value: 0,
  //   type: "text",
  //   variable: "sms"
  // },
  // 'Registration Bonus': {
  //   class_name: "Data Rewards",
  //   default_unit: "megabytes",
  //   default_value: 0,
  //   type: "data",
  //   variable: "open_data"
  // },

  // Balance default values
  'Unlimited Data': {
    default_unit: "megabytes",
    default_value: 'infinity',
    type: "data",
    variable: "unli_data",
    offers: ['PrePaid', 'WelcomeP100']
  },
  'Peso': {
    default_unit: "PHP",
    default_value: 0,
    type: "currency",
    variable: "peso",
    offers: ['PrePaid', 'WelcomeP100']
  },
  'Voice': {
    default_unit: "minutes",
    default_value: 0,
    type: "time",
    variable: "flexitime",
    offers: ['Flexitime']
  },
  'GigaSurf Family - Data': {
    family: "GigaSurf",
    default_unit: "megabytes",
    default_value: 0,
    type: "data",
    variable: "open_data",
    offers: ['Big Bytes 5 - OA']
  },
  'Big Bytes Family': {
    family: "BigBytes",
    default_unit: "megabytes",
    default_value: 0,
    type: "data",
    variable: "open_data",
    offers: ['Big Bytes 5 - OA']
  },
  'Video Family': {
    default_unit: "megabytes",
    default_value: 0,
    type: "data",
    variable: "video_data",
    offers: ['Big Bytes 5 - OA']
  },
  'GigaSurf Family - Text': {
    family: "GigaSurf",
    default_unit: "sms",
    default_value: 0,
    type: "text",
    variable: "sms",
    offers: ['Free SMS']
  },
  'Text': {
    default_unit: "sms",
    default_value: 0,
    type: "text",
    variable: "sms",
    offers: ['Free SMS']
  },
  'Data Rewards': {
    default_unit: "megabytes",
    default_value: 0,
    type: "data",
    variable: "open_data",
    offers: ['Registration Bonus']
  },






















  balance_types: ['peso_balance', 'open_data_balance', 'smart_data_balance'],
  group_types: ['open_data_shared', 'smart_data_shared'],
  peso_balance: {
    class_name: "Philippines Peso",
    default_unit: "PHP",
    default_value: 0,
    type: "currency",
    variable: "peso"
  },
  open_data_balance: {
    class_name: "Open Access Data",
    default_unit: "megabytes",
    default_value: 0,
    type: "data",
    variable: "open_data"
  },
  smart_data_balance: {
    class_name: "Smart Life Data",
    default_unit: "megabytes",
    default_value: 0,
    type: "data",
    variable: "smart_life_data"
  },
  open_data_shared: {
    class_name: "Open Access Data",
    default_unit: "megabytes",
    default_value: 0,
    type: "data",
    variable: "open_data"
  },
  smart_data_shared: {
    class_name: "Smart Life Data",
    default_unit: "megabytes",
    default_value: 0,
    type: "data",
    variable: "smart_life_data"
  },
  offer: {
    type: {
      personal: "personal",
      shared: "shared"
    }
  },
  account: {
    type: {
      primary: "Primary",
      supplemental: "Supplemental"
    }
  },
  usage: {
    type: {
      shared: "Shared"
    }
  },
  user: {
    type: {
      subscriber: "subscriber",
      admin: "admin"
    }
  },
  topup: {
    types: {
      own: "own",
      gift: "gift"
    }
  },
  purchase: {
    types: {
      own: {
        name: "own",
        sender: "Subscriber",
        recipient: "Subscriber"
      },
      gift: {
        name: "gift",
        sender: "Gift-Giver",
        recipient: "Gift-Recipient"
      },
      group: {
        name: "group",
        sender: "Subscriber",
        recipient: "Group"
      }
    }
  },
  subcriber_query: {
    type: {
      msisdn: "AccessNumber",
      external_id: "ExternalId"
    }
  },
  unit: {
    type: {
      peso: "PHP",
      data: "megabytes",
      sms: "texts",
      voice: 'minutes'
    }
  },
  sms_notif: {
    name: 'SmartLife'
  },
  notif: {
    type: {
      activate_account: "activate",
      odyssey_activate: "odyssey_activate",
      global_activate: "global_activate",
      hermosa_activate: "hermosa_activate",
      topup: "topup",
      purchase: "purchase",
      iflix: "iflix",
      nba: "nba",
      perks: "perks",
      epin: "epin",
      global_eload: "global_eload",
      global_bills: "bills_payment",
      global_music_subs: "music_subscription",
      global_movie_subs: "movie_subscription",
      global_emags_subs: "emags_subscription"
    }
  },
  service_charge: {
    amount: 2,
    currency: 'usd'
  },
  subscriptions: {
    emags_plan_id: 'emag-subscription-plan',
    emags_duration: '1 month',
    music_plan_id: 'music-subscription-plan',
    music_duration: '1 month',
    music_free_duration: '30 days',
    movie_plan_id: 'movie-subscription-plan',
    movie_duration: '1 month',
    movie_free_duration: '30 days'
  },
  free_emags: [
    '2016-06',
    '2016-07',
    '2016-08'
  ]

};

module.exports = constants;





















