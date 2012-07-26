var webdriver = require('wd'),
	promises = require('q');

var browser;

/** Binds this library to a specific wd `remote` instance.
*/
module.exports.use = function use(wdRemote) {
	browser = wdRemote;

	return module.exports;
}

function preCheck() {
	if (! browser)
		throw new Error('No browser was set! Use `use` first.');
}

var staticMethods = {
	/** Finds the described element.
	*
	*@param	{String}	type	One of WebDriver’s “strategies” for identifying elements. Can be one of  `class name`, `css selector`, `id`, `name`, `link text`, `partial link text`, `tag name`, xpath`.
	*@param	{String}	selector	The selector, formatted according to the given type.
	*@returns	{Promise}	A promise for an element.
	*
	*@see	wd.element
	*/
	findBy: function findBy(type, selector) {
		return promises.ncall(browser.element, browser, type, selector);
	}
}

for (var method in staticMethods) {	//export
	if (Object.prototype.hasOwnProperty.call(staticMethods, method)) {
		module.exports[method] = function() {
			preCheck();

			return staticMethods[method].apply(null, arguments);
		}
	}
}
