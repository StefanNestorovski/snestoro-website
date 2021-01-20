$(document).ready(function(){
    
    //smooth scrolling -----------------------
    let scroll_link = $('.scroll-smooth');
    scroll_link.click(function(e){
        $('html, body').animate({
            scrollTop: $($(this).attr("href")).offset().top
        }, 300, 'swing');
    });
    
    
});