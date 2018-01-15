/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	skel.breakpoints({
		xlarge:		'(max-width: 1680px)',
		large:		'(max-width: 1280px)',
		medium:		'(max-width: 980px)',
		small:		'(max-width: 736px)',
		xsmall:		'(max-width: 480px)',
		xxsmall:	'(max-width: 360px)'
	});

	$(function() {

		var	$window = $(window),
			$body = $('body'),
			$wrapper = $('#wrapper'),
			$header = $('#header'),
			$footer = $('#footer'),
			$main = $('#main'),
			$main_articles = $main.children('article');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 100);
			});

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Fix: Flexbox min-height bug on IE.
			if (skel.vars.IEVersion < 12) {

				var flexboxFixTimeoutId;

				$window.on('resize.flexbox-fix', function() {

					clearTimeout(flexboxFixTimeoutId);

					flexboxFixTimeoutId = setTimeout(function() {

						if ($wrapper.prop('scrollHeight') > $window.height())
							$wrapper.css('height', 'auto');
						else
							$wrapper.css('height', '100vh');

					}, 250);

				}).triggerHandler('resize.flexbox-fix');

			}

		// Nav.
			var $nav = $header.children('nav'),
				$nav_li = $nav.find('li');

			// Add "middle" alignment classes if we're dealing with an even number of items.
				if ($nav_li.length % 2 == 0) {

					$nav.addClass('use-middle');
					$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');

				}

		// Main.
			var	delay = 325,
				locked = false;

			// Methods.
				$main._show = function(id, initial) {

					var $article = $main_articles.filter('#' + id);

					// No such article? Bail.
						if ($article.length == 0)
							return;

					// Handle lock.

						// Already locked? Speed through "show" steps w/o delays.
							if (locked || (typeof initial != 'undefined' && initial === true)) {

								// Mark as switching.
									$body.addClass('is-switching');

								// Mark as visible.
									$body.addClass('is-article-visible');

								// Deactivate all articles (just in case one's already active).
									$main_articles.removeClass('active');

								// Hide header, footer.
									$header.hide();
									$footer.hide();

								// Show main, article.
									$main.show();
									$article.show();

								// Activate article.
									$article.addClass('active');

								// Unlock.
									locked = false;

								// Unmark as switching.
									setTimeout(function() {
										$body.removeClass('is-switching');
									}, (initial ? 1000 : 0));

								return;

							}

						// Lock.
							locked = true;

					// Article already visible? Just swap articles.
						if ($body.hasClass('is-article-visible')) {

							// Deactivate current article.
								var $currentArticle = $main_articles.filter('.active');

								$currentArticle.removeClass('active');

							// Show article.
								setTimeout(function() {

									// Hide current article.
										$currentArticle.hide();

									// Show article.
										$article.show();

									// Activate article.
										setTimeout(function() {

											$article.addClass('active');

											// Window stuff.
												$window
													.scrollTop(0)
													.triggerHandler('resize.flexbox-fix');

											// Unlock.
												setTimeout(function() {
													locked = false;
												}, delay);

										}, 25);

								}, delay);

						}

					// Otherwise, handle as normal.
						else {

							// Mark as visible.
								$body
									.addClass('is-article-visible');

							// Show article.
								setTimeout(function() {

									// Hide header, footer.
										$header.hide();
										$footer.hide();

									// Show main, article.
										$main.show();
										$article.show();

									// Activate article.
										setTimeout(function() {

											$article.addClass('active');

											// Window stuff.
												$window
													.scrollTop(0)
													.triggerHandler('resize.flexbox-fix');

											// Unlock.
												setTimeout(function() {
													locked = false;
												}, delay);

										}, 25);

								}, delay);

						}

				};

				$main._hide = function(addState) {

					var $article = $main_articles.filter('.active');

					// Article not visible? Bail.
						if (!$body.hasClass('is-article-visible'))
							return;

					// Add state?
						if (typeof addState != 'undefined'
						&&	addState === true)
							history.pushState(null, null, '#');

					// Handle lock.

						// Already locked? Speed through "hide" steps w/o delays.
							if (locked) {

								// Mark as switching.
									$body.addClass('is-switching');

								// Deactivate article.
									$article.removeClass('active');

								// Hide article, main.
									$article.hide();
									$main.hide();

								// Show footer, header.
									$footer.show();
									$header.show();

								// Unmark as visible.
									$body.removeClass('is-article-visible');

								// Unlock.
									locked = false;

								// Unmark as switching.
									$body.removeClass('is-switching');

								// Window stuff.
									$window
										.scrollTop(0)
										.triggerHandler('resize.flexbox-fix');

								return;

							}

						// Lock.
							locked = true;

					// Deactivate article.
						$article.removeClass('active');

					// Hide article.
						setTimeout(function() {

							// Hide article, main.
								$article.hide();
								$main.hide();

							// Show footer, header.
								$footer.show();
								$header.show();

							// Unmark as visible.
								setTimeout(function() {

									$body.removeClass('is-article-visible');

									// Window stuff.
										$window
											.scrollTop(0)
											.triggerHandler('resize.flexbox-fix');

									// Unlock.
										setTimeout(function() {
											locked = false;
										}, delay);

								}, 25);

						}, delay);


				};

			// Articles.
				$main_articles.each(function() {

					var $this = $(this);

					// Close.
						$('<div class="close">Close</div>')
							.appendTo($this)
							.on('click', function() {
								location.hash = '';
								draw.remove()

							});

					// Prevent clicks from inside article from bubbling.
						$this.on('click', function(event) {
							event.stopPropagation();
							draw.remove()
						});

				});

			// Events.
				$body.on('click', function(event) {

					// Article visible? Hide.
						if ($body.hasClass('is-article-visible'))
							$main._hide(true);
							draw.remove()

				});

				$window.on('keyup', function(event) {

					switch (event.keyCode) {

						case 27:

							// Article visible? Hide.
								if ($body.hasClass('is-article-visible')){
									$main._hide(true);
									draw.remove()
								}

							break;

						default:
							break;

					}

				});

				$window.on('hashchange', function(event) {

					// Empty hash?
						if (location.hash == ''
						||	location.hash == '#') {

							// Prevent default.
								event.preventDefault();
								event.stopPropagation();

							// Hide.
								$main._hide();
								draw.remove()

						}

					// Otherwise, check for a matching article.
						else if ($main_articles.filter(location.hash).length > 0) {

							// Prevent default.
								event.preventDefault();
								event.stopPropagation();

							// Show article.
								$main._show(location.hash.substr(1));
								drawDashBoard()
						}

				});

			// Scroll restoration.
			// This prevents the page from scrolling back to the top on a hashchange.
				if ('scrollRestoration' in history)
					history.scrollRestoration = 'manual';
				else {

					var	oldScrollPos = 0,
						scrollPos = 0,
						$htmlbody = $('html,body');

					$window
						.on('scroll', function() {

							oldScrollPos = scrollPos;
							scrollPos = $htmlbody.scrollTop();

						})
						.on('hashchange', function() {
							$window.scrollTop(oldScrollPos);
						});

				}

			// Initialize.

				// Hide main, articles.
					$main.hide();
					$main_articles.hide();

				// Initial article.
					if (location.hash != ''
					&&	location.hash != '#')
						$window.on('load', function() {
							$main._show(location.hash.substr(1), true);
						});

	});

})(jQuery);


