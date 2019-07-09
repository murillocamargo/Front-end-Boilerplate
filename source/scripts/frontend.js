(function ($) {

    const app = function () {
        this.body = $('body');

        //CREATE FUNCTIONS FOR THE SITE
        const functionName = function () {
            console.log('Worked!');
        };

        //THEN ADD THEM TO THE RUN FUNCTION
        const run = function () {
            functionName();
        };

        run();
    };

    $(function () {
        app();
    });
})(jQuery);