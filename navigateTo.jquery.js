(function ($) {
    $.fn.navigateTo = function (options) {
        var $this = $(this);
        $this.options = $.extend({
            duration: 333
        }, options);

        $this.init = function () {
            $this.on('click', $this.handleClick);
        };

        $this.handleClick = function (event) {
            event.preventDefault();

            $('html, body').stop().animate({
                scrollTop: $($this.attr('data-destination')).offset().top
            }, $this.options.duration);

            return false;
        };

        if ($this.length == 1) {
            // initialize single instance
            $this.init();

        } else if ($this.length > 1) {
            // initialize multiple instances
            $this.each(function () {
                $(this).navigateTo($this.options);
            });

        }
    };
})(jQuery);