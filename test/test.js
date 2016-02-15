var assert = require('assert');
var chai = require('Chai')
var expect = chai.expect;
var request = require('request');
var chaiHttp = require('chai-http');
var should = chai.should();



chai.use(chaiHttp);

var app = 'http://localhost:3000'


var expected, current;
var scope;

var testWine = {
	name: 'TestWine',
	varietal: 'TestGrape',
	vintage: 2000
}

describe('Comparing Numbers', function(){
	it('1 should equal 1', function(){
		expect(1).to.equal(1);
	})
	it('2 should be greater than 1', function(){
		expect(2).to.be.greaterThan(1)
	})
})

describe('Authentication', function(){
	it('should take an email and password', function(done){
	chai.request(app)
		.post('/login')
		.send({email: "kjiel.carlson@gmail.com", password: "levine#33"})
		.end(function(err, res){
			expect(err).to.be.null;
			expect(res).to.have.status(200)
			done();
		})
	})

	it('should NOT require a password to GET /login', function(done){
		chai.request(app)
			.get('/#/login')
			.end(function(err, res){
			expect(err).to.be.null;
			expect(res).to.have.status(200)
			done();
		})
	})
})

/*

describe('Routes for Wines', function(){
	it('should return a post with a Status-200 JSON', function (){
		chai.request(app)
			.post('/wines')
			.send(testWine)
			.end(function(err, res){
				res.should.have.status(200);
				expect(res).to.have.status(200);
				assert.equal(res.statusCode, 200, 'Header equals 200')
				expect(res).to.be.json;
			})
		})
	it('should return status-200 JSON on a get', function(){
		chai.request(app)
			.get('/wines')
			.end(function(err, res){
				expect(res).to.have.status(200);
				expect(res).to.be.json;
			})
	})
})

describe('Main Page', function(){
	it('should return 401', function (done) {
		var options = {
		    url: 'http://localhost:3000',
		    headers: {
		     	'Content-Type': 'text/plain'
		    } };
		request.get(options, function (err, res, body) {
		   	expect(res.statusCode).to.equal(401);
		//   	expect(res.body).to.contains('Welcome to the main page');
		    done();
  }); }); })

describe('Workspaces returning data', function(){
	it('should return JSON on get', function (done){
		var options = {
			url: 'http://localhost:3000/workspaces',
			headers: {
				Accept: 'image/jpeg'
			}
		}
		request.get(options, function(err, res, body){
			expect(res.body).to.exist;
			done();
		})
	})
})

describe('String#Split', function(){
	beforeEach(function(){
		current = 'a,b,c'.split(',');
	})
	it('should return an array', function(){
		assert(Array.isArray(current));
	})
	it('should return the same array', function(){
		assert.equal(expected.length, current.length, 'arrays have equal length');
		for (var i=0; i<expected.length; i++) {
			assert.equal(expected[i], current[i], 'element ' + i + ' is equal')
		};
	});
})



describe('Array', function() {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});

*/