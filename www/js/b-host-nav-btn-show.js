 $("body").scroll(function(){
                //prompt("hello");
                var scroll;
                scroll = -$('.hiw1').offset().top;
                if (scroll>=($('.hiw1').height()*0.5)){
                    btn_show(1);
                }else btn_show(0);
});
            
function btn_show(opt){
    var element = document.getElementById("bah-btn");
    if (opt==1){
        element.style.display='block';
    }else element.style.display='none';
}