/* http://mootools.net/docs/core */
require('mootools');

/* https://github.com/admc/wd#readme */
var webdriver = require('wd'),
/* https://github.com/kriskowal/q#readme */
	promises = require('q');


module.exports = new Class( /** @lends Element */ {
	/** The wd.remote instance this instance will use to look elements up.
	*@private
	*/
	browser: null,

	/** Binds this instance to a specific wd `remote` instance.
	*
	*@param	{wd.remote}	browser	The wd.remote instance this instance should use to look elements up. 
	*/
	initialize: function init(browser) {
		if (! browser)
			throw new Error('You must pass a wd.remote instance!');

		this.browser = browser;
	},

	/** Finds the described element.
	*
	*@param	{String}	type	One of WebDriver’s “strategies” for identifying elements. Can be one of  `class name`, `css selector`, `id`, `name`, `link text`, `partial link text`, `tag name`, xpath`.
	*@param	{String}	selector	The selector, formatted according to the given type.
	*@returns	{Promise}	A promise for an element.
	*
	*@see	wd.element
	*/
	findBy: function findBy(type, selector) {
		return promises.ncall(this.browser.element, this.browser, type, selector);
	},

	/** Wraps an existing element in an immediately-fulfilled promise, to make it more consistent with chained `then` constructs.
	*
	*@returns	{Promise}	A promise for the passed element, immediately fulfilled.
	*/
	wrap: function wrap(elm) {
		return promises.when(elm);
	},

	/** Wraps a method call to the wd.remote instance into a promise.
	*
	*@param	{String}	method	The method that should be called on the wd instance.
	*@param	{Array}	args	The arguments to pass to the method, as an array.
	*@private
	*/
	makePromise: function makePromise(method, args) {
		args = Array.from(args);
		var browser = this.browser;

		return function(elm) {
			args.unshift(elm);
			args.unshift(browser);
			args.unshift(browser[method]);
			return promises.ncall.apply(promises, args);	// == promises.ncall(browser[method], browser, elm, arg, …)
		}
	},

	/** Returns a promise for the given attribute of an element passed through a promise chain.
	*
	*@param	{String}	toGet	Any HTML attribute, or `text` to obtain the visible text from the element.
	*/
	get: function get(toGet) {
		if (toGet == 'text')
			return this.getText();

		return this.getAttribute(toGet);
	},

	/** Returns a promise for the given attribute of an element passed through a promise chain.
	*
	*@param	{String}	toGet	Any HTML attribute to obtain on an element passed by a promise chain.
	*@private
	*/
	getAttribute: function getAttribute(attribute) {
		return this.makePromise('getAttribute', attribute);
	},

	/** Returns a promise for the visible text of an element passed through a promise chain.
	*@private
	*/
	getText: function getText() {
		return this.makePromise('getText');
	}
});
