window.addEventListener('DOMContentLoaded', function(){
    const loader = document.querySelector('.loader-layout');
    const body = document.body;

    body.onload = function () {
        loader.classList.add('hide');
        body.classList.add('ready');
    }

    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('header a');

    for (const link of links) {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active');
        }
    }

});

