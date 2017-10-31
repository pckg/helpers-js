(function ($) {
    $.fn.vha = function (options) {
        var $this = $(this);
        $this.options = $.extend({}, options);

        $this.init = function () {
            $this.recalculate();
            $(window).on('resize', $this.handleWindowResize);
        };

        $this.recalculate = function () {
            var $items = $($this.selector);
            $this.css('min-height', 'auto');
            var minHeight = 0;
            $items.each(function () {
                var h = parseInt($(this).outerHeight());
                if (h > minHeight) {
                    minHeight = h;
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