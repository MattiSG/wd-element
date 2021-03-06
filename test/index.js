var Element = require('../src/Element'),
	promises = require('q'),
	should = require('should'),
	webdriver = require('wd');

var URL = 'http://google.com';

var browser,
	subjectSearchBar;

describe('Setup', function() {
	it('should connect to the Selenium server', function(done) {
		this.timeout(30 * 1000);	// browser warmup can be slow

		browser = webdriver.remote();

		browser.init({
			browserName: 'chrome',
			'chrome.binary': '/Applications/Browsers/Google Chrome.app/Contents/MacOS/Google Chrome'
		}, done);
	});

	it('should load a page', function(done) {
		this.timeout(15 * 1000);	// page load can be slow

		browser.get(URL, done);
	});

	it('should find a specific element', function(done) {
		browser.elementByName('q', function(err, elm) {
			subjectSearchBar = elm;

			done(err);
		});
	});
});

describe('Element', function() {
	var element;

	it('should throw when trying to construct without passing a driver', function() {
		(function() {
			new Element();
		}).should.throw();
	});

	it('should not throw when trying to construct with a driver', function() {
		element = new Element(browser);
	});

	it('should create a promise for an element', function() {
		promises.isPromise(element.findBy('name', 'q')).should.be.ok;
	});

	it('should wrap an element in a promise', function(done) {
		element.wrap(subjectSearchBar)
				.then(function(elm) {
					elm.should.equal(subjectSearchBar);
					done();
				}, done).end();
	});

	describe('retrieval', function() {
		it('should find the same element as the wd API', function(done) {
			element.findBy('name', 'q').then(function(elm) {
				elm.value.should.equal(subjectSearchBar.value);	// can't directly call equal on elm?!
				elm.browser.should.equal(subjectSearchBar.browser);
				done();
			}, done).end();
		});

		it('should provide a getter for values', function(done) {
			element.wrap(subjectSearchBar)
				   .then(element.get('value'))
				   .then(function(val) {
						should.strictEqual(val, '');
						done();
				   }, done).end();
		});
	});

	describe('manipulation', function() {
		var TYPED = 'toto',
			TYPED_2 = 'tutu'

		it('should input a value in a field', function(done) {
			element.wrap(subjectSearchBar)
				   .then(element.type(TYPED))
				   .then(element.get('value'))
				   .then(function(val) {
						should.strictEqual(val, TYPED);
						done();
				   }, done).end();
		});

		it('should not clear the previous value of a field', function(done) {
			element.wrap(subjectSearchBar)
				   .then(element.type(TYPED_2))
				   .then(element.get('value'))
				   .then(function(val) {
						should.strictEqual(val, TYPED + TYPED_2);
						done();
				   }, done).end();
		});

		it('should clear a field', function(done) {
			element.wrap(subjectSearchBar)
				   .then(element.clear())
				   .then(element.get('value'))
				   .then(function(val) {
						should.strictEqual(val, '');
						done();
				   }, done).end();
		});
	});
});

describe('Teardown', function() {
	it('should kill the driver', function(done) {
		browser.quit(done);
	});
});