var draw = null

function drawDashBoard(){



	draw = SVG('drawing').size('100%', '100%')
	var rect = draw.rect(800, 150).fill('#ffffff')
	//rect.radius(10,10)
	
	var rect1 = draw.rect(20, 25).fill('#28b43c').move(20,40)
	var rect2 = draw.rect(20, 25).fill('#28b43c').move(20,70)
	var rect3 = draw.rect(20, 25).fill('#28b43c').move(20,40)
	var rect4= draw.rect(70,30).fill('#28b43c').move(20,40)
	var rect8 = draw.rect(20, 25).fill('#28b43c').move(20,40)
	
	var rect5 = draw.rect(155, 30).fill('#28b43c').move(630,rect.cy())
	var rect6 = draw.rect(155, 30).fill('#28b43c').move(630,rect.cy())
	var rect7 = draw.rect(155, 30).fill('#28b43c').move(630,rect.cy())


	//var circle = draw.circle(0).fill('#28b43c').move(600,rect.cy())
	var circle = draw.circle(0).fill("#ffffff").stroke({ color: '#28b43c', width: 5}).move(460,rect.cy()+10)
	var inner_circle = draw.circle(50).fill("#ffffff").stroke({ color: '#28b43c', width: 1}).center(circle.cx(),circle.cy())
	//var inner_circle = draw.circle(0).fill('#ffffff').move(600,rect.cy())
	var small_circle1 = draw.circle(30).fill("#ffffff").stroke({ color: '#28b43c', width: 20}).center(circle.cx(),circle.cy())
	var small_circle3 = draw.circle(30).fill("#ffffff").stroke({ color: '#28b43c', width: 20}).move(0,0)
	var small_circle2 = draw.circle(40).fill("#ffffff").stroke({ color: '#28b43c', width: 20}).center(circle.cx(),circle.cy())
	var text = draw.text('spacetimeAthleta').move(0,125)
	text.font({ fill: '#28b43c', famliy:"Sans"})

	var line = draw.line().stroke({ color: '#28b43c', width: 10, linecap: 'round' }).move(0,40)

	
	var barline1 = draw.line().stroke({ color: '#28b43c', width: 15, linecap: 'round' }).move(325,150)
	var barline2 = draw.line().stroke({ color: '#28b43c', width: 15, linecap: 'round' }).move(345,150)
	var barline3 = draw.line().stroke({ color: '#28b43c', width: 15, linecap: 'round' }).move(365,150)

	var barline4 = draw.line().stroke({ color: '#28b43c', width: 15, linecap: 'round' }).move(245,150)
	var barline5 = draw.line().stroke({ color: '#28b43c', width: 15, linecap: 'round' }).move(265,150)
	var barline6 = draw.line().stroke({ color: '#28b43c', width: 15, linecap: 'round' }).move(285,150)
	var barline7 = draw.line().stroke({ color: '#28b43c', width: 15, linecap: 'round' }).move(305,150)


	barline4.animate(3000).plot([[245, 150], [245, 80]])
	barline5.animate(1500).plot([[265, 150], [265, 100]])
	barline6.animate(2500).plot([[285, 150], [285, 60]])
	line.animate(2500).plot([[0, 20], [790, 20]])
	barline7.animate(3000).plot([[305, 150], [305, 90]])
	barline1.animate(2500).plot([[325, 150], [325, 60]])
	barline2.animate(1500).plot([[345, 150], [345, 40]])
	barline3.animate(3000).plot([[365, 150], [365, 80]])

	rect2.animate(2500).move(45,40)
	rect3.animate(2500).move(20,70)
	rect4.animate(2500).move(20,70)
	rect8.animate(2500).move(70,40)

	rect5.animate(2500).move(630,rect.cy()+35)
	rect7.animate(2500).move(630,rect.cy()-35)

	inner_circle.animate(2500).radius(40)
	circle.animate(2500).radius(50)
	small_circle1.animate(2000).center(560,55)
	small_circle2.animate(2000).center(560,115)
	small_circle3.animate(2000).center(160,70)
	text.animate(2500).move(10,120)



}