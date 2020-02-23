module.exports = {

  port: 80,
  
  environment: process.env.NODE_ENV,
  
  matrixx: {
    timeout: process.env.MATRIXX_TIMEOUT,
    https: process.env.MATRIXX_HTTPS,
    options: {
      host: process.env.MATRIXX_HOST,
      port: process.env.MATRIXX_PORT
    },
    base_path: process.env.MATRIXX_BASE_PATH
  },

  barley: {
    url: process.env.BARLEY_URL,
    authorization: process.env.BARLEY_AUTHORIZATION
  },

  winston: {
    filename: process.env.WINSTON_FILENAME,
    level: process.env.WINSTON_LOG_LEVEL,
    eol: process.env.WINSTON_EOL,
    timestamp: process.env.WINSTON_TIMESTAMP,
    remote_host: process.env.WINSTON_REMOTE_HOST,
    remote_port: process.env.WINSTON_REMOTE_PORT
  },
  
  sns: {
    region: process.env.SNS_REGION,
    api_version: process.env.SNS_API_VERSION,
    key_id: process.env.SNS_KEY_ID,
    access_key: process.env.SNS_ACCESS_KEY,
    android_arn: process.env.SNS_ANDROID_ARN,
    ios_arn: process.env.SNS_IOS_ARN
  },

  chikka: {
    url: process.env.CHIKKA_URL,
    client_id: process.env.CHIKKA_CLIENT_ID,
    secret_key: process.env.CHIKKA_SECRET_KEY,
    shortcode: process.env.CHIKKA_SHORTCODE
  },

  active_mq: {
    host: process.env.ACTIVEMQ_HOST,
    port: process.env.ACTIVEMQ_PORT,
    url: process.env.ACTIVEMQ_URL,
    username: process.env.ACTIVEMQ_USERNAME,
    password: process.env.ACTIVEMQ_PASSWORD
  },

  skip_activation_code: process.env.SKIP_ACTIVATION,

  auth0: {
    url: process.env.AUTH0_URL,
    token: process.env.AUTH0_TOKEN,
    domain: process.env.AUTH0_DOMAIN,
    client_id: process.env.AUTH0_CLIENT_ID,
    client_secret: process.env.AUTH0_CLIENT_SECRET
  },

  cron: {
    schedule: process.env.CRON_SCHEDULE,
    initialize: process.env.CRON_INITIALIZE
  },

  health_check: {
    timeout: process.env.HEALTHCHECK_TIMEOUT
  },

  paymaya: {
    url: process.env.PAYMAYA_URL,
    authorization: process.env.PAYMAYA_AUTHORIZATION,
    callback_host: process.env.PAYMAYA_CALLBACK_HOST,
    callback_success: process.env.PAYMAYA_CALLBACK_SUCCESS,
    callback_failure: process.env.PAYMAYA_CALLBACK_FAILURE,
  },

  basil: {
    url: process.env.BASIL_URL,
  },

  smartpay: {
    url: process.env.SMARTPAY_URL
  },

  epin: {
    url: process.env.EPIN_URL,
    username: process.env.EPIN_USERNAME,
    password: process.env.EPIN_PASSWORD
  },

  hopscotch: {
    url: process.env.HOPSCOTCH_URL,
  },

  token: {
    mode: process.env.TOKEN_MODE,
    key: process.env.TOKEN_KEY,
    iv: process.env.TOKEN_IV,
    lifetime: process.env.TOKEN_LIFETIME, // 86400  default
  },

  vcode: {
    mode: process.env.VCODE_MODE,
    length: process.env.VCODE_LENGTH,
    validity: process.env.VCODE_VALIDITY,
    max_incorrect_attempts: process.env.VCODE_MAX_INCORRECT_ATTEMPTS
  },

  s3: {
    region: process.env.S3_REGION,
    api_version: process.env.S3_API_VERSION,
    bucket: process.env.S3_BUCKET,
    key_id: process.env.S3_KEY_ID,
    access_key: process.env.S3_ACCESS_KEY,
    dump_dir: process.env.S3_DUMP_DIR
  },

  connections: {
    mysql: {
      adapter: 'sails-mysql',
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    },
    redis: {
      adapter: 'sails-redis',
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      prefix: process.env.REDIS_PREFIX,
      ttl: process.env.REDIS_TTL, // in seconds
      database: process.env.REDIS_DATABASE
    },
  },

  rss_feeds: {
    interaksyon: process.env.RSS_FEEDS_INTERAKSYON,
    lifestyle: process.env.RSS_FEEDS_LIFESTYLE,
    infotech: process.env.RSS_FEEDS_INFOTECH,
    motoring: process.env.RSS_FEEDS_MOTORING,
    sports: process.env.RSS_FEEDS_SPORTS,
    entertainment: process.env.RSS_FEEDS_ENTERTAINMENT,
  },

  currency_converter: {
    url: process.env.CURRENCY_CONVERTER_URL
  },

  paypal: {
    mode: process.env.PAYPAL_MODE, //sandbox or live
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_CLIENT_SECRET
  },

  eload: {
    url               : process.env.ELOAD_URL,
    sun_public_key    : process.env.ELOAD_SUN_PUBLIC_KEY,
    sun_private_key   : process.env.ELOAD_SUN_PRIVATE_KEY,
    smart_public_key  : process.env.ELOAD_SMART_PUBLIC_KEY,
    smart_private_key : process.env.ELOAD_SMART_PRIVATE_KEY,
    pldt_public_key   : process.env.ELOAD_PLDT_PUBLIC_KEY,
    pldt_private_key  : process.env.ELOAD_PLDT_PUBLIC_KEY,
    dealer_code       : process.env.ELOAD_DEALER_CODE
  },
  
  bills_payment: {
    url : process.env.BILLS_PAYMENT_URL,
    x_api_key : process.env.BILLS_PAYMENT_X_API_KEY,
    token_id: process.env.BILLS_PAYMENT_TOKEN_ID,
    tpa_id: process.env.BILLS_PAYMENT_TPA_ID
  },
};
