module.exports.connections = {

  localDiskDb: {
    adapter: 'sails-disk'
  },

  mysql: {
    adapter: 'sails-mysql',
    host: 'localhost',
    user: 'devuser',
    password: 'devuser123',
    database: 'hermosa'
  },

  redis: {
    adapter: 'sails-redis',
    host: '127.0.0.1',
    port: 6379,
    prefix: 'waterline:vcode:id:',
    ttl: 60 * 60 * 24, // in seconds
    database: 0
  },

};
