import * as jQuery from 'jquery'
import LIBS from './libs/lib.js'
import MyModal from './libs/MyModal.js'
import WOW from 'wow.js'

(function ($) {
	window.$ = $
	LIBS($)


	MyModal.methods = {
		consultForm(e,modal) {
			const MessageInput = 'Заявка на консультацию'

			modal.find('input[type="hidden"]').val(MessageInput).attr('value',MessageInput)
			modal.find('h5').html('Отправьте заявку')
			modal.find('.consult_text').html('Мы перезвоним и<br/>проконсультируем Вас')

			modal.find('form').attr('data-metrika-target', 'CONSULT_FORM')
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
		},
		mapCallback(opts,modal) {
			const { target } = modal
			const MessageInput = 'Открытие филиала в ' + target.getAttribute('data-town')

			modal.find('input[type="hidden"]').val(MessageInput).attr('value',MessageInput)
			modal.find('h5').html('Хотите открыть маркетинговое агентство в своем городе?')
			modal.find('.consult_text').html('Получите предложение по франшизе маркетингового агентства')

			modal.find('form').attr('data-metrika-target', 'OPEN_FRANSH')
		},
		filialModal (opts, modal) {
			const MessageInput = 'Открытие филиала Expert Marketing'

			modal.find('input[type="hidden"]').val(MessageInput).attr('value',MessageInput)
			modal.find('h5').html('Хотите открыть маркетинговое агентство в своем городе?')
			modal.find('.consult_text').html('Получите предложение по франшизе маркетингового агентства')

			modal.find('form').attr('data-metrika-target', 'OPEN_FRANSH')
		}
	}

	$('.modal_wrapper form').submit(function (e) {
		e.preventDefault();
		const $t = $(this),
			  success = $t.attr('data-success'),
			  MetrikaTarget = $t.attr('data-metrika-target')
		$.ajax({
			url: 'sendler.php',
			method:'POST',
			data: $t.serialize()
		}).done(function(data) {
			if(data) {
				// активация цели
				yaCounter51758717.reachGoal(MetrikaTarget)
				// закрываем все модальные окна
				MyModal.allClose();
				// очищаем inputs у текущей модалки.
				MyModal.clearInputs($t.parent())
				// открываем окно СПАСИБО
				MyModal.modalOpen($(success))
			}
		})
	})

	// активация слайдера ПРОЕКТОВ и Парнтенров
	$('.our_projects__slider, .partners__slider').slick({
		arrows: false,
		dots: false,
		infinite: true
	})

	// Активация слайдера НАШИ КЛИЕНТЫ
	$('.cms_systems__slider').slick({
		arrows: false,
		dots: false,
		slidesToScroll: 6,
		infinite: true,
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


	// Trigger методы на стрелочки.
	$('.arrows__left').click(function () {
		$($(this).attr('data-carousel')).slick("slickPrev");
	})
	$('.arrows__right').click(function () {
		$($(this).attr('data-carousel')).slick("slickNext");
	})


	// Автоматическое проставление меток на карте(drag and drop)
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

	// Аниация космонафта
	function cosmonaftAnimation (el,dist) {
		dist = dist/10

		let posX = (window.innerWidth > 1200) ? -dist : dist

		el.css({
			'margin-left':`${dist}px`,
			'margin-top':`-${dist}px`
		})
	}

	// Анимация ракеты
	function rocketAnimation (el,dist) {
		dist = dist/10

		el.css({
			'margin-top':`-${dist}px`,
			'margin-left':`-${dist}px`
		})
	}

	// Получить дистанцию от y1 до y2
	function getDistance(y1,y2) {
		return y1-y2
	}

	// scroller, прокручивается от скролла страницы
	function scrollerChecker () {
		let scroller = $('.scrollerChecker')
		let rocket = $('.we_know-rocket-this')
		let cosmonaft = $('.every_day-cosmonaft__container img').first()
		$(window).scroll(e => {
			let y = window.scrollY + window.innerHeight - scroller.height()

			if(y > 5000) return

			scroller.css({ 'top':y+'px' })

			let distRocket = getDistance(y, rocket.offset().top),
				distCosmonaft = getDistance(y, cosmonaft.offset().top)
			if(distRocket > -150 && distRocket <= 1100) {
				rocketAnimation(rocket, distRocket)
			} 

			if(distCosmonaft > -150 && distCosmonaft <= 1100) {
				cosmonaftAnimation(cosmonaft,distCosmonaft)
			}
		})
	}

	// всплывающая подсказка на карте
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

	// активация подсказки на карте
	townDrag()
	// активация плагина модального окна
	MyModal.init();
	// активация WOW>jS
	new WOW().init()
	// активация ScrollChecker
	scrollerChecker()

	dragMap()
})(jQuery)