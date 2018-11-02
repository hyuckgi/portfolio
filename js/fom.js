var fom = fom || {};

fom = {
	isMobile : function() {
		return Modernizr.mq( 'screen and (max-width:1024px)' ) ? true : false;
	},
	isSupport : function( prop ) {
		return Modernizr[ prop ];
	},
	removeScene : function( target ) {
		target.removeClass('enabled disabled');
	},
	enabledScene : function( target ) {
		target.addClass('enabled');
	},
	disabledScene : function( target ) {
		target.addClass('disabled');
	},
	activeNav : function() {
		var enabled = $('.scene.enabled:not(".disabled")');

		if ( ! fom.isMobile() ) {
			if ( enabled.attr('id') !== 'index') {
				$('#header').addClass('active');
			} else {
				$('#header').removeClass('active');
			};
		};
		$('#navigation ol li a').removeClass('active').filter( '.' + enabled.attr('id').replace(/\d+/g, '') ).addClass('active');
	},
	scene : function( args ) {
		var html = $('html'),
			scene = $('.scene'),
			enabled = scene.filter('.enabled'),
			direction = args.direction,
			target = ( args.target ) ? args.target : ( args.direction === 'up' ) ? enabled.prev('.scene') : enabled.next('.scene');


		if ( !target.length || target.is(enabled) || $('html.animate').length ) {
			return;
		};


		if ($('#work.enabled' ).length && ( (args.direction === 'down' && $('#work .tab a').index( $('#work .tab a.active') ) !== $('#work .tab a').length - 1) || (args.direction === 'up' && $('#work .tab a').index( $('#work .tab a.active') ) !== 0) ) ) {
			if ( args.direction === 'down' ) {
				$('#work .tab a.active').next().trigger('click');
			} else {
				$('#work .tab a.active').prev().trigger('click');
			};
			return;
		};

		if ($('#skill.enabled' ).length && ( (args.direction === 'down' && $('#skill .tab a').index( $('#skill .tab a.active') ) !== $('#skill .tab a').length -1) || (args.direction === 'up' && $('#skill .tab a').index( $('#skill .tab a.active') ) !== 0) ) ) {
			if ( args.direction === 'down' ) {
				$('#skill .tab a.active').next().trigger('click');
			} else {
				$('#skill .tab a.active').prev().trigger('click');
			};
			return;
		};


		var beforeScene = function() {
			html.addClass('animate');
			fom.disabledScene( enabled );
			fom.enabledScene( target );
			fom.activeNav();
			if ( enabled.find('video').length ) {
				document.getElementById( enabled.find('video').attr('id') ).pause();
			};
		};
		var afterScene = function() {
			if ( args.init ) {
				$('html').removeClass('init');
			};
			html.removeClass('animate');
			fom.removeScene( enabled );
			if ( target.find('video').length ) {
				document.getElementById( target.find('video').attr('id') ).play();
			};
		};

		if ( fom.isSupport('csstransitions') && ! fom.isMobile() ) {
			beforeScene();
			target.one('webkitTransitionEnd.fom msTransitionEnd.fom transitionend.fom', function() {
				$(this).unbind('webkitTransitionEnd.fom msTransitionEnd.fom transitionend.fom'); // �대깽�� 以묐났 諛⑹�
				afterScene();
			});
		} else {
			beforeScene();
			afterScene();
		};
	},
	init : function() {
		var scene = $('.scene');

		// load, resize
		$(window).on('load resize', function(e) {
			// move scroll
			$('html, body').scrollTop( $('.scene.enabled').offset().top );

			// navigation active
			if ( fom.isMobile() ) {
				$('#header').removeClass('active');
			} else {
				fom.activeNav();
			};

			// event
			$('#ev .bt').each(function() {
				if ( fom.isMobile() ) {
					$(this).attr('href', $(this).attr('data-mobile'));
				} else {
					$(this).attr('href', $(this).attr('data-pc'));
				};
			});
		});

		// navigation
		$('#header h1 a').click(function(e) {
			if ( fom.isMobile() || $('#index').is('.enabled') ) {
				$('#header').toggleClass('active');
			} else {
				$('#navigation li a').first().trigger('click');
			};
			e.preventDefault();
		});
		$('#header .sns > a').click(function(e) {
			$('#header .sns').toggleClass('active');
			e.preventDefault();
		});
		$('#navigation li a').not('.homepage').click(function(e) {
			if ( fom.isMobile() ) {
				$("html, body").animate({ scrollTop: $( $(this).attr("href") ).offset().top }, 500);
			} else {
				fom.scene({ 
					'target' : $( $(this).attr('href') )
				});
			};
			e.preventDefault();
		});
		$('#header').click(function(e) {
			if ( $( e.target ).is('#header') && fom.isMobile() ) {
				$('#header').removeClass('active');
				e.preventDefault();
			};
		});


		// swipe
		var swiperComplete = function() {
			var slide = $('.swiper-slide'),
				page = $('.swiper-pagination-switch');

			$('.scene-sub2').attr('id', 'enabledcontent' + $('.swiper-slide-active').attr('data-contentmap'));

			slide.each(function(index) {
				page.eq(index).addClass('contentmap' + $(this).attr('data-contentmap'));
			});

			for (var i = 1; i <= 5; i++) {
				page.filter( '.contentmap' + i ).each(function(index) {
					$(this).addClass('num' + ( index + 1 ) );
				});
			};
		};
		var swipe = $('.swiper-container').swiper({
			paginationClickable: true,
			centeredSlides: true,
			slidesPerView: 'auto',
			momentumBounce : false,
			onSwiperCreated : swiperComplete,
			onSlideReset : swiperComplete,
			onSlideChangeStart : function() {
				swiperComplete();

				var tab = $('#work .tab a.tab' + $('#work .swiper-slide-active').attr('data-contentmap'));
					tab2 = $('#skill .tab a.tab' + $('#skill .swiper-slide-active').attr('data-contentmap'));

				tab.addClass('active').siblings().removeClass('active');
				tab2.addClass('active').siblings().removeClass('active');
				$( tab.attr('href') ).addClass('active').siblings().removeClass('active');
				$( tab2.attr('href') ).addClass('active').siblings().removeClass('active');
			}
		});




		$('#work .swiper-button-prev button').on('click', function(e){
			e.preventDefault();
			var swiper = $('.swiper-container').data('swiper');
			swiper.swipePrev();
		});
		$('#work .swiper-button-next button').on('click', function(e){
			e.preventDefault();
			var swiper = $('.swiper-container').data('swiper');
			swiper.swipeNext();
		});
		$('.tab a').click(function(e) {
			$(this).addClass('active').siblings().removeClass('active');
			$( $(this).attr('href') ).addClass('active').siblings().removeClass('active');

			var swiper = $('.swiper-container').data('swiper'),
				index = $('.swiper-slide').index( $('.swiper-slide[data-contentmap="' + $(this).attr('href').split("app-content")[1] + '"]').eq(0) );

			swiper.swipeTo( index );
			e.preventDefault();
		}).eq(0).trigger('click');

		// bind scene
		scene.on('mousewheel', function(e, delta) {
			if ( fom.isMobile() ) {
				return;
			};

			var direction = (delta > 0) ? 'up' : 'down';

			fom.scene({ 
				'direction' : direction
			});
			e.preventDefault();
		});
		$(document).on('keydown.fom', function(e) {
			if ( fom.isMobile() ) {
				return;
			};

			var direction = ( e.keyCode === 38  ) ? 'up' : ( e.keyCode === 40  ) ? 'down' : '';

			if ( direction !== '' ) {
				fom.scene({ 
					'direction' : direction
				});
				e.preventDefault();
			};
		});
		var waypointsScene = scene.waypoint({
			handler: function(direction) {
				var enabled = ( direction === 'down' ) ? $( '#' + this.element.id ) : $( '#' + this.element.id ).prev('.scene');

				if ( fom.isMobile() ) {
					fom.scene({ 
						'target' : enabled
					});
				};
			},
			offset : '20%'
		});

		// object scrollspy
		var objSpy = $('#index .title, #index .day, #index .visual, #index .obj1, #index .obj2, #index .phone, #index .scroll, #index .download, #ev .title, #ev .txt, #ev .bt, #app .txt, #app #scene-sub2, #faq h2, #faq .tab, #faq .list, #footer');

		objSpy.on({
			'scrollSpy:enter' : function() {
				$(this).addClass('enter');
			},
			'scrollSpy:exit' : function() {
				$(this).removeClass('enter');
			}
		}).scrollSpy();


		// init
		fom.scene({ 
			'target' : $('#index'),
			'init' : true
		});
	}
};