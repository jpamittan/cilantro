module.exports = function (error) {
  var res = this.res;
  res.req.url = res.req.url.replace(/\/$/, '');

  Logger.log('error', res.req.method + ' ' + res.req.url + ' response', error);

  error.auth_id = (this.req.body && this.req.body.auth_id);
  Winston.log('error', res.req.method + ' ' + res.req.url + ' response', error);

  res.status(error.status);
  res.json( { error: error.error });
};