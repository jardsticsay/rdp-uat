var apiUrl = "https://cors-destroyer.herokuapp.com/http://112.206.234.26/SwissKnife_dev_stage/index.cgi";
var username = "retcon";
var password = "R3tC0N";
var actionPoint = "http://127.0.0.1/SwissKnife_dev_stage/databank.cgi";
var xhr = new  XMLHttpRequest();
var parseData =[];
var parseUpdate =[];
var registered_booth=[];
var parseResult=[];
var idnInput;
var fName;
var lName;
var firstname;
var lastname;
var booth_number = "Booth3|";
var retailer_number;
var session_mobile_number;
var filtered;
var idnum;
var noduplicate=[];
var nofinaldup=[];
var boothUpdate=[];
var booth_Array=[];
var parseProgress=[];
var progress_Array=[];
var completed_Array=[];
var completed_Result=[];
var natcon_Array=[];
var natconUpdate_Array=[];
var getIdCN;
var getCompleted;
var status_completed;
var completed_ID;
var getID;
var natcon_ID;
var convertComma;
var convertNoFinalDup;
var progressStatus;


$(function(){
    $('#stamp').prop('disabled', false);
    $('.all-stamp').hide();
    var dataOutput = function(){
        $.each(parseData, function(key, value){
            if(key == 'methodResponse'){
                getID = value.queryList[0].id;
                fName = value.queryList[0].firstname;
                lName = value.queryList[0].lastname;
                registered_booth = value.queryList[0].booth_list_registered.split('|');
                console.log(registered_booth);
                $.each(registered_booth, function(i, el){
                    if($.inArray(el, noduplicate)=== -1) noduplicate.push(el);
                });
                console.log(noduplicate);
                firstname = document.createTextNode(fName);
                lastname = document.createTextNode(lName);
                if(value.queryList[0].error){
                    alert('ID number not yet registered');
                    $('#idn-input').val('');
                }else {
                    $('#fullname2').hide();
                    $('#fullname').show();
                    tyMsg = document.createTextNode('Stamp Claim by Mr. / Ms')
                    document.getElementById('firstname').appendChild(firstname);
                    document.getElementById('lastname').appendChild(lastname);
                    document.getElementById('thanks').appendChild(tyMsg);
                    $('#stamp').prop('disabled', true);
                    insertBoothNumber();
                }
                
            }
        })
    }

    
    var matchInput = function(){
        var dataToPass = {
            "method":"searcHTwoField",
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
                parseData = JSON.parse(response);
                dataOutput();
            },
            error: function(errorThrown){
                console.log(errorThrown);
            },
            aync:false
        });
    }

    var insertBoothNumber = function(){
        convertComma = noduplicate.join('|');
        console.log(convertComma);
        var dataToPass = {
            "method":"update",
            "data":{
                "table":"passport",
                "returnID":getID,
                "fieldName":"id",
                "booth_list_registered":convertComma + booth_number
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
                boothUpdate = JSON.parse(response);
                loopBoothUpdate();
                checkBoothStatus();
                finalUpdate();
            },
            error: function(errorThrown){
                console.log(errorThrown);
            }
        })

    }

    var loopBoothUpdate = function (){
        $.each(boothUpdate, function(key, value){
            if(key == 'methodResponse'){
                booth_update = value.booth_list_registered.split('|');
                console.log(booth_update);
                $.each(booth_update, function(i, el){
                    if($.inArray(el, nofinaldup)=== -1) nofinaldup.push(el);
                });
                console.log(nofinaldup);
                convertNoFinalDup = nofinaldup.join('|');
                console.log(convertNoFinalDup);
            }
        })
    }

    var finalUpdate = function (){
        var dataToPass = {
            "method":"update",
            "data":{
                "table":"passport",
                "returnID":getID,
                "fieldName":"id",
                "booth_list_registered":convertNoFinalDup
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
                parseResult = JSON.parse(response);
                console.log(parseResult);
                loopParseResult();
            },
            error: function(errorThrown){
                console.log(errorThrown);
            }
        })
    }

    var loopParseResult = function(){
        $.each(parseResult, function(key, value){
            if(key == 'methodResponse'){
                booth_Array = value.booth_list_registered.split('|');
                console.log(booth_Array);
                completeStatus();
                updateProgress();
            }
        })
    }

    var completeStatus = function(){
        if( booth_Array.length <= 5 ){
            progressStatus="in progress";
        }else{
            progressStatus="completed";
        }
    }

    var updateProgress = function(){
        var dataToPass = {
            "method":"update",
            "data":{
                "table":"passport",
                "returnID":getID,
                "fieldName":"id",
                "booth_registration_status":progressStatus
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
        $.each(completed_Array, function(key, value){
            if( key == 'methodResponse' ){
                console.log(value);
                if ( value.booth_registration_status == "completed"){
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
                getCompleted = value.booth_registration_status;
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
                "field43":getCompleted
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

    var checkProgOutput = function(){
        $.each(parseProgress, function(key, value){
            if(key == 'methodResponse'){
                progress_Array = value.queryList[0].booth_list_registered.split('|');
                fName2 = value.queryList[0].firstname;
                lName2 = value.queryList[0].lastname;
                firstname = document.createTextNode(fName2);
                lastname = document.createTextNode(lName2);
                if(value.queryList[0].error){
                    alert('ID number not yet registered');
                    $('#idn-input').val('');
                }else {
                    document.getElementById('firstname2').appendChild(firstname);
                    document.getElementById('lastname2').appendChild(lastname);
                    $('#fullname').hide();
                    $('#thanks').hide();
                    checkProgress();
                }
                
            }
        })
    }

    var checkProg = function(){
        var dataToPass = {
            "method":"searcHTwoField",
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
                parseProgress= JSON.parse(response);
                console.log(parseProgress);
                checkProgOutput();
            },
            error: function(errorThrown){
                console.log(errorThrown);
            },
            aync:false
        });
    }

    var loopDetectStampProgress = function(){
        $.each(parseData, function(key, value){
            if(key == 'methodResponse'){
                registered_booth = value.queryList[0].booth_list_registered.split('|');
                console.log(registered_booth);
                idnum = value.queryList[0].id;
                console.log(idnum);
                $.each(registered_booth, function(i, el){
                    if($.inArray(el, noduplicate)=== -1) noduplicate.push(el);
                    console.log(noduplicate);
                });
                
            }
        })
        
    }

    $('#stamp').click(function(){
        idnInput = $('#idn-input').val();
        if ( $('#idn-input').val() == "" ){
            alert('Please input your ID Control Number');
        }else{
        matchInput();
        }
    });

    $('#check-prog').click(function(){
        idnInput = $('#idn-input').val();
        if ( $('#idn-input').val() == "" ){
            alert('Please input your ID Control Number');
        }else{
            checkProg();
        }
    })

    var raffleStamp = function(){
        $('.stamp-container').removeAttr('hidden');
        $('.stamp1').removeAttr('hidden');
        $('.stamp1').addClass("is-approved");
    }

    var raffleStamp2 = function(){
        $('.stamp-container').removeAttr('hidden');
        $('.stamp2').removeAttr('hidden');
        $('.stamp2').addClass("is-approved2");
    }
    var raffleStamp3 = function(){
        $('.stamp-container').removeAttr('hidden');
        $('.stamp3').removeAttr('hidden');
        $('.stamp3').addClass("is-approved3");
    }
    var raffleStamp4 = function(){
        $('.stamp-container').removeAttr('hidden');
        $('.stamp4').removeAttr('hidden');
        $('.stamp4').addClass("is-approved4");
    }
    var raffleStamp5 = function(){
        $('.stamp-container').removeAttr('hidden');
        $('.stamp5').removeAttr('hidden');
        $('.stamp5').addClass("is-approved5");
    }


    
    var checkBoothStatus = function (){
        var result1 = booth_update.find(function(any){
            return any == "Booth1";
        });
        var result2 = booth_update.find(function(any){
            return any == "Booth2";
        });
        var result3 = booth_update.find(function(any){
            return any == "Booth3";
        });
        var result4 = booth_update.find(function(any){
            return any == "Booth4";
        });
        var result5 = booth_update.find(function(any){
            return any == "Booth5";
        });
        if( result1 == "Booth1" ){
            raffleStamp();
        }
        if( result2 == "Booth2" ){
            raffleStamp2();
        }
        if( result3 == "Booth3" ){
            raffleStamp3();
        }
        if( result4 == "Booth4" ){
            raffleStamp4();
        }
        if( result5 == "Booth5" ){
            raffleStamp5();
        }
    }
    
    var checkProgress = function (){
        var result1 = progress_Array.find(function(any){
            return any == "Booth1";
        });
        var result2 = progress_Array.find(function(any){
            return any == "Booth2";
        });
        var result3 = progress_Array.find(function(any){
            return any == "Booth3";
        });
        var result4 = progress_Array.find(function(any){
            return any == "Booth4";
        });
        var result5 = progress_Array.find(function(any){
            return any == "Booth5";
        });
        if( result1 == "Booth1" ){
            raffleStamp();
        }
        if( result2 == "Booth2" ){
            raffleStamp2();
        }
        if( result3 == "Booth3" ){
            raffleStamp3();
        }
        if( result4 == "Booth4" ){
            raffleStamp4();
        }
        if( result5 == "Booth5" ){
            raffleStamp5();
        }
    }
    

    var converDatatoString = function(){
        convertoString = registered_booth.join(',');
        console.log(convertoString);
        convertComma = registered_booth.split(',').join('|');
        console.log(convertComma);
    }
    
    loopDetectStampProgress();

    // insertBoothNumber();

    
    // registered_booth.push(booth_number);
    // console.log(registered_booth);

})