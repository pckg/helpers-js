$.fn.responsify = function (options) {
    var $this = $(this);
    $this.options = $.extend({
        method: 'detach'
    }, options);

    $this.currentDocumentWidth = $(window).width();
    $this.prevDocumentWidth = null;

    $this.init = function () {
        $(window).on('resize', $this.windowResizeHandler);
        $this.windowResizeHandler();
    };

    $this.windowResizeHandler = function () {
        if ($this.currentDocumentWidth <= $this.options.breakpoint && (!$this.prevDocumentWidth || $this.prevDocumentWidth > $this.options.breakpoint)) {
            $this.options.less($this);

        } else if ($this.currentDocumentWidth > $this.options.breakpoint && (!$this.prevDocumentWidth || $this.prevDocumentWidth <= $this.options.breakpoint)) {
            $this.options.more($this);

        }

        $this.prevDocumentWidth = $(window).width();
    };

    if ($this.length == 1) {
        $this.init();

    } else if ($this.length > 1) {
        $this.each(function () {
            $(this).responsify($this.options);
        });

    }
};