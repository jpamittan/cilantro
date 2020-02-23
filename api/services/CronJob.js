var TAG = '[CronJob]';
var sched = require('node-schedule'); 
var json2csv = require('json2csv');
var s3 = require('s3');
var AWS = require('aws-sdk');
var zlib = require('zlib');
var fs = require('fs');
var req = require('rekuire');
var matrixx = req('Matrixx');
var rules = req('rules');

module.exports = {

  initialize: function() {
    var ACTION = '[initialize]';
    var _this = this;
    Logger.log('debug', TAG + ACTION, 'Initialize Cron Job.' + sails.config.cron.schedule);
    var cron = sched.scheduleJob(sails.config.cron.schedule, function() {
      var date = new Date();
      Logger.log('debug', TAG + ACTION, 'Start scheduled job [' + date + ']');
      _this.saveNewSubcribers(date);
      // _this.saveSubcriberUsage(date);
    });
  },

  saveUsage: function(account, usage, created_date, callback) {
    var ACTION = '[saveUsage]';
    var _this = this;
    async.auto({
      getPreviousUsage: function(cb) {
        DataUsage.find({where: { category: usage.Name, account_id: account.id}, sort: { created_at : -1}} , function(err, result) {
          if (err) {
            Logger.log('err', TAG + ACTION, err);
            return cb(err);
          }
          var prev_usage = result.length > 0 ? result[0].usage_total : 0;
          cb(null, prev_usage);
        });
      },
      saveUsage: [ 'getPreviousUsage', function(cb, result) {
        var obj = {
          account_id: account.id,
          category: usage.Name,
          usage_unit: usage.QuantityUnit,
          usage_total: usage.Amount,
          created_at: created_date
        };
        obj.usage_today = parseFloat(usage.Amount) - parseFloat(result.getPreviousUsage);
        DataUsage.create(obj, function(err, data) {
          cb(err, data);
        });      
      }]
    }, function(err, result) {
      if (err) {
        Logger.log('error', TAG + ACTION + ' account_id=' + account.id + ' Error Saving of Subcriber Usage [' + new Date() + ']', err);
      } else {
        Logger.log('debug', TAG + ACTION + ' account_id=' + account.id , 'Success Saving of Subcriber Usage [' + new Date() + ']');
      }
      callback();
    });
  },

  iterateUsageCategories: function(account, category_usage_list, created_date) {
    var ACTION = '[iterateUsageCategories]';
    var _this = this;
    async.eachSeries(category_usage_list, function iterator(usage, async_cb) {
      if (rules.usage_type.indexOf(usage.Name) >= 0) {
        _this.saveUsage(account, usage, created_date, function(err, result) {
          async_cb();
        });
      } else {
        async_cb();
      }
    }, function(err, result) {
      // Finished category iteration
    });
  },

  saveSubcriberUsage: function(created_date) {
    var ACTION = '[saveSubcriberUsage]';
    var _this = this;
    async.auto({
      findAccounts: function(callback) {
        Account.find(function(err, accounts) {
          if (err) {
            Logger.log('error', TAG + ACTION + ' database error', err);
            return callback(err);
          }
          callback(null, accounts);
        });
      },
      getUsage: [ 'findAccounts', function(callback, result) {
        async.eachSeries(result.findAccounts, function iterator(account, async_cb) {
          if (account.msisdn == null) return async_cb();
          var obj = {
            type: 'AccessNumber',
            value: account.msisdn
          };
          matrixx.getSubscriber(obj, function(err, subscriber) {
            if (err) {
              Logger.log('error', TAG + ACTION + ' getSubscriber msisdn = ' + account.msisdn, err);
              async_cb();
            } else {
              _this.iterateUsageCategories(account, subscriber.usage, created_date);
              async_cb();
            }
          });
        }, function(err, result) {
          callback(err, result);
        });
      }]
    }, function(err, results) {
      // Finished cronjob
    });
  },

  saveNewSubcribers: function(created_date) {
    var ACTION = '[saveNewSubcribers]';
    var _this = this;
    var date  = created_date;
    var file_date = new Date(created_date);
    var month = file_date.toISOString().split('-');
    file_date = file_date.getUTCFullYear() + month[1] + month[2].split('T')[0];
    file_date = file_date.toString();

    Basil.getList({}, function(err, obj) {
      if (err) return Logger.log('error', TAG + ACTION, err);
      if (obj.records == null) {
        Logger.log('error', TAG + ACTION + '[No new subscriber for ' + created_date + ']');
      } else {
        var records = obj.records;
        var subs = [];
        async.auto({
          filterRecords: function(callback) {

            date = date.toDateString();
            records.forEach(function(record) {
              // var d = new Date(record.created_at);
              // d = d.toDateString();
              //if (d == date) {
                
                async.auto({

                  getData: function(callback) {
                    record.hermosa = _.findWhere(record.activation_list, {app_name: "hermosa"});
                    record.odyssey = _.findWhere(record.activation_list, {app_name: "odyssey"});
                    callback(null, null);
                  },

                  checkData: ['getData', function(callback) {
                    if (record.hermosa == undefined) {
                      record.hermosa = {
                        matrixx_id: null,
                        msisdn: null,
                        activated: null,
                        activated_at: null
                      };
                    }
                    if (record.odyssey == undefined) {
                      record.odyssey = {
                        matrixx_id: null,
                        msisdn: null,
                        activated: null,
                        activated_at: null
                      };
                    }
                    callback(null, null);
                  }],

                  omitData: ['checkData', function(callback) {
                    record.hermosa = _.omit(record.hermosa, 'app_name');
                    record.odyssey = _.omit(record.odyssey, 'app_name');
                    record = _.omit(record, 'activation_list');
                    record.auth0_id_list = record.auth0_id_list.toString();
                    callback(null, null);
                  }]

                }, function(err, res) {
                  if (record.hermosa.activated != null || record.odyssey.activated != null) {
                    subs.push(record);
                  }
                });
              //}
            });
            callback(null, subs);
          }
        }, function(err, results) {
          var items = results.filterRecords;
          if (items == null || items == undefined || _.isEmpty(items)) {
            Logger.log('error', TAG + ACTION + '[No new subscriber for ' + created_date + ']');
          } else {
          var fields = [
              'cilantro_id',
              'auth0_id_list',
              'profile.first_name',
              'profile.middle_name',
              'profile.last_name',
              'profile.email',
              'profile.picture',
              'profile.gender',
              'profile.birthdate',
              'created_at',
              'hermosa.matrixx_id',
              'hermosa.msisdn',
              'hermosa.activated',
              'hermosa.activated_at',
              'odyssey.matrixx_id',
              'odyssey.msisdn',
              'odyssey.activated',
              'odyssey.activated_at'
            ];
          //<Source>_SUBSDUMP_<Date>_<Node>.<Filename Extension>.gz
          var file_name = 'CILANTRO_SUBSDUMP_' + file_date + '_1.csv';
          file_name = file_name.toString();
          json2csv({ data: items, fields: fields }, function(err, csv) {
            if (err) console.log(err);
            fs.writeFile(file_name, csv, function(err) {
              if (err) throw err;
              var s3Options = {
                accessKeyId: sails.config.s3.key_id,
                secretAccessKey: sails.config.s3.access_key,
                region: sails.config.s3.region
              };
              var awsS3Client = new AWS.S3(s3Options);
              var options = {
                s3Client: awsS3Client
              };
              var client = s3.createClient(options);
              var local_file = (file_name + '.gz').toString();
              var gzip = zlib.createGzip();
              var rstream = fs.createReadStream(file_name);
              var wstream = fs.createWriteStream(local_file);
              rstream   // reads from myfile.txt
                .pipe(gzip)  // compresses
                .pipe(wstream)  // writes to myfile.txt.gz
                .on('finish', function () {  // finished
                  console.log('done compressing');
                  var params = {
                    localFile: local_file,
                    s3Params: {
                      Bucket: sails.config.s3.bucket,
                      Key: sails.config.s3.dump_dir + local_file
                    }
                  };
                  var uploader = client.uploadFile(params);
                  uploader.on('error', function(err) {
                    console.error("unable to upload:", err.stack);
                  });
                  uploader.on('progress', function() {
                    console.log("progress", uploader.progressMd5Amount,
                              uploader.progressAmount, uploader.progressTotal);
                  });
                  uploader.on('end', function() {
                    console.log("done uploading");
                    fs.unlink(file_name,function(err){
                      if(err) return console.log(err);
                      console.log('csv file successfully deleted');
                    });
                    fs.unlink(local_file,function(err){
                      if(err) return console.log(err);
                      console.log('zip file successfully deleted');
                    });
                  });
                });
            });
          });
        }
        });
      }
    });
  }

}