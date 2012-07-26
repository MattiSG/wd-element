var webdriver = require('wd'),
	promises = require('q');

require('mootools');


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
	get: function wrap(elm) {
		return promises.when(elm);
	}
});
