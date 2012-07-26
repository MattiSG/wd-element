WebDriver Elements
==================

The [wd](https://github.com/admc/wd#readme) module for Node is a good WebDriver controller. However, its API enforces the classical Node-style callbacks (i.e. pass a callback to each getter, needing to test its first argument for an error…). The dreaded pyramid of callback neural death awaits users.

This module aims at providing an object-oriented, [promises](http://wiki.commonjs.org/wiki/Promises/A)-style abstraction over wd methods.

The goal is to be able to chain methods and getters this way:

	var wd = require('wd'),
		element = require('wd-element'),
		assert = require('assert');

	// actual added value by this library
	function navigate(remoteBrowser) {
		element.use(remoteBrowser);

		element.findByName('q')
			   .then(element.fill('Toto'))
			   .then(element.click)
			   .then(element.findById('zero_click_heading'))
			   .then(element.matches('Meanings of Toto'))
			   .then(function(matches) {
			   		assert(matches);
			   	}).end();	// needed if we want to throw any exception found along the way instead of writing a specific catcher for it
	}

	// from here on, it's standard wd usage
	var browser = wd.remote();

	browser.init({ 'browserName': 'chrome' }, function(err) {
		if (err) throw err;

		wd.get('http://duckduckgo.com', function(err) {	// only callback we'll have to write, since this is in wd
			if (err) throw err;

			navigate(browser);
		});
	});
