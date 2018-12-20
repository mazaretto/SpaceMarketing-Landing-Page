import * as jQuery from 'jquery'
import LIBS from './libs/lib.js'

(function ($) {
	window.$ = $
	LIBS($)

	$('.our_projects__slider,.partners__slider').slick({
		arrows: false,
		dots: false,
		loop: false,
		infinite: false
	})

	$('.cms_systems__slider').slick({
		arrows: false,
		dots: false,
		loop: false,
		slidesToScroll: 6,
		infinite: false,
		slidesToShow: 6,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 3,
				}
			},
			{
				breakpoint: 500,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
				}
			}
		]
	})


	$('.arrows__left').click(function () {
		$($(this).attr('data-carousel')).slick("slickPrev");
	})
	$('.arrows__right').click(function () {
		$($(this).attr('data-carousel')).slick("slickNext");
	})
})(jQuery)