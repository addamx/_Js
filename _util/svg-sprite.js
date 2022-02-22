(function () {
    'use strict';
    var xhr = new XMLHttpRequest(),
        config = window.svgSpriteConfig,
        path = config.path,
        revision = config.revision,
        className = config.className;
    if (canWriteToLS() && isFileCached(revision)) {
        insertSvg(window.localStorage.getItem('inlineSVGdata'));
    } else {
        sendRequest();
    }

    function sendRequest() {
        xhr.open('GET', path, true);
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) {
                return;
            }
            if (xhr.status === 200) {
                var data = xhr.responseText;
                if (canWriteToLS()) {
                    window.localStorage.setItem('inlineSVGdata', data);
                    window.localStorage.setItem('inlineSVGRevision', revision);
                }
                insertSvg(data);
            } else {
                clearSvgLocalStorage(xhr.status, xhr.statusText);
            }
        };
    }

    function isFileCached(revision) {
        return window.localStorage.getItem('inlineSVGdata') && (window.localStorage.getItem('inlineSVGRevision') ===
            revision);
    }

    function insertSvg(svgData) {
        var svg, parser = new DOMParser();
        svg = parser.parseFromString(svgData, 'text/html').body.firstChild;
        svg.setAttribute('class', className);
        svg.style.display = 'none';
        document.body.insertBefore(svg, document.body.firstChild);
    }

    function clearSvgLocalStorage(status, statusText) {
        if (canWriteToLS()) {
            window.localStorage.removeItem('inlineSVGdata');
            window.localStorage.removeItem('inlineSVGRevision');
            console.warn(status + ' ' + statusText);
        }
    }

    function canWriteToLS() {
        try {
            window.localStorage.setItem('_canWriteToLS', 1);
            window.localStorage.removeItem('_canWriteToLS');
            return true;
        } catch (e) {
            return false;
        }
    }
}());