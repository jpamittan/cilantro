var should = require('chai').should();
var req = require('rekuire');

var routes = req('routes').routes;

describe('routes', function() {
  it('should route GET /jarrak/rualiv3', function() {
    routes['GET /jarrak/rualiv3'].should.eql({
      controller: 'v1/HealthCheckController',
      action: 'check'
    });
  });

  it('should route POST /v1/accounts', function() {
    routes['POST /v1/accounts'].should.eql({
      controller: 'v1/AccountController',
      action: 'create'
    });
  });

  it('should route PUT /v1/accounts/:id/activate', function() {
    routes['PUT /v1/accounts/:id/activate'].should.eql({
      controller: 'v1/AccountController',
      action: 'activate'
    });
  });

  it('should route PUT /v1/accounts/:id/device', function() {
    routes['PUT /v1/accounts/:id/device'].should.eql({
      controller: 'v1/DeviceController',
      action: 'update'
    });
  });

  it('should route PUT /v1/accounts/:id/loadprotect', function() {
    routes['PUT /v1/accounts/:id/loadprotect'].should.eql({
      controller: 'v1/AccountController',
      action: 'loadProtect'
    });
  });

  it('should route GET /v1/accounts/:id', function() {
    routes['GET /v1/accounts/:id'].should.eql({
      controller: 'v1/AccountController',
      action: 'get'
    });
  });

  it('should route GET /v1/accounts/:id', function() {
    routes['GET /v1/accounts/:id'].should.eql({
      controller: 'v1/AccountController',
      action: 'get'
    });
  });

  it('should route GET /v1/accounts/:id/usage', function() {
    routes['GET /v1/accounts/:id/usage'].should.eql({
      controller: 'v1/UsageController',
      action: 'get'
    });
  });

  it('should route GET /v1/accounts/:id/balance', function() {
    routes['GET /v1/accounts/:id/balance'].should.eql({
      controller: 'v1/BalanceController',
      action: 'get'
    });
  });

  it('should route POST /v1/accounts/:id/topup', function() {
    routes['POST /v1/accounts/:id/topup'].should.eql({
      controller: 'v1/PurchaseController',
      action: 'topup'
    });
  });

  it('should route POST /v1/accounts/:id/purchase', function() {
    routes['POST /v1/accounts/:id/purchase'].should.eql({
      controller: 'v1/PurchaseController',
      action: 'purchase'
    });
  });

  it('should route GET /v1/categories/:id', function() {
    routes['GET /v1/categories/:id'].should.eql({
      controller: 'v1/CategoryController',
      action: 'get'
    });
  });

    it('should route GET /v1/categories', function() {
    routes['GET /v1/categories'].should.eql({
      controller: 'v1/CategoryController',
      action: 'list'
    });
  });

  it('should route GET /v1/catalog/products/:id', function() {
    routes['GET /v1/catalog/products/:id'].should.eql({
      controller: 'v1/CatalogController',
      action: 'get'
    });
  });

  it('should route GET /v1/catalog/products', function() {
    routes['GET /v1/catalog/products'].should.eql({
      controller: 'v1/CatalogController',
      action: 'list'
    });
  });

  it('should route GET /v1/advertisements/:id', function() {
    routes['GET /v1/advertisements/:id'].should.eql({
      controller: 'v1/AdvertisementController',
      action: 'get'
    });
  });

  it('should route GET /v1/advertisements', function() {
    routes['GET /v1/advertisements'].should.eql({
      controller: 'v1/AdvertisementController',
      action: 'list'
    });
  });

  it('should route GET /v1/denominations/:id', function() {
    routes['GET /v1/denominations/:id'].should.eql({
      controller: 'v1/DenominationController',
      action: 'get'
    });
  });

  it('should route GET /v1/denominations', function() {
    routes['GET /v1/denominations'].should.eql({
      controller: 'v1/DenominationController',
      action: 'list'
    });
  });

  it('should route GET /v1/denominations/:id', function() {
    routes['GET /v1/denominations/:id'].should.eql({
      controller: 'v1/DenominationController',
      action: 'get'
    });
  });

  it('should route GET /v1/denominations', function() {
    routes['GET /v1/denominations'].should.eql({
      controller: 'v1/DenominationController',
      action: 'list'
    });
  });

  it('should route GET /v1/accounts/:id/messages/:mid', function() {
    routes['GET /v1/accounts/:id/messages/:mid'].should.eql({
      controller: 'v1/MessageController',
      action: 'get'
    });
  });

  it('should route GET /v1/accounts/:id/messages', function() {
    routes['GET /v1/accounts/:id/messages'].should.eql({
      controller: 'v1/MessageController',
      action: 'list'
    });
  });

  it('should route GET /v1/accounts/:id/transactions', function() {
    routes['GET /v1/accounts/:id/transactions'].should.eql({
      controller: 'v1/TransactionController',
      action: 'list'
    });
  });



});