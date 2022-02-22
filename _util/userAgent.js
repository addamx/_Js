var isMobile = {
    Android: function () {
        return (navigator.userAgent.match(/Android/i) && navigator.userAgent.match(/Mobile/i));
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iPhone: function () {
        return navigator.userAgent.match(/iPhone|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iPhone() || isMobile.Opera() || isMobile.Windows());
    }
};

var isTablet = {
    Tablet: function () {
        return (navigator.userAgent.match(/Android/i) && (!navigator.userAgent.match(/Mobile/i)));
    },
    iPad: function () {
        return navigator.userAgent.match(/iPad/i);
    },
    any: function () {
        return (isTablet.Tablet() || isTablet.iPad());
    }
};

return {
    isMobile: function () {
        return !!isMobile.any();
    },

    withMobile: isMobile,

    isTablet: function () {
        return !!isTablet.any();
    },

    withTablet: isTablet
}