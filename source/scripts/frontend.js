(function ($) {

    const app = () => {
        this.body = $('body');

        //CREATE FUNCTIONS FOR THE SITE
        const functionName = () => {
            console.log('Worked!');
        };

        //THEN ADD THEM TO THE RUN FUNCTION
        const run = () => {
            functionName();
        };

        run();
    };

    $(function () {
        app();
    });
})(jQuery);