(function ($) {

    $.fn.developify = function () {
        var $this = $(this);

        $this.init = function () {
            $('body').append('<div class="developify" style="position: fixed; bottom: 0; left: 50%;"><div class="scroll"></div><div class="resize"></div></div>');

            $this.refreshAll();

            $(window).on('resize scroll', $this.refreshAll);
        };

        $this.refreshAll = function () {
            $this.windowResizeHandler();
            $this.windowScrollHandler();
        };

        $this.windowResizeHandler = function () {
            var build = '';

            build += '<p>jQuery Window: ' + $(window).width() + ' x ' + $(window).height() + '</p>';
            build += '<p>jQuery Document: ' + $(document).width() + ' x ' + $(document).height() + '</p>';
            build += '<p>Inner Window: ' + window.innerWidth + ' x ' + window.innerHeight + '</p>';
            build += '<p>Outer Window: ' + window.outerWidth + ' x ' + window.outerHeight + '</p>';

            $('.developify .resize').html(build);
        };

        $this.windowScrollHandler = function () {
            var build = '';

            build += '<p>Top: ' + $(window).scrollTop() + '</p>';

            $('.developify .scroll').html(build);
        };

        if (window.location.host.indexOf('.bojan.izdelava.') > 0) {
            $this.init();
        }

    };

})(jQuery);