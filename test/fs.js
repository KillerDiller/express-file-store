var fs = require('fs');
var join = require('path').join;
var FileStore = require('..');
var assert = require('assert');
var rimraf = require('rimraf');

describe('FS Backend', function() {
  
  const testdir = join(__dirname, 'test');

  before(function() {
    try {
      fs.unlinkSync(testdir);
      fs.mkdirSync(testdir);
    } catch(e) {}
    this.backend = FileStore('fs', testdir);
  });
  
  after(function(done) {
    rimraf(testdir, done);
  });
  
  it('#put', function(done) {
    this.backend.put({
      filename: 'a/b/c.js',
      contentType: 'application/javascript',
      stream: fs.createReadStream(join(__dirname, 'fs.js'))
    }, function(err) {
      assert(!err);
      done();
    });
  });
  
  it('#get', function(done) {
    this.backend.get('a/b/c.js', function(err, file) {
      assert(!err);
      assert.equal(file.filename, join('a', 'b', 'c.js'));
      assert.equal(file.contentType, 'application/javascript');
      assert(!!file.stream);
      file.stream.close();
      done();
    });
  });
  
  it('#get (missing)', function(done) {
    this.backend.get('a/b/d.js', function(err, file) {
      assert.equal(err.message, 'File not found');
      done();
    });
  });
  
  it('#remove', function(done) {
    this.backend.remove('a/b/c.js', function(err) {
      assert(!err);
      assert(!fs.existsSync(join(testdir, 'a', 'b', 'c.js')));
      done();
    });
  });
});