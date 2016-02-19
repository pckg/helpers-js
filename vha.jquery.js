(function ($) {
    $.fn.vha = function (options) {
        var $this = $(this);
        $this.options = $.extend({}, options);

        $this.init = function () {
            $this.recalculate();
            $(window).on('resize', $this.handleWindowResize);
        };

        $this.recalculate = function () {
            $this.css('min-height', 'auto');
            var minHeight = 0;
            $this.each(function () {
                if ($(this).height() > minHeight) {
                    minHeight = $(this).height();
                }
            });
            $this.css('min-height', minHeight);
        };

        $this.handleWindowResize = function () {
            $this.recalculate();
        };

        $this.init();
    };
})(jQuery);