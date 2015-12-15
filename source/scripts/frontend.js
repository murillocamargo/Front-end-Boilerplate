(function ($) {

    var app = function () {
        this.body = $('body');

        var functionName = function () {
            console.log('Worked!');
        };

        functionName();
    };

    new app();
})(jQuery);