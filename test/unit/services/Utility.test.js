require('sails-test-helper');
var should = require('chai').should();
var expect = require('chai').expect;
var sinon = require('sinon');
var req = require('rekuire');
var Utility = req('Utility');
var libphonenumber = require('libphonenumber');
var uuid = require('node-uuid');

describe('Utility', function() {
  
  describe('#getRefNum()', function() {
    it('should call uuid.v4()', function() {
      var spy = sinon.spy(uuid, 'v4');
      Utility.getRefNum();
      spy.calledOnce.should.be.true;
      spy.restore();
    });
  });

  describe('filterObject()', function() {
    context('when no/invalid object is passed', function() {
      it('should return what is passed', function() {
        expect(Utility.filterObject()).to.be.undefined;
        Utility.filterObject('hello world').should.eql('hello world');
        Utility.filterObject({}).should.eql({});
      });
    });

    context('when the object has a field with an empty string value', function() {
      it('should return the object without the field', function() {
        Utility.filterObject({ key: '', foo: 'bar' }).should.eql({ foo: 'bar' });
      });
    });

    context('when the object has a field with an empty object value', function() {
      it('should return the object without the field', function() {
        Utility.filterObject({ key: {}, foo: 'bar' }).should.eql({ foo: 'bar' });
      });
    });

    context('when the object has a field with a null value', function() {
      it('should return the object without the field', function() {
        Utility.filterObject({ key: null, foo: 'bar' }).should.eql({ foo: 'bar' });
      });
    });
  });

  describe('#formatToE164()', function() {
    context('when string passed is a valid mobile number', function() {
      it('should call libphonenumber.e164',function() {
        var libSpy = sinon.spy(libphonenumber, 'e164');
        Utility.formatToE164('+639473371383');
        libSpy.calledOnce.should.be.true;
        libSpy.restore();
      });

      it('should return the mobile number in E164 format',function() {
        Utility.formatToE164('+639473371383').should.equal('+639473371383');
        Utility.formatToE164('+6309473371383').should.equal('+639473371383');
      });
    });

    context('when string passed is empty', function() {
      it('should return null',function() {
        expect(Utility.formatToE164('')).to.be.null;
      });
    });

    context('when string passed is an invalid mobile number', function() {
      it('should return null',function() {
        expect(Utility.formatToE164('abcdefghijk')).to.be.null;
      });
    });
  });

  describe('#formatMsisdn()', function() {
    context('when string passed is a mobile number in +63-format', function() {
      it('should call libphonenumber.e164',function() {
        var libSpy = sinon.spy(libphonenumber, 'e164');
        Utility.formatMsisdn('+639473371383');
        libSpy.calledOnce.should.be.true;
        libSpy.calledWith('+639473371383');
        libSpy.restore();
      });

      it('should return the mobile number in E164 format',function() {
        Utility.formatMsisdn('+639473371383').should.equal('639473371383');
      });
    });

    context('when string passed is a mobile number in 63-format', function() {
      it('should call libphonenumber.e164',function() {
        var libSpy = sinon.spy(libphonenumber, 'e164');
        Utility.formatMsisdn('639473371383');
        libSpy.calledTwice.should.be.true;
        libSpy.calledWith('639473371383');
        libSpy.calledWith('+639473371383');
        libSpy.restore();
      });

      it('should return the mobile number in E164 format',function() {
        Utility.formatMsisdn('639473371383').should.equal('639473371383');
      });
    });
  });

  describe('hasKeys()', function() {
    context('when obj doesn\'t have keys', function() {
      it('should return false', function() {
        Utility.hasKeys().should.eql(false);
        Utility.hasKeys('').should.eql(false);
        Utility.hasKeys(123).should.eql(false);
        Utility.hasKeys(undefined).should.eql(false);
        Utility.hasKeys(null).should.eql(false);
        Utility.hasKeys({}).should.eql(false);
      });
    });

    context('when obj is a valid json with keys', function() {
      it('should return true', function() {
        Utility.hasKeys({ foo: 'bar' }).should.eql(true);
      });
    });
  });


});