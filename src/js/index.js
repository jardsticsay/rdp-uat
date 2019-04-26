$(function(){
    var enterInput = document.getElementById("idn-input");
    enterInput.addEventListener("keyup", function(event){
        if (event.keyCode === 13){
            event.preventDefault();
            document.getElementById("registeridn").click();
        }
    });

    $('#idn-input').focus(function(){
        console.log('onfocus');
        $("body").addClass('u-oh');
        $('#footer').hide();
    })
    $('#idn-input').focusout(function(){
        console.log('outfocus');
        $("body").addClass('u-oh');
        $('#footer').show();
    })
});