(function (factory, jQuery, Zepto) {

	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports === 'object' && typeof Meteor === 'undefined') {
		module.exports = factory(require('jquery'));
	} else {
		factory(jQuery || Zepto);
	}

}(function ($) {
	'use strict';

	$.fn.exists = function () {
		return this.length !== 0;
	};

	var sliderInterval;
	var $mainImageMenu;
	var interval = 3;

	var startSlider = function() {
		sliderInterval = setInterval(function(){
			var $liActive = $mainImageMenu.find('li.active');
			var $liNext = $liActive.next().exists() ? $liActive.next() : $mainImageMenu.find('li').first();
			$liActive.removeClass('active');
			$liNext.addClass('active');
		}, interval * 1000);
	};

	$(document).on('mousemove', '.main-image-menu li', function(){
		window.clearInterval(sliderInterval);
		$mainImageMenu.find('li.active').removeClass('active');
		$(this).addClass('active');
	});

	$(document).on('mouseout', '.main-image-menu li', function(){
		startSlider();
	});

	$(document).on('click', '.dropdown-filters', function (e) {
		e.stopPropagation();
	});

	$(document).on('click', '.rating-stars-container .fa-star', function(e) {
		var $this = $(this);
		var $ratingStarsBlock = $this.closest('.rating-stars-block');
		var $ratingStars = $ratingStarsBlock.find('.rating-stars');
		$ratingStars.val($this.attr('data-rating'));
		e.stopPropagation();
		return false;
	});

	var detectMainReviews = function() {
		var windowWidth = $(window).width();
		var $mainReviews = $('.main-reviews');

		if ($mainReviews.exists()) {
			if (windowWidth < 768) {
				$mainReviews.slick({
					centerMode: true
				});
			} else {
				$mainReviews.slick('unslick');
			}
		}
	};

	$(window).on('resize', function(){
		detectMainReviews();
	});


	$(function () {
		$mainImageMenu = $('.main-image-menu');
		if ($mainImageMenu.exists()) {
			startSlider();
		}

		detectMainReviews();

		var $cloneSearch = $('#search').clone();

		$('[data-toggle="popover"]').popover({
			content: $cloneSearch.html(),
			sanitize: false,
			html: true,
			customClass: 'd-md-none'
		});

		if ($('.contacts-map').exists()) {
			var cities = L.layerGroup();

			var LeafIcon = L.Icon.extend({
				options: {
					iconSize: [16, 23],
					iconAnchor: [16, 23],
					popupAnchor: [-8, 0]
				}
			});

			var markerIcon = new LeafIcon({iconUrl: '../images/marker-icon.png'});

			var mbAttr = '',
				mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

			var grayscale = L.tileLayer(mbUrl, {
					id: 'mapbox/light-v9',
					tileSize: 512,
					zoomOffset: -1,
					attribution: mbAttr
				}),
				streets = L.tileLayer(mbUrl, {
					id: 'mapbox/streets-v11',
					tileSize: 512,
					zoomOffset: -1,
					attribution: mbAttr
				});

			var map = L.map('map', {
				center: [49.2118017, 31.8512216],
				zoom: 12,
				layers: [grayscale, cities],
				zoomControl: false
			});

			var marker = L.marker([49.2118017, 31.8512216], {icon: markerIcon}).addTo(map);
		}

		var $productFullImage = $('.product-full-image');
		var $productThumbs = $('.product-thumbs');

		if ($productFullImage.exists() && $productThumbs.exists()) {
			$productFullImage.slick({
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: false,
				fade: true,
				asNavFor: '.product-thumbs'
			});
			$productThumbs.slick({
				slidesToShow: 4,
				slidesToScroll: 1,
				asNavFor: '.product-full-image',
				dots: false,
				centerMode: true,
				focusOnSelect: true,
				vertical: true,
				verticalSwiping: true
			})
		}
	});
}, window.jQuery, window.Zepto));
