var assert = require('assert');
var expect = require('Chai').expect;
var request = require('request');

var expected, current;

var scope;

/*
beforeEach(module('PVC'));

beforeEach(inject(function($controller, $rootScope){
	scope = $rootScope.$new();
	$controller('MainCtrl', { $scope: scope});
}));

before(function(){
	expected = ['a', 'b', 'c'];
})

describe('Website returning 200', function(){
	it('should return 200', function(done){
		var options = {
			url: 'http://localhost:3000',
			headers: {
				'Content-Type': 'text/plain'
			}
		}

		request.get(options, function(err, res, body){
			expect(res.statusCode).to.equal(200);
			expect(res.body).to.contain('Hello World');
			done();
		})
	})
})
*/

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