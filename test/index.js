var element = require('../src/Element'),
	promises = require('q'),
	should = require('should'),
	webdriver = require('wd');

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

		browser.get('http://google.com', done);
	});

	it('should find a specific element', function(done) {
		browser.elementByName('q', function(err, elm) {
			subjectSearchBar = elm;

			done(err);
		});
	});
});

describe('Static API', function() {
	it('should be bound to a specific driver', function() {
		element.use(browser);
	});

	it('should create a promise for an element', function() {
		promises.isPromise(element.findByName('q')).should.be.ok;
	});

	describe('element finding', function() {
		it('should find the same element as the wd API', function(done) {
			element.findByName('q').then(function(elm) {
				elm.should.equal(subjectSearchBar);
				done();
			}, done);
		});
	});
});
