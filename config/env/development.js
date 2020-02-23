module.exports = {

  port: process.env.PORT || 1338,
  
  environment: process.env.NODE_ENV || 'development',

  matrixx: {
    timeout: 600000,
    https: false,
    options: {
      host: '10.0.4.19',
      port: '8080'
    },
    base_path: '/rsgateway/data/v3'
  },

  winston: {
    filename: 'sampleevent.log',
    level: 'info',
    json: true,
    eol: '\n',
    timestamp: true
  },

  sns: {
    region: 'us-west-2',
    api_version: '2010-03-31',
    key_id: 'AKIAJOWN2B2X67GNDFCA',
    access_key: 'oyjAaMOz2Dtt96nwSJrw+AiNaCRuoEgPPg6AkCbU',
    android_arn: 'arn:aws:sns:us-west-2:205181465834:app/GCM/Hermosa-Android'
  },

  active_mq: {
    host: '10.0.4.15',
    port: 61613,
    url: '/topic/matrixx.all',
    username: 'guest',
    password: 'guest'
  },

  paymaya: {
    url: 'https://pg-sandbox.paymaya.com',
    authorization: 'Basic c2stM1BLOEhPMDhWd1dNT0RMbGJPQk9rU0x4S2JmWnhxOWhjT2d0ellWYjBqVzo=',
    callback_host: 'http://52.34.34.164:8080',
    callback_success: '/hermosa/v1/checkout/result?status=success',
    callback_failure: '/hermosa/v1/checkout/result?status=failure',
  },
  
  skip_activation_code: true,

  auth0: {
    url: 'https://smartlife.auth0.com',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJsZEM2SGpVN3dCZFJUWmVNTnZJVGszYk5nVzJzZHdqYiIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbInJlYWQiLCJ1cGRhdGUiXX0sInVzZXJzX2FwcF9tZXRhZGF0YSI6eyJhY3Rpb25zIjpbInVwZGF0ZSJdfX0sImlhdCI6MTQ1MTcwNjQwMCwianRpIjoiNTc2OWYwNGMwZmIzZGQ1OGUyZTVlOGJhOGUzYjIwNTMifQ.pCJcItfkc3XzzBiHWE1waZaiewpXVjLt2eegpj_PwuQ',
    domain: 'smartlife.auth0.com',
    client_id: '6m7YKvZypjhj0jkX6C2Wuz2IP4yjqwzz',
    client_secret: 'sigNdRCAhkqZ2N5nhxNY6GGfmUGfGSeoyvJeh6FGRHg9u8Vc-Kwrx8yrPvP8CWql'
  },

  cron: {
    schedule: '59 59 15 * * *',
    initialize: false
  },

  health_check: {
    timeout: 3000
  },

  barley: {
    url: 'http://staging.cloud.barley.cilantro.xyz',
    authorization: 'TJBPzpu5dJfFvRlmJZz1'
  },

  basil: {
    url: 'http://localhost:1336'
  },

  token: {
    mode: 'aes-128-cfb',
    key: 'CVj0O2WK1bd9mrR4',
    iv: 'dxm7k12FLLgd0U95',
    lifetime: 3600, // 86400  default
  },

  vcode: {
    mode: 0,
    length: 6,
    validity: 60 * 60 * 24,
    max_incorrect_attempts: 5
  },

  s3: {
    region: 'us-west-2',
    api_version: '2010-03-31',
    bucket: 'project-hermosa',
    key_id: 'AKIAJBMLUAXMDB25BARA',
    access_key: 'iMejFKZnECftKlkbK6zGad3ZpBmTMd9Uj+lvJ+a/',
    dump_dir: 'talas/'
  },

};  

