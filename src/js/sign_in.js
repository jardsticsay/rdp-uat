var apiUrl = "https://cors-destroyer.herokuapp.com/http://112.206.234.26/SwissKnife_dev_stage/index.cgi";
var username = "retcon";
var password = "R3tC0N";
var actionPoint = "http://127.0.0.1/SwissKnife_dev_stage/databank.cgi";
var xhr = new  XMLHttpRequest();
var parseData =[];
var parseUpdate =[];
var registered_booth=[];
var existing=[];
var booth_Status=[];
var completed_Array=[];
var nofinaldup1=[];
var natconUpdate_Array=[];
var existingMobile;
var idnInput;
var fName;
var lName;
var idcontrolNumber;
var firstname;
var lastname;
var booth_number = "Booth0|";
var booth_number1 = "Booth1|";
var booth_number2 = "Booth2|";
var booth_number3 = "Booth3|";
var booth_number4 = "Booth4|";
var booth_number5 = "Booth5|";
var retailer_number;
var session_mobile_number;
var retailer_name;
var ffname;
var getID;
var IDMN;
var retailer_MIN;
var local_IDCN;
var firstParse;
var firstId;
var convertComma;
var checkFinalId;
var checkFinalBoothCount;
var entryFName;


$(function(){
   var dataOutput = function(){
        $.each(parseData, function(key, value){
            if(key == 'methodResponse'){
                fName = value.queryList[0].field7;
                lName = value.queryList[0].field8;
                idcontrolNumber = value.queryList[0].field1;
                session_mobile_number = value.queryList[0].field11;
                localStorage.setItem(retailer_MIN, idcontrolNumber);
                console.log(localStorage.getItem(retailer_MIN));
                firstname = document.createTextNode(fName);
                if(value.queryList[0].error){
                    $('#sign-up').hide();
                    $('#error').removeAttr('hidden');
                    $('.login-again').removeAttr('hidden');
                    $('.lds-ripple').attr('hidden','');
                }else {
                    $('#sign-up').hide();
                    $('#registered').removeAttr('hidden');
                    $('#free-stamp').removeAttr('hidden');
                    $('.lds-ripple').attr('hidden','');
                    document.getElementById('first-name').appendChild(firstname);
                    stampData();
                }
                
            }
        })
    }

    
    var matchInput = function(){
        var dataToPass = {
            "method":"searcHTwoField",
            "data":{
                "table":"SMART-natcon",
                "field1":"field1",
                "value1":idnInput,
                "operator":"AND",
                "field2":"field1",
                "value2":idnInput
            }
        }
        $.ajax({
            type:"POST",
            url: apiUrl,
            contentType: "json",
            data: JSON.stringify(dataToPass
            ),
            beforeSend: function(xhr){
                xhr.setRequestHeader ("Basic", btoa(username + ":" + password));
                xhr.setRequestHeader ("Action", actionPoint);
            },
            success: function(response){
                parseData = JSON.parse(response);
                dataOutput();
            },
            error: function(errorThrown){
                console.log(errorThrown);
                alert('Network error! Reload page');
                location.reload();
            },
            aync:false
        });
    }



    $('#registeridn').click(function(){
        idnInput = $('#idn-input').val();
        console.log('check existing');
        $('.lds-ripple').removeAttr('hidden');
        if( idnInput == ""){
            alert('Please input your mobile number');
            $('.lds-ripple').attr('hidden','');
        }
        else{
            checkExistingRecord();
        }
    });

    $('#check-progress').click(function(){
        $('#welcome').attr('hidden','');
        $('#free-stamp-booth').removeAttr('hidden');
        $('#footer').attr('hidden');
    })

    var checkExistingRecord = function (){
        var dataToPass ={
            "method":"searchTwoField",
            "data":{
                "table":"passport",
                "field1":"id_control_number",
                "value1":idnInput,
                "operator":"AND",
                "field2":"id_control_number",
                "value2":idnInput
            }
        }
        $.ajax({
            type:"POST",
            url: apiUrl,
            contentType: "json",
            data: JSON.stringify(dataToPass
            ),
            beforeSend: function(xhr){
                xhr.setRequestHeader ("Basic", btoa(username + ":" + password));
                xhr.setRequestHeader ("Action", actionPoint);
            },
            success: function(response){
                existing = JSON.parse(response);
                loopExistingRecord();
            },
            error: function(errorThrown){
                console.log(errorThrown);
            },
            aync:false
        });
    }

    var loopExistingRecord = function(){
        $.each(existing, function(key, value){
            if(key == 'methodResponse'){
                existingMobile = value.queryList[0].mobilenumber;
                console.log(existingMobile);
                if( existingMobile === idnInput ){
                    alert("You're mobile number is already registered, you can now visit another booth");
                }
                else{
                    $('.lds-ripple').removeAttr('hidden');
                    matchInput();
                }
            }
        })
    }

    $('.login-again').click(function(){
        $('#sign-up').show();
        $('.login-again').attr('hidden','');
        $('#error').attr('hidden','');
        $('#idn-input').val('');
    })

    var stampData = function(){
        var dataToPass ={
            "method":"insert",
            "data":{
                "table":"passport",
                "mobilenumber":session_mobile_number,
                "id_control_number":idnInput,
                "firstname":fName,
                "lastname":lName,
                "booth_list_registered":booth_number,
            }
        }
        $.ajax({
            type: "POST",
            url: apiUrl,
            contentType: "json",
            data: JSON.stringify(dataToPass
            ),
            beforeSend: function(xhr){
                xhr.setRequestHeader ("Basic", btoa(username + ":" + password));
                xhr.setRequestHeader ("Action", actionPoint);
            },
            success: function(response){
                booth_Status = JSON.parse(response);
                console.log(booth_Status);
                local_IDCN = localStorage.getItem(retailer_MIN);
                console.log(local_IDCN);
                loopBoothStatus();
            },
            error: function(errorThrown){
                console.log(errorThrown);
            }
        })
    }
    
    var loopBoothStatus = function (){
        $.each(booth_Status, function(key, value){
            if(key == 'methodResponse'){
                getID = value.returnID;
                console.log(getID);
                booth_Array = value.booth_list_registered.split('|');
                console.log(booth_Array);
                completeStatus();
                updateProgress();
            }
        })
    }

    var updateProgress = function(){
        var dataToPass = {
            "method":"update",
            "data":{
                "table":"passport",
                "returnID":getID,
                "fieldName":"id",
                "booth_stamp_status":progressStatus
            }
        }
        $.ajax({
            type:"POST",
            url: apiUrl,
            contentType: "json",
            data: JSON.stringify(dataToPass
            ),
            beforeSend: function(xhr){
                xhr.setRequestHeader ("Basic", btoa(username + ":" + password));
                xhr.setRequestHeader ("Action", actionPoint);
            },
            success: function(response){
                completed_Array = JSON.parse(response);
                console.log(completed_Array);
            },
            error: function(errorThrown){
                console.log(errorThrown);
            }
        })
    }

    var raffleStamp = function(){
        console.log('booth0');
        $('.booth1').removeAttr('hidden');
    }

    var raffleStamp1 = function(){
        $('.booth2').removeAttr('hidden');
        $('.claimed').removeAttr('hidden');
        $('.will-claimed').attr('hidden','');
    }
    var raffleStamp2 = function(){
        $('.booth3').removeAttr('hidden');
        $('.claimed2').removeAttr('hidden');
        $('.will-claimed2').attr('hidden','');
    }
    var raffleStamp3 = function(){
        $('.booth4').removeAttr('hidden');
        $('.claimed3').removeAttr('hidden');
        $('.will-claimed3').attr('hidden','');
    }
    var raffleStamp4 = function(){
        console.log('booth4');
        $('.booth5').removeAttr('hidden');
        $('.claimed4').removeAttr('hidden');
        $('.will-claimed4').attr('hidden','');
    }
    var raffleStamp5 = function(){
        console.log('booth5');
        $('.booth7').removeAttr('hidden');
        $('.claimed5').removeAttr('hidden');
        $('.will-claimed5').attr('hidden','');
    }
    $('.mechanics').click(function(){
        document.location.href = 'mechanics.html';
    })

    var completeStatus = function(){
        if( booth_Array.length <= 5 ){
            progressStatus="incomplete";
        }else{
            progressStatus="completed";
            document.getElementById('congrats').innerHTML ="Congratulations,";
            $('#congrats span').text(entryFName);
            document.getElementById('raffle').innerHTML = "You now have a raffle entry and a";
            document.getElementById('entry').innerHTML = "chance to win a special prizes.";
        }
    }

    var checkFinalStatus = function(){
        if( checkFinalBoothCount.length <= 5){
            progressFinalStatus="incomplete";
        }else{
            progressFinalStatus="completed";
        }
    }
    


    /* First booth */
    var detectStampProgress = function(){
        console.log(local_IDCN);
        var dataToPass={
            "method":"searchTwoField",
            "data":{
                "table":"passport",
                "field1":"id_control_number",
                "value1":local_IDCN,
                "operator":"AND",
                "field2":"id_control_number",
                "value2":local_IDCN
            }
        }
        $.ajax({
            type: "POST",
            url: apiUrl,
            contentType: "json",
            data: JSON.stringify(dataToPass
            ),
            beforeSend: function(xhr){
                xhr.setRequestHeader("Basic", btoa(username +":"+ password));
                xhr.setRequestHeader("Action", actionPoint);
            },
            success: function(response){
                detectStamp = JSON.parse(response)
                console.log(JSON.parse(response));
                loopDetectStampProgress();
                checkBoothStatus();
            },
            error: function(errorThrown){
                console.log(errorThrown);
            }
        })
    }

    var loopDetectStampProgress = function(){
        $.each(detectStamp, function(key, value){
            if(key == 'methodResponse'){
                registered_booth = value.queryList[0].booth_list_registered.split('|');
                console.log(registered_booth);
                firstId = value.queryList[0].id;
                console.log(firstId);
                $.each(registered_booth, function(i, el){
                    if($.inArray(el, nofinaldup1)=== -1) nofinaldup1.push(el);
                });
                console.log(nofinaldup1);
            }
        })
    }
    
    var firstBooth = function(){
        if(window.location.href === 'http://digital-passport.herokuapp.com/View/first-booth.html' ){
            local_IDCN = localStorage.getItem(retailer_MIN);
            console.log(local_IDCN);
            console.log('first-booth');    
            if(typeof local_IDCN !== 'undefined' && local_IDCN !== null ){
                detectStampProgress();
            }
            else{
                alert('You need to sign in to join, Please scan the QR code in the registration booth');
                window.location.href = "../mechanics.html"
            }
        }
        else{

        }
    }
    firstBooth();

    var checkBoothStatus = function (){
        var result1 = nofinaldup1.find(function(any){
            return any == "Booth0";
        });
        var result2 = nofinaldup1.find(function(any){
            return any == "Booth1";
        });
        var result3 = nofinaldup1.find(function(any){
            return any == "Booth2";
        });
        var result4 = nofinaldup1.find(function(any){
            return any == "Booth3";
        });
        var result5 = nofinaldup1.find(function(any){
            return any == "Booth4";
        });
        var result6 = nofinaldup1.find(function(any){
            return any == "Booth5";
        });
        if( result1 == "Booth0" ){
            raffleStamp();
        }
        if( result2 == "Booth1" ){
            raffleStamp1();
        }
        if( result3 == "Booth2" ){
            raffleStamp2();
        }
        if( result4 == "Booth3" ){
            raffleStamp3();
        }
        if( result5 == "Booth4" ){
            raffleStamp4();
        }
        if( result6 == "Booth5" ){
            raffleStamp5();
        }
    }

    $('#booth1-btn').click(function(){
        insertBoothStamp1();
    });

    var insertBoothStamp1 = function(){
        convertComma = nofinaldup1.join('|');
        console.log(convertComma);
        var dataToPass = {
            "method":"update",
            "data":{
                "table":"passport",
                "returnID":firstId,
                "fieldName":"id",
                "booth_list_registered":convertComma + booth_number1
            }
        }
        $.ajax({
            type:"POSt",
            url: apiUrl,
            contentType: "json",
            data: JSON.stringify(dataToPass
            ),
            beforeSend: function(xhr){
                xhr.setRequestHeader ("Basic", btoa(username + ":" + password));
                xhr.setRequestHeader ("Action", actionPoint);
            },
            success: function(response){
                firstParse = JSON.parse(response);
                raffleStamp1();
                loopFirstParse();
            },
            error: function(errorThrown){
                console.log(errorThrown);
            }
        })
    }

    var loopFirstParse = function(){
        $.each(detectStamp, function(key, value){
            if(key == 'methodResponse'){
                checkFinalId = value.queryList[0].id;
                entryFName = value.queryList[0].firstname;
                console.log(entryFName);
                checkFinalBoothCount = value.queryList[0].booth_list_registered.split('|');
                console.log(value);
                console.log(checkFinalId);
                checkFinalStatus();
                updateStatus();
            }
        })
    }

    var updateStatus = function(){
        var dataToPass = {
            "method":"update",
            "data":{
                "table":"passport",
                "returnID":checkFinalId,
                "fieldName":"id",
                "booth_stamp_status":progressFinalStatus
            }
        }
        $.ajax({
            type:"POST",
            url: apiUrl,
            contentType: "json",
            data: JSON.stringify(dataToPass
            ),
            beforeSend: function(xhr){
                xhr.setRequestHeader ("Basic", btoa(username + ":" + password));
                xhr.setRequestHeader ("Action", actionPoint);
            },
            success: function(response){
                completed_Array = JSON.parse(response);
                loopCompletedArray();
            },
            error: function(errorThrown){
                console.log(errorThrown);
            }
        })
    }

    var loopCompletedArray = function(){
        entryfirstName = document.createTextNode(entryFName);
        console.log(entryfirstName);
        $.each(completed_Array, function(key, value){
            if( key == 'methodResponse' ){
                console.log(value);
                if ( value.booth_stamp_status == "completed"){
                    completed_ID = value.returnID;
                    console.log(completed_ID);
                    document.getElementById('congrats').innerHTML ="Congratulations, " + entryFName + "!";
                    document.getElementById('raffle').innerHTML = "You now have a raffle entry and a";
                    document.getElementById('entry').innerHTML = "chance to win a special prizes.";
                    getCompletedIdDetails();
                }
                else if(value.booth_stamp_status == "incomplete"){
                    completed_ID = value.returnID;
                    console.log(completed_ID);
                    getCompletedIdDetails();
                }
            }
        })
    }

    var getCompletedIdDetails = function(){
        var dataToPass ={
            "method":"select",
            "data":{
                "table":"passport",
                "returnID":completed_ID
            }
        }
        $.ajax({
            type:"POST",
            url:apiUrl,
            contentType:"json",
            data: JSON.stringify(dataToPass
            ),
            beforeSend: function(xhr){
                xhr.setRequestHeader ("Basic", btoa(username + ":" + password));
                xhr.setRequestHeader ("Action", actionPoint)
            },
            success: function(response){
                completed_Result = JSON.parse(response);
                console.log(completed_Result);
                loopCompletedIdDetails();
                searchNatCon();
            },
            error: function(errorThrown){
                console.log(errorThrown);
            }
        })
    }

    var loopCompletedIdDetails = function(){
        $.each(completed_Result, function(key,value){
            if(key == 'methodResponse'){
                getIdCN = value.id_control_number;
                console.log(getIdCN);
                getCompleted = value.booth_stamp_status;
                console.log(getCompleted);

            }
        })
    }

    var searchNatCon = function(){
        console.log(getIdCN);
        var dataToPass={
            "method":"searchTwoField",
            "data":{
                "table":"SMART-natcon",
                "field1":"mobilenumber",
                "value1":getIdCN,
                "operator":"AND",
                "field2":"field1",
                "value2":getIdCN
            }
        }
        $.ajax({
            type:"POST",
            url: apiUrl,
            contentType: "json",
            data: JSON.stringify(dataToPass
            ),
            beforeSend: function(xhr){
                xhr.setRequestHeader ("Basic", btoa(username + ":" + password));
                xhr.setRequestHeader ("Action", actionPoint);
            },
            success: function(response){
                natcon_Array = JSON.parse(response);
                console.log(natcon_Array);
                loopNatcon();
                updateNatConStatus();
            },
            error: function(errorThrown){
                console.log(errorThrown);
            }
        })
    }
    var loopNatcon = function(){
        $.each(natcon_Array, function(key, value){
            if( key == 'methodResponse' ){
                natcon_ID = value.queryList[0].id;
                console.log(natcon_ID);
            }
        })
    }

    var updateNatConStatus = function(){
        var dataToPass={
            "method":"update",
            "data":{
                "table":"SMART-natcon",
                "returnID":natcon_ID,
                "fieldName":"id",
                "field44":getCompleted
            }
        }
        $.ajax({
            type:"POST",
            url: apiUrl,
            contentType: "json",
            data: JSON.stringify(dataToPass
            ),
            beforeSend: function(xhr){
                xhr.setRequestHeader ("Basic", btoa(username + ":" + password));
                xhr.setRequestHeader ("Action", actionPoint);
            },
            success: function(response){
                natconUpdate_Array = JSON.parse(response);
                console.log(natconUpdate_Array);
            },
            error: function(errorThrown){
                console.log(errorThrown);
            }
        });
    }

    /* Second Booth */
    var secondBooth = function(){
        if(window.location.href === 'http://digital-passport.herokuapp.com/View/second-booth.html' ){
            local_IDCN = localStorage.getItem(retailer_MIN);
            console.log(local_IDCN);
            console.log('second-booth');    
            if(typeof local_IDCN !== 'undefined' && local_IDCN !== null ){
                detectStampProgress();
            }
            else{
                alert('You need to sign in to join, Please scan the QR code in the registration booth');
                window.location.href = "../mechanics.html"
            }
        }
        else{

        }
    }

    secondBooth();

    $('#booth2-btn').click(function(){
        insertBoothStamp2();
    })

    var insertBoothStamp2 = function(){
        convertComma = nofinaldup1.join('|');
        console.log(convertComma);
        var dataToPass = {
            "method":"update",
            "data":{
                "table":"passport",
                "returnID":firstId,
                "fieldName":"id",
                "booth_list_registered":convertComma + booth_number2
            }
        }
        $.ajax({
            type:"POSt",
            url: apiUrl,
            contentType: "json",
            data: JSON.stringify(dataToPass
            ),
            beforeSend: function(xhr){
                xhr.setRequestHeader ("Basic", btoa(username + ":" + password));
                xhr.setRequestHeader ("Action", actionPoint);
            },
            success: function(response){
                firstParse = JSON.parse(response);
                raffleStamp2();
                loopFirstParse();
            },
            error: function(errorThrown){
                console.log(errorThrown);
            }
        })
    }

    /* Third Booth */
    var thirdBooth = function(){
        if(window.location.href === 'http://digital-passport.herokuapp.com/View/third-booth.html' ){
            local_IDCN = localStorage.getItem(retailer_MIN);
            console.log(local_IDCN);
            console.log('second-booth');    
            if(typeof local_IDCN !== 'undefined' && local_IDCN !== null ){
                detectStampProgress();
            }
            else{
                alert('You need to sign in to join, Please scan the QR code in the registration booth');
                window.location.href = "../mechanics.html"
            }
        }
        else{

        }
    }

    thirdBooth();

    $('#booth3-btn').click(function(){
        insertBoothStamp3();
    })

    var insertBoothStamp3 = function(){
        convertComma = nofinaldup1.join('|');
        console.log(convertComma);
        var dataToPass = {
            "method":"update",
            "data":{
                "table":"passport",
                "returnID":firstId,
                "fieldName":"id",
                "booth_list_registered":convertComma + booth_number3
            }
        }
        $.ajax({
            type:"POSt",
            url: apiUrl,
            contentType: "json",
            data: JSON.stringify(dataToPass
            ),
            beforeSend: function(xhr){
                xhr.setRequestHeader ("Basic", btoa(username + ":" + password));
                xhr.setRequestHeader ("Action", actionPoint);
            },
            success: function(response){
                firstParse = JSON.parse(response);
                raffleStamp3();
                loopFirstParse();
            },
            error: function(errorThrown){
                console.log(errorThrown);
            }
        })
    }

    /* Fourth Booth */
    var fourthBooth = function(){
        if(window.location.href === 'http://digital-passport.herokuapp.com/View/fourth-booth.html' ){
            local_IDCN = localStorage.getItem(retailer_MIN);
            console.log(local_IDCN);
            console.log('second-booth');    
            if(typeof local_IDCN !== 'undefined' && local_IDCN !== null ){
                detectStampProgress();
            }
            else{
                alert('You need to sign in to join, Please scan the QR code in the registration booth');
                window.location.href = "../mechanics.html"
            }
        }
        else{

        }
    }

    fourthBooth();

    $('#booth4-btn').click(function(){
        insertBoothStamp4();
    })

    var insertBoothStamp4 = function(){
        convertComma = nofinaldup1.join('|');
        console.log(convertComma);
        var dataToPass = {
            "method":"update",
            "data":{
                "table":"passport",
                "returnID":firstId,
                "fieldName":"id",
                "booth_list_registered":convertComma + booth_number4
            }
        }
        $.ajax({
            type:"POSt",
            url: apiUrl,
            contentType: "json",
            data: JSON.stringify(dataToPass
            ),
            beforeSend: function(xhr){
                xhr.setRequestHeader ("Basic", btoa(username + ":" + password));
                xhr.setRequestHeader ("Action", actionPoint);
            },
            success: function(response){
                firstParse = JSON.parse(response);
                raffleStamp4();
                loopFirstParse();
            },
            error: function(errorThrown){
                console.log(errorThrown);
            }
        })
    }

    /* Fifth Booth */
    var fifthBooth = function(){
        if(window.location.href === 'http://digital-passport.herokuapp.com/View/fifth-booth.html' ){
            local_IDCN = localStorage.getItem(retailer_MIN);
            console.log(local_IDCN);
            console.log('second-booth');    
            if(typeof local_IDCN !== 'undefined' && local_IDCN !== null ){
                detectStampProgress();
            }
            else{
                alert('You need to sign in to join, Please scan the QR code in the registration booth');
                window.location.href = "../mechanics.html"
            }
        }
        else{

        }
    }

    fifthBooth();

    $('#booth5-btn').click(function(){
        insertBoothStamp5();
    })

    var insertBoothStamp5 = function(){
        convertComma = nofinaldup1.join('|');
        console.log(convertComma);
        var dataToPass = {
            "method":"update",
            "data":{
                "table":"passport",
                "returnID":firstId,
                "fieldName":"id",
                "booth_list_registered":convertComma + booth_number5
            }
        }
        $.ajax({
            type:"POSt",
            url: apiUrl,
            contentType: "json",
            data: JSON.stringify(dataToPass
            ),
            beforeSend: function(xhr){
                xhr.setRequestHeader ("Basic", btoa(username + ":" + password));
                xhr.setRequestHeader ("Action", actionPoint);
            },
            success: function(response){
                firstParse = JSON.parse(response);
                raffleStamp5();
                loopFirstParse();
            },
            error: function(errorThrown){
                console.log(errorThrown);
            }
        })
    }

    var hours = 1; // Reset when storage is more than 24hours
    var now = new Date().getTime();
    var setupTime = localStorage.getItem('setupTime');
    if (setupTime == null) {
    localStorage.setItem('setupTime', now)
    console.log(setupTime);
    } else {
    if(now-setupTime > hours*60*60*1000) {
        localStorage.clear()
        localStorage.setItem('setupTime', now);
    }
    }

});