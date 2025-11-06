(function () {
    'use strict';

    var conf = {};

    // Init functions, called on DOMContentLoaded event
    conf.init = function () {
        conf.map.init($('#map-canvas'));
        conf.menu.init();
        conf.mobileMenu.init();
        conf.scrollSpy.init();
    };

    /***
        Google Maps implementation
    ***/
    conf.map = {
        marker: '/img/marker-default.png'
    };

    // Google Maps configs
    conf.map.init = function ($element) {
        conf.map.element = $element;

        conf.map.geocoder = new google.maps.Geocoder();

        conf.map.latlng = new google.maps.LatLng(0, 0);

        conf.map.options = {
            zoom: 16,
            center: conf.map.latlng,
            scrollwheel: false,
            streetViewControl: true,
            labels: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        conf.map.canvas = new google.maps.Map(conf.map.element.get(0), conf.map.options);
        conf.map.canvas.setCenter(conf.map.latlng);

        conf.map.createMarker();
    };

    conf.map.createMarker = function () {
        
        conf.map.address = conf.map.element.attr('data-address');

        conf.map.geocoder.geocode({ 'address': conf.map.address}, function (results, status) {

            if (status === google.maps.GeocoderStatus.OK) {

                conf.map.canvas.setCenter(results[0].geometry.location);

                new google.maps.Marker({
                    map: conf.map.canvas,
                    position: results[0].geometry.location,
                    icon: conf.map.marker
                });
            } else {
                if (window.console) {
                    console.log('Google Maps was not loaded: ', status);
                }
            }
        });
    };

    /***
        Create animated scroll for menu links
    ***/
    conf.menu = {
        itemsSelector: '.nav-link[href^="#"]',
        animationSpeed: 400
    };

    conf.menu.init = function () {
        conf.menu.menuItems = $(conf.menu.itemsSelector);
        conf.menu.document = $('html, body');

        conf.menu.menuItems.on('click.animateScroll', function (event) {
            event.preventDefault();

            conf.menu.animateTo(event.target);
        });
    };

    conf.menu.animateTo = function (link) {

        var $link = $(link),
            href = $link.attr('href'),
            offSetTop = $(href).offset().top;

        conf.menu.document.finish().animate({scrollTop : offSetTop}, conf.menu.animationSpeed, function () {
            location.hash = href;
        });
    };

    /***
        Scroll spy functionality - highlights active section in nav
    ***/
    conf.scrollSpy = {};

    conf.scrollSpy.init = function () {
        var sections = $('section[id]');
        var navLinks = $('.nav-link');
        var scrollOffset = 100;

        if (sections.length === 0) return;

        // Update active nav link on scroll
        $(window).on('scroll', function () {
            var scrollPosition = $(window).scrollTop();
            var windowHeight = $(window).height();
            var documentHeight = $(document).height();

            // Check if we're at the bottom of the page
            var isAtBottom = scrollPosition + windowHeight >= documentHeight - 10;

            sections.each(function () {
                var section = $(this);
                var sectionTop = section.offset().top - scrollOffset;
                var sectionBottom = sectionTop + section.outerHeight();
                var sectionId = section.attr('id');

                if ((scrollPosition >= sectionTop && scrollPosition < sectionBottom) ||
                    (isAtBottom && section.is(':last-of-type'))) {
                    navLinks.removeClass('active');
                    $('.nav-link[href="#' + sectionId + '"]').addClass('active');
                }
            });
        });

        // Trigger scroll event on page load
        $(window).trigger('scroll');
    };

    /***
        Mobile menu toggle functionality
    ***/
    conf.mobileMenu = {};

    conf.mobileMenu.init = function () {
        var $toggle = $('.mobile-menu-toggle');
        var $menu = $('.nav-menu');
        var $navLinks = $('.nav-link');

        // Toggle menu on button click
        $toggle.on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).toggleClass('active');
            $menu.toggleClass('active');
            $('body').toggleClass('menu-open');
        });

        // Close menu when clicking on a nav link
        $navLinks.on('click', function () {
            $toggle.removeClass('active');
            $menu.removeClass('active');
            $('body').removeClass('menu-open');
        });

        // Close menu when clicking outside
        $(document).on('click', function (e) {
            if (!$(e.target).closest('nav').length && $menu.hasClass('active')) {
                $toggle.removeClass('active');
                $menu.removeClass('active');
                $('body').removeClass('menu-open');
            }
        });

        // Handle touch events for better mobile experience
        var touchStartX = 0;
        var touchEndX = 0;

        $(document).on('touchstart', function (e) {
            touchStartX = e.touches[0].clientX;
        });

        $(document).on('touchend', function (e) {
            touchEndX = e.changedTouches[0].clientX;
            handleSwipe();
        });

        function handleSwipe() {
            // Swipe left to close menu (when menu is open and swipe > 50px)
            if (touchStartX - touchEndX > 50 && $menu.hasClass('active')) {
                $toggle.removeClass('active');
                $menu.removeClass('active');
                $('body').removeClass('menu-open');
            }
            // Swipe right to open menu (when menu is closed, swipe starts near edge, and swipe > 50px)
            if (touchEndX - touchStartX > 50 && !$menu.hasClass('active') && touchStartX < 50) {
                $toggle.addClass('active');
                $menu.addClass('active');
                $('body').addClass('menu-open');
            }
        }
    };

    conf.init();
}());