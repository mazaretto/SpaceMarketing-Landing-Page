import * as jQuery from 'jquery'
import LIBS from './libs/lib.js'

(function ($) {
	window.$ = $
	LIBS($)
	const MyModal = {
		/* Developer: github.com/mazaretto */

		// prefix data-attribute
		prefix: 'data-modal',
		// setting delay where set display:none on modal
		timeClose: 400,
		// array of all modals
		modals: [],
		// callback methods (data-opts="callback=method_name")
		methods: {

		},
		// youtube url
		currentVideo: null,
		// youtube auto play string.
		currentVideoPlay: null,

		// if modal open, his function returns true
		isModalOpen (modal) {
			return modal.hasClass('modal_show')
		},
		// start video where opening modal
		startVideo (modal,video) {
			this.currentVideo = video.split('=')[1]
			this.currentVideoPlay = '?autoplay=1'
			let videoUrl = 'https://www.youtube.com/embed/' + this.currentVideo + this.currentVideoPlay

			modal.find('.modals').html(`<span class="close">X</span><iframe width="90%" height="90%" src="${videoUrl}" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`)
		},
		// stop video where modal is close
		stopVideo (modal) {
			modal.find('iframe').remove()
		},
		// open modal | modal - <jQuery object> 
		modalOpen (modal) {
			$('html,body').css({'overflow':'hidden'})

			if(modal.video) this.startVideo(modal,modal.video)

			this.open(modal)
			this.modals.push(modal)
			this.modalOptions(modal)
		},
		// sub function opening modal, !NOT ADDING MODAL ON *modals array*!
		open (modal) {
			let { formName } = modal 
			let { opts } = modal
			if (formName) modal.find('.form_name').val(formName).attr('value',formName)
			if (opts) this.convertOpts(modal,opts)

			modal.attr('style','display:flex;justify-content:center;align-items:center;')
			setTimeout(() => { modal.addClass('modal_show') }, this.timeClose)
		},
		// convert data-opts string to object.
		convertOpts (modal, opts) {
			let optsObject = {}
			opts = opts.split('&').map(opt => {
				return opt.split('=')
			}).forEach(item => {
				Object.assign(optsObject,{
					[item[0]]:item[1]
				})
			})
			modal.opts = optsObject

			this.verifyOPTS(modal)

			return modal
		},
		// checking opts
		verifyOPTS (modal) {
			const { opts } = modal
			const { callback } = opts

			if(callback) {
				try {
					this.methods[callback].call(this, opts, modal)
				} catch (e) {
					console.error('Callback method is not defined!')
				}
			}
		},
		// close on click, click on placeholder, pressing escape
		modalOptions (modal) {
			let last = this.modals[this.modals.length-1]
			let closeClick = last[0].querySelector('.close')
			closeClick.onclick =  () => {
				this.modalClose(last)
				closeClick.onclick = null
				return 
			}
			last[0].onclick = e => {
				try {
					if(e.target.className.indexOf('modal_wrapper') > -1) {
						this.modalClose(last)
						last[0].onclick = null
					}
				} catch (e) {}
				return 
			}
			document.body.onkeyup = e => {
				if(e.keyCode == 27) {
					let lastModal = this.modals[this.modals.length-1]
					this.modalClose(lastModal, modals => {
						if(modals.length <= 0) document.body.onkeyup = null
					})
				}
			}
			return 
		},
		// close modal (removing modal from *modals array*)
		modalClose (last,callback) {
			if( this.currentVideo ) {
				this.currentVideoPlay = '?autoplay=0'
				this.stopVideo(last)
			}

			return new Promise(resolve => {
				last.removeClass('modal_show')
				setTimeout(() => { 
					last.attr('style','')
					resolve()
				}, this.timeClose)
			}).then(() => {
				if($('.modal_show').length <= 0) {$('html,body').attr('style','')}
				this.modals.pop()
				if(callback) callback(this.modals)
			})
		},
		// close all modals
		allClose() {
			this.modals.forEach((n,i) => {
				n.removeClass('modal_show')
				setTimeout(() => { 
					n.attr('style','')
				}, this.timeClose)
				this.modals.splice(i,1)
			})
		},
		// initialization plugin
		init () {
			$(`*[${this.prefix}]`).click(e => {
				e.cancelBubble = true
				e.preventDefault()

				const target = e.currentTarget,
					  getModal = target.getAttribute(this.prefix),
				 	  currentModal = $(getModal),
					  formName = target.getAttribute('data-formname'),
					  opts = target.getAttribute('data-opts');

				currentModal.opts = opts
				currentModal.formName = formName
				currentModal.video = e.currentTarget.getAttribute('data-video')

				if(!this.isModalOpen(currentModal)) {
					this.modalOpen(currentModal)
				} else {
					this.modalClose(currentModal)
				}
				return
			})
		},
		// clearInputs from modal 
		clearInputs (modal) {
			modal.find('form input:not([type="submit"])').attr('value','').val('')
		} 
	}

	$('.modal_wrapper form').submit(function (e) {
		e.preventDefault();
		MyModal.allClose();

		const success = $(this).attr('data-success')
		MyModal.modalOpen($(success))
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

	MyModal.init();
})(jQuery)