(function ($) {
    $.fn.movify = function (options) {
        var $this = $(this);
        $this.options = $.extend({
            selector: '',
            class: '',
            target: '',
            action: ''
        }, options);

        $this.init = function () {
            var detached = $($this.options.selector).detach();
            detached[$this.options.action + 'Class']($this.options.class);
            $($this.options.target).append(detached);
        };

        $this.init();
        return $this;
    };
})(jQuery);