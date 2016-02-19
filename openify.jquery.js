(function ($) {
    $.fn.openify = function (options) {
        var $this = $(this);
        $this.options = $.extend({
            bodyClass: '',
            classes: '',
            trigger: '',
            run: function () {

            }
        }, options);

        $this.init = function () {
            $this.options.run();
            $('body').on('click', $this.handleBodyClick);
            $($this.options.trigger).on('click', $this.toggle);
        };

        $this.handleBodyClick = function (e) {
            if ($(e.target).closest($this.options.classes).length == 0) {
                $this.close();
            }
        };

        $this.open = function () {
            $("body").addClass($this.options.bodyClass);
        };

        $this.close = function () {
            $("body").removeClass($this.options.bodyClass);
        };

        $this.toggle = function () {
            $("body").toggleClass($this.options.bodyClass);
        };

        if ($this.length == 1) {
            $this.init();
            return $this;

        } else if ($this.length > 1) {
            $this.each(function () {
                $(this).openify($this.options);
            });

        }
    };
})(jQuery);