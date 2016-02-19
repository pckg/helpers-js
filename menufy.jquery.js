(function ($) {
    $.fn.menufy = function (options) {
        var $this = $(this);
        $this.options = $.extend({
            classOpen: 'open',
            eventOpen: 'click',
            selectorOpen: 'a.dropdown-toggle',
            hamburger: '.hamburger',
            openRecursively: false,
            minHeight: 0.0
        }, options || {});

        $this.linkClickHandler = function (e) {
            var $a = $(this);
            var $li = $a.closest('li');

            $li.toggleClass($this.options.classOpen);

            if ($li.hasClass($this.options.classOpen)) {
                if ($this.options.openRecursively) {
                    $this.openRecursively($li);
                }
                $this.closeSiblings($li);

                var minHeight = $this.options.minHeight;
                $this.find('ul').css('min-height', 'auto');
                $this.find('ul:visible').each(function () {
                    if ($(this).outerHeight() > minHeight) {
                        minHeight = $(this).outerHeight();
                    }
                }).css('min-height', minHeight + 'px');

            } else {
                $li.find('li').removeClass($this.options.classOpen);

            }

            e.preventDefault();
            return false;
        };

        $this.openRecursively = function ($li) {
            var $li = $li.find('li:first');
            if ($li.length) {
                $li.addClass($this.options.classOpen);
                $this.openRecursively($li);
            }
        };

        $this.closeRecursively = function ($li) {
            var $lis = $li.find('li');
            if ($lis.length) {
                $lis.removeClass($this.options.classOpen);
                $this.closeRecursively($lis);
            }
        };

        $this.closeSiblings = function ($li) {
            $li.siblings().not($li).removeClass($this.options.classOpen);
        };

        $this.closeAll = function () {
            $this.removeClass($this.options.classOpen);
            $this.find('li').removeClass($this.options.classOpen);
        };

        $this.bodyClickHandler = function (e) {
            if ($(e.target).closest('#' + $this.attr('id')).length == 0) {
                $this.closeAll();
            }
        };

        $this.hamburgerClickHandler = function (e) {
            $this.toggleClass($this.options.classOpen);
            $this.parent().find('.hamburger').toggleClass($this.options.classOpen);

            e.preventDefault();
            return false;
        };

        $this.find($this.options.selectorOpen).on($this.options.eventOpen, $this.linkClickHandler);
        $(document).on('click', $this.bodyClickHandler);
        $this.parent().find($this.options.hamburger).on($this.options.eventOpen, $this.hamburgerClickHandler);
    };
})(jQuery);