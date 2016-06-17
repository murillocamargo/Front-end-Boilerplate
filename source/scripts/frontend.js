(function ($) {

    var app = function () {
        this.body = $('body');

        //CREATE FUNCTIONS FOR THE SITE
        var functionName = function () {
            console.log('Worked!');
        };

        //THEN ADD THEM TO THE RUN FUNCTION
        var run = function () {
            functionName();
        };

        run();
    };

    $(function () {
        app();
    });
})(jQuery);