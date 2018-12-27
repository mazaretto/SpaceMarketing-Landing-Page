import * as jQuery from 'jquery'
import LIBS from './libs/lib.js'
import MyModal from './libs/MyModal.js'

(function ($) {
	window.$ = $
	LIBS($)


	MyModal.methods = {
		consultForm() {

		},
		projectPopup (e) {
			e.image = 'img/projects/' + e.image
			
			delete e.callback

			for(let i in e) {
				let el = document.getElementById(`project_${i}`)
				if(i === 'link') {
					el.innerHTML = e[i]
					el.href = e[i]
				} else if(i === 'image') {
					el.src = e[i]
				} else {
					el.innerHTML = e[i]
				}
			}
		} 
	}

	$('.modal_wrapper form').submit(function (e) {
		e.preventDefault();
		$.ajax({
			url: 'sendler.php',
			method:'POST',
			data: $(this).serialize()
		}).done(function(data) {
			if(data) {
				MyModal.allClose();

				const success = $(this).attr('data-success')
				MyModal.modalOpen($(success))
			}
		})
	})

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

	function dragMap () {
		var isDragging = false;
		$('.clients_world-map').mouseup(function () {
			isDragging = false
			document.querySelector('.clients_world-map').onmousemove = null
		})
		$('.clients_world-map img').each(function () {
			$(this).mousedown(function () {
				let t = $(this)
				isDragging = true
				if(isDragging) {
					document.querySelector('.clients_world-map').onmousemove = function (e) {
						if(isDragging) t.css({
							'left':`${((e.offsetX + e.clientX) - t.width()) / 25}%`,
							'top':`${((e.offsetY + e.clientY) - t.height()) / 25}%`
						})
					}
				}
				return
			})
		})

		$(window).keydown(e => {
			if(e.keyCode === 32) {
				let allStyles = ''
				$('.clients_world-map img').each(function () {
					allStyles += `#${$(this).attr('id')} { ${$(this).attr('style')} }`
				})
				console.log(allStyles)
			}
		})
	}

	function townDrag () {
		let townMessage = $('.town-message')
		function openTownMessage (html,position) {
			townMessage.find('b').html(html)

			let { pageX, pageY } = position

			pageX = pageX - townMessage.width()
			pageX = (pageX <= 0) ? 0 : pageX

			townMessage.css({
				'left':`${pageX}px`,
				'top':`${pageY + townMessage.height() + 20}px`
			})
			

		}

		function hideTownMessage () {
			townMessage.toggleClass('town-message-hidden')
		} 

		$('img[data-town]').hover(function (e) {
			hideTownMessage()
			if(e.type === 'mouseenter') {
				openTownMessage($(this).attr('data-town'), e)
			} 
		})
	}
	townDrag()
	MyModal.init();
})(jQuery)