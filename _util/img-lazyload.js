window.onload = function () {
  var placeholders = document.querySelectorAll('.img-placeholder');

  [].forEach.call(placeholders, function (el, i) {
    var small = el.querySelector('.img-small')
    var img = new Image();
    img.src = small.src;
    img.onload = function () {
      small.classList.add('loaded');
    };

    // load large image
    var imgLarge = new Image();
    imgLarge.src = el.dataset.large;
    imgLarge.onload = function () {
      el.removeChild(small);
      el.parentNode.style.backgroundImage = 'url(' + el.dataset.large + ')';
    };

  });
}
