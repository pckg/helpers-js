var devicify = {};

devicify.isAndroid = function () {
    return navigator.userAgent.match(/Android/i);
};

devicify.isIos = function () {
    return navigator.userAgent.match(/iPad|iPhone|iPod/i) && !window.MSStream;
};

devicify.isWP = function () {
    return navigator.userAgent.match(/Windows Phone/i);
};

devicify.isBlackberry = function () {
    return navigator.userAgent.match(/BlackBerry/i);
};