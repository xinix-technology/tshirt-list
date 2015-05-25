;(function ($, window, document) {
	"use strict";

	// Case Insensitive contains pseudo selector
	$.expr[":"].contains = $.expr.createPseudo(function(arg) {
		return function( elem ) {
			return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
		};
	});

	$.fn.list = function (options) {
		// Default Settings
		var defaults = {
				config: [],
				data: [],
				placeholder: "Type to find",
				cantfind: "Can't find the string you're looking",
				empty: "Can't find any data right now",
				multipleSelect: false,
				highlight: true,
				onClick: function (element) {},
			},
			that = this,
			settings = $.extend({}, defaults, options);

		that.each(function () {
			var elem = $(this);

			elem.addClass ("listview");

			// Draw the list
			elem.draw = function () {
				var html = "",
					htmlContent = "",
					selected = false;

				html += '\
					<input class="input-filter" type="text" placeholder="' + settings.placeholder + '">\
					<ul class="list-group">\
				';

				for (var groupLoop = 0; groupLoop < settings.data.length; groupLoop++) {
					htmlContent = "";
					for (var groupDataLoop = 0; groupDataLoop < settings.config.length; groupDataLoop++) {
						if (typeof settings.config[groupDataLoop] === "function") {
							htmlContent += settings.config[groupDataLoop] (groupDataLoop, settings.data[groupLoop][groupDataLoop]);
						} else {
							switch (settings.config[groupDataLoop]) {
								case 'check':
									if (settings.data[groupLoop][groupDataLoop] === 1) {
										htmlContent += '<span data-index="' + groupDataLoop + '"><i class="color button-check checked"></i></span>';
										selected = true;
									} else {
										htmlContent += '<span data-index="' + groupDataLoop + '"><i class="color button-check"></i></span>';
										selected = false;
									}
								break;
								case 'value':
									htmlContent += '<span data-index="' + groupDataLoop + '" data-value="' + settings.data[groupLoop][groupDataLoop] + '" class="hide"></span>';
								break;
								case 'input':
									htmlContent += '<span data-index="' + groupDataLoop + '"><input type="text" id="list-input' + groupDataLoop + '" name="list-input' + groupDataLoop + '" value="' + settings.data[groupLoop][groupDataLoop] + '" class="right" /></span>';
								break;
								default:
									htmlContent += '<span data-index="' + groupDataLoop + '" class="' + settings.config[groupDataLoop] + '">' + settings.data[groupLoop][groupDataLoop] + '</span>';
								break
							}
						}
					};

					if (selected)
						html += '<li class="plain selected" data-index="' + groupLoop + '">';
					else
						html += '<li class="plain" data-index="' + groupLoop + '">';
					html += htmlContent;
					html += '</li>';
				};

				html +=  '\
					</ul>\
					<div class="info hide">' + settings.cantfind + '</div>\
				';

				if (settings.data.length === 0)
				html +=  '<div class="info">' + settings.empty + '</div>';

				elem.html (html);

				// Assign action to input box
				elem.find ('.input-filter').click(function () {
					$(this).focus ();
				}).bind ('input', function () {
					// TODO: Set 3 seconds timeout so it proccess less resources ?
					elem.filter($(this));
				});

				if (settings.multipleSelect) {
					elem.find ('li').click (function (target) {
						if (target.currentTarget === target.target || $(target.target).hasClass ("text") || $(target.target).hasClass ("button-check")) {
							$(this).toggleClass ("selected");
							$(this).find (".button-check").toggleClass ("checked");

							settings.onClick ($(this));
						}
					});
				} else {
					elem.find ('li').click (function (target) {
						if (target.currentTarget === target.target || $(target.target).hasClass ("text") || $(target.target).hasClass ("button-check")) {
							$(this).siblings ().removeClass ("selected");
							$(this).addClass ("selected");
							$(this).siblings ().find (".button-check").removeClass ("checked");
							$(this).find (".button-check").addClass ("checked");

							settings.onClick ($(this));
						}
					});
				}
			};

			// Filtering the list
			elem.filter = function (target) {
				var filterText = "",
					filterElement = elem.find('li .find:contains("' + target.val () + '")');

				if (target.val () !== "") {
					elem.find('li').addClass ('hide');
					elem.find('.info').addClass ('hide');

					filterElement.parent ().removeClass ('hide');

					// Highlight the filter result
					if (settings.highlight) {
						filterElement.each (function () {
							filterText = $(this).text ();
							filterText = filterText.replace(new RegExp(target.val (), 'gi'), '<strong>$&</strong>');
							$(this).html (filterText);
						});
					}

					if (filterElement.length === 0) {
						elem.find('.info').removeClass ('hide');
					}
				} else {
					// Unhighlight the filter result
					if (settings.highlight) {
						elem.find("li .find").each (function () {
							$(this).text ($(this).text());
						});
					}

					elem.find('li').removeClass ('hide');
					elem.find('.info').addClass ('hide');
				}
			};

			elem.draw ();
		});
	}
}(jQuery, window, document));
