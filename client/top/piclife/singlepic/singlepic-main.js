define(function(require, exports, module) {
	require('bootstrap');
    require('header');
    
    var $ = require('jquery');
    $(document).ready(function () {
        $('.portfolio-link img').on("click", function () {
            $('#portfolioModal1 img').attr('src', $(this).attr('src').replace(/\/min\//, '/'));
        });
    });
});