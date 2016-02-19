(function ($) {
    $.fn.responsify = function (options) {
        var $this = $(this);
        $this.options = $.extend({
            less: function () {
            },
            more: function () {
            },
            check: function () {
                return true;
            },
            breakpoint: null
        }, options);

        $this.currentDocumentWidth = window.innerWidth;
        $this.prevDocumentWidth = null;

        $this.init = function () {
            $(window).on('resize', $this.windowResizeHandler);
            $this.windowResizeHandler();
        };

        $this.windowResizeHandler = function () {
            if (!$this.options.check()) {
                return;
            }

            $this.currentDocumentWidth = window.innerWidth;

            if ($this.currentDocumentWidth <= $this.options.breakpoint && (!$this.prevDocumentWidth || $this.prevDocumentWidth > $this.options.breakpoint)) {
                $this.options.less($this);

            } else if ($this.currentDocumentWidth > $this.options.breakpoint && (!$this.prevDocumentWidth || $this.prevDocumentWidth <= $this.options.breakpoint)) {
                $this.options.more($this);

            }

            $this.prevDocumentWidth = $this.currentDocumentWidth;
        };

        if ($this.length == 1) {
            $this.init();
            return $this;

        } else if ($this.length > 1) {
            $this.each(function () {
                $(this).responsify($this.options);
            });

        }
    };
})(jQuery);