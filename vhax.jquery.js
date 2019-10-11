(function ($) {
    $.fn.vhax = function (options) {
        var $this = $(this);
        $this.options = $.extend({}, options);

        $this.init = function () {
            $this.recalculate();
            $(window).on('resize', $this.handleWindowResize);
        };

        $this.recalculate = function () {
            var $items = $($this.selector);
            $items.css('min-height', 'auto');
            var minHeight = {};
            var offsetObjects = {};
            $items.each(function () {
                var offset = $(this).offset().top;

                if (typeof minHeight[offset] == 'undefined') {
                    minHeight[offset] = 0;
                    offsetObjects[offset] = [];
                }

                offsetObjects[offset].push($(this));

                if ($(this).innerHeight() > minHeight[offset]) {
                    minHeight[offset] = $(this).innerHeight();
                }
            });

            $.each(offsetObjects, function (offset, objects) {
                $.each(objects, function (i, object) {
                    object.css('min-height', minHeight[offset]);
                });
            });
        };

        $this.handleWindowResize = function () {
            $this.recalculate();
        };

        $this.init();
    };
})(jQuery);