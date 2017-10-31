(function ($) {
    $.fn.idify = function () {
        var $this = $(this);

        $this.init = function () {
            if (!$this.attr('id')) {
                $this.attr('id', 'idify-' + parseInt(Math.random() * 1000000) % 1000000);
            }
        };

        $this.init();
    };
})(jQuery);