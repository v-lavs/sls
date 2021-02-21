/*
* to include js file write: `//= include ./path-to-file`
* */

//= include ../node_modules/jquery/dist/jquery.js ;
//= include ../../swiper-bundle.esm.browser.min.js ;


// CUSTOM SCRIPTS

$(document).ready(function () {
    let toggle = document.querySelector('.toggle-theme');

    toggle.addEventListener('click', function (e) {
        e.preventDefault();

        if (document.body.classList.contains('theme-is-black')) {
            document.body.classList.remove('theme-is-black');
        } else {
            document.body.classList.add('theme-is-black');

        }
    });

    // HEADER SCROLL

    function onHeaderScrol() {
        let scrolled = window.pageYOffset || document.documentElement.scrollTop;
        if (scrolled > 100) {
            $(".header").addClass('header_active');
        } else {
            $(".header").removeClass('header_active');
        }
    }

    $(document).on('scroll', function () {
        onHeaderScrol()
    });


    //MOBILE MENU
    let nav = $('.header__nav');

    $('.btn_burger').click(function (e) {
        e.preventDefault();
        nav.addClass('open-menu');
    });

    $('.btn_close, .backdrop').click(function (e) {
        e.preventDefault();
        nav.removeClass('open-menu');
    });


    let sliderReview = new Swiper('.slider-review', {
        slidesPerView: 1.5,
        slidesPerColumn:1,
        spaceBetween: 20,
        pagination: {
            el: '.block-nav-slider .swiper-pagination',
            type: 'fraction',
        },
        navigation: {
            nextEl: '.block-nav-slider .swiper-button-next',
            prevEl: '.block-nav-slider .swiper-button-prev',
        },
    });

    cssVars({
        watch: true,
    });

//    VIDEO YOUTYBE
    function findVideos() {
        let videos = document.querySelectorAll('.video');

        for (let i = 0; i < videos.length; i++) {
            setupVideo(videos[i]);
        }
    }

    function setupVideo(video) {
        let link = video.querySelector('.video__link');
        let media = video.querySelector('.video__media');
        let button = video.querySelector('.video__btn');
        let id = parseMediaURL(media);

        video.addEventListener('click', () => {
            let iframe = createIframe(id);

            link.remove();
            button.remove();
            video.appendChild(iframe);
        });

        link.removeAttribute('href');
        video.classList.add('video_enabled');
    }

    function parseMediaURL(media) {
        let regexp = /https:\/\/i\.ytimg\.com\/vi\/([a-zA-Z0-9_-]+)\/maxresdefault\.jpg/i;
        let url = media.src;
        let match = url.match(regexp);

        return match[1];
    }

    function createIframe(id) {
        let iframe = document.createElement('iframe');

        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('allow', 'autoplay');
        iframe.setAttribute('src', generateURL(id));
        iframe.classList.add('video__media');

        return iframe;
    }

    function generateURL(id) {
        let query = '?rel=0&showinfo=0&autoplay=1';

        return 'https://www.youtube.com/embed/' + id + query;
    }

    findVideos();
});

$(window).on('load resize', function () {

});