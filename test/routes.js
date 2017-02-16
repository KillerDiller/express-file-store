var join = require('path').join;
var request = require('supertest');
var assert = require('assert');
var FileStore = require('..');
var express = require('express');

describe('Routes', function() {
  
  var url = process.env.MONGODB_URL || 'mongodb://localhost:27017/test';
  
  before(function() {
    this.fs = FileStore('gridfs', url);
    this.app = express().use(this.fs.routes).use(function(err, req, res, next) {
      if (err && err.message === 'File not found') {
        res.status(404).end(err.message);
      } else {
        next();
      }
    });
  });
  
  it('#post', function(done) {
    request(this.app)
      .post('/a/b/c.js')
      .attach('file', join(__dirname, 'routes.js'))
      .expect(201)
      .end(done);
  });
  
  it('#get', function(done) {
    request(this.app)
      .get('/a/b/c.js')
      .expect(200)
      .end(done);
  });
  
  it('#get (missing)', function(done) {
    request(this.app)
      .get('/a/b/d.js')
      .expect(404)
      .end(done);
  });
  
  it('#delete', function(done) {
    request(this.app)
      .delete('/a/b/c.js')
      .expect(204)
      .end(done);
  });
});