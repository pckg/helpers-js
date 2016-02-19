(function ($) {
    $.fn.heighten = function (options) {
        var $this = $(this);
        $this.options = $.extend({}, options || {});

        $this.windowResizeHandler = function (e) {
            $.each($this.options.subItemSelectors, function (i, subItem) {
                var height = 0;
                // reset height
                $this.find($this.options.itemSelector + ' ' + subItem).css('min-height', '0px');

                // find max height
                $this.find($this.options.itemSelector + ' ' + subItem).each(function () {
                    var $subItem = $(this);
                    if ($subItem.outerHeight() > height) {
                        height = $subItem.outerHeight();
                    }
                });

                // set height
                $this.find($this.options.itemSelector + ' ' + subItem).css('min-height', height + 'px');
            });
            $this.find($this.options.itemSelector).each(function () {
                var $item = $(this);
            });
        };

        $(window).on('resize', $this.windowResizeHandler);
        $this.windowResizeHandler();
    };
})(jQuery);