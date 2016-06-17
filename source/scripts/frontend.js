(function ($) {

    var app = function () {
        this.body = $('body');

        //
        var functionName = function () {
            console.log('Worked!');
        };

        var run = function () {
            functionName();
        };

        run();
    };

    $(function () {
        app();
    });
})(jQuery);