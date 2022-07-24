var _sessions = [];
var _user;
var _currentSession = "";
var _fileBuffer = "";
var _chatCount = 0;

function createMessage(obj,currentUser){
    var newMsg = document.createElement('li');
    newMsg.innerHTML = "<div style='display:block;'>"+obj.content+"</div><div><i> - "+obj.user+"</i></div><div style='display:block; font-size:0.9em; margin-top:10px;'><span class='glyphicon glyphicon-time glyphicon-msg'></span>"+obj.stamp+"</div>";
    $(newMsg).attr('data-stamp',obj.stamp);
    $(newMsg).attr('data-user',obj.user);
    $(newMsg).addClass("msg");
    if(obj.user!=currentUser)
    {
        $(newMsg).addClass("msg-foreign");
    }
    else
    {
        $(newMsg).addClass("msg-user");
    }
    return newMsg;
}

function populateMessages(objList,currentUser)
{
    $("#rhinestone-window").empty();
    for(var i=0 ; i<objList.length; i++)
    {
        var msg = createMessage(objList[i],currentUser)
        $("#rhinestone-window").append(msg);
        if(i>=_chatCount){
            $(msg).css("width","0");
            $(msg).animate({
                width:"500px"
            });
        }
    }
    var objDiv = document.getElementById("rhinestone-window");
    objDiv.scrollTop = objDiv.scrollHeight;
    _chatCount = objList.length;
    chatList = $("#rhinestone-window").children();
    if(objList.length!=0)
    convertPreview(objList,chatList,currentUser,0);
}

function convertPreview(objList,chatList,currentUser,i){
    if(objList[i].content[0] == '#')
    {
        objChildren = $(chatList[i]).children();
        fileId = objChildren[0].innerHTML.substr(1);
        data = {'action':'get-preview','fileId':fileId};
        $.ajax({
            url:'/db',
            type:'post',
            data: data,
            success : function(response){
                $(chatList[i]).removeClass("msg-user");
                $(chatList[i]).removeClass("msg-foreign");
                $(chatList[i]).addClass("msg-preview");
                chatList[i].innerHTML = "<div style='display:block;' class='msg-preview-content'>"+response.previewData+"</div><div style='margin-top:10px'><i> - "+objList[i].user+"</i></div><div style='display:block; font-size:0.9em; margin-top:10px;'><span class='glyphicon glyphicon-time glyphicon-msg'></span>"+objList[i].stamp+"</div>";
                var objDiv = document.getElementById("rhinestone-window");
                objDiv.scrollTop = objDiv.scrollHeight;
                if(i+1 < chatList.length) convertPreview(objList,chatList,currentUser,i+1);
            },
            failure: function(response){
                console.log("switchSession error: "+JSON.stringify(response));
            }
        })
    }
    if(i+1 < chatList.length) convertPreview(objList,chatList,currentUser,i+1);
}

var switchSession = function(currentElement){
    data = {'action':'switch-session', 'newSession':$(currentElement).text()};
    $("#session-dropdown").text($(currentElement).text());
    _currentSession = $(currentElement).text();
    $.ajax({
        url:'/db',
        type:'post',
        data: data,
        success : function(response){
            _chatCount = 0;
            populateMessages(response.sessionContent,response.user);
            updateBoard(_currentSession);
            loadingAnim();
        },
        failure: function(response){
            console.log("switchSession error: "+JSON.stringify(response));
        }
    });
    data = {'action':'get-session-info', 'session':_currentSession};
    $.ajax({
        url:'/db',
        type:'post',
        data: data,
        success : function(response){
            sessionInfo = response.sessionInfo

            $("#comment-count").text(sessionInfo.chatCount);
            $("#user-count").text(sessionInfo.userCount);
        },
        failure: function(response){
            console.log("switchSession error: "+JSON.stringify(response));
        }
    });
}

var pollSession = function(){
    setTimeout(function(){
        var chat = $("#rhinestone-window").children();
        data = {'action':'poll-session', 'session':_currentSession, 'chat-count':chat.length};
        if(_currentSession!="")
        {
            $.ajax({
                url:'/db',
                type:'post',
                data: data,
                success : function(response){
                    if(response.action == 'update') populateMessages(response.sessionContent,response.user);
                    pollSession();
                },
                failure: function(response){
                    console.log("switchSession error: "+JSON.stringify(response));
                }
            });
        }
        else{
            pollSession();
        }
    },1000);
}

var populateSessions = function(){
    $("#sessions-list-ul").empty();
    for(var i=0 ; i<_sessions.length ; i++)
    {
        $("#sessions-list-ul").append("<li class='session-li-item' onclick='switchSession(this);'>"+_sessions[i]+"</li>");
    }
    $("#add-to-sessions-list-ul").empty();
    for(var i=0 ; i<_sessions.length ; i++)
    {
        $("#add-to-sessions-list-ul").append("<li class='session-li-item' onclick='addToSession(this);'>"+_sessions[i]+"</li>");
    }
}

var updateSessionsList = function(receivedSessionsList){
    for (var i=0 ; i<receivedSessionsList.sessionsList.length ; i++)
    {
        if(_sessions.indexOf(receivedSessionsList.sessionsList[i].id)==-1)
        _sessions.push(receivedSessionsList.sessionsList[i].id)
    }
    for (var i=0 ; i<_sessions.Length ; i++)
    {
        if(receivedSessionsList.indexOf(_sessions[i].id)==-1)
        {
            _sessions.splice(i, 1);
        }
    }
}

var fetchSessions = function(){
    data = {'action':'fetch-sessions'};
    $.ajax({
        url:'/db',
        type:'post',
        data: data,
        success : function(response){
            updateSessionsList(response);
            populateSessions();
        },
        failure: function(response){
            alert("fetchSessions error: "+JSON.stringify(response));
        }
    });
};

function connectSession(){
    data = {'action':'update-session','sessionName':$("#session-name-field").val()};
    $.ajax({
        url: '/db',
        type: 'post',
        data: data,
        success : function(response){
            alert("Session added.");
            fetchSessions();
        },
        failure: function(response){
            console.log("connectSession: "+JSON.stringify(response));
        }
    });
}

function newSession(){
    data = {'action':'update-session','sessionName':_user + "-" + $("#new-session-field").val()};
    $.ajax({
        url: '/db',
        type: 'post',
        data: data,
        success : function(response){
            alert("Session added.");
            fetchSessions();
        },
        failure: function(response){
            console.log("connectSession: "+JSON.stringify(response));
        }
    });
}

var sendMessage = function(){
    var msgString = $("#message-input").val();
    data = {'action':'send-message', 'content':msgString};
    $.ajax({
        url: '/db',
        type: 'post',
        data: data,
        success : function(response){
            if(response["result"]=="success")
                $("#message-status").val("Message sent.");
            else
                $("#message-status").val("An error occured.");
            setTimeout(function(){
                $("#message-status").val("");
            },2000);
        },
        failure: function(response){
            console.log("sendMessage() error: "+JSON.stringify(response));
        }
    });
}



function setSessionPrefix(){
    $("#new-session-prefix").text(_user+"-");
}

function getUserName(){
    _user = $("#user-name").text();
}

function getAppFile(appHandler,filePath){
    data = {"action":"get-user-email", "userId":$("#user-name").text()};

    var userEmail;
    $.ajax({
            type:'post',
            url:"/db",
            data: data,
            success: function(response){
                        if(response.result=="success"){
                            dataApp = {"action":"get-file", "fileName":filePath, "userEmail":response.userEmail};
                            $.ajax({
                                type:'post',
                                url:appHandler,
                                data: dataApp,
                                success: function(response){
                                            if(response.result=="success"){
                                                _fileBuffer = response.data;
                                            }
                                            else{
                                                alert(JSON.stringify(response));
                                            }
                                         },
                                failure: function(response){
                                                alert(JSON.stringify(response.result))
                                         },
                                dataType: 'json'
                            });
                        }
                        else{
                            alert(JSON.stringify(response));
                        }
                     },
            failure: function(response){
                            alert(JSON.stringify(response.result))
                     },
            dataType: 'json'
        });


}

function checkFileShare(){
    if($("#file-share-path").text()!="None"){
        data = {action:"get-app-handler", app:$("#app-id").text()};
        $.ajax({
            type:'post',
            url:'/db',
            data: data,
            success: function(response){
                        if(response.result=="success"){
                            getAppFile(response.appHandler,$("#file-share-path").text(),$("#user-id").text());
                        }
                        else{
                            alert(JSON.stringify(response));
                        }
                     },
            failure: function(response){
                            alert(JSON.stringify(response.result))
                     },
            dataType: 'json'
        });
        $("#file-share-container").css("display","block");
        $("#main-container").css("display","none");
        $("body").css("background-color","#2e2e2e");
    }
}

function addToSession(currentElement){
    switchSession(currentElement);
    session = $(currentElement).text();
    fileName = $("#file-share-path").text();
    addFile(session,fileName);

    $("#file-share-container").css("display","none");
    $("#main-container").css("display","");
    $("body").css("background-color","white");
}

function addFile(session,fileName){
    data = {action:'add-file-to-session','session':session, 'fileName':fileName, 'fileData':_fileBuffer, 'author':$("#user-name").text()};
    $.ajax({
        type: 'post',
        data: data,
        url: '/db',
        success: function(response){
                    if(response.result=="success"){
                        alert("File added successfully.");
                    }
                    else{
                        alert("Something went wrong.");
                    }
                },
        failure: function(response){
                    alert("Something went wrong.");
                },
        dataType: 'json'
    });
}

function updateBoard(session){
    data = {'action':'update-board','session':session};
    $("#board-container").empty();
    $.ajax({
        type: 'post',
        data: data,
        url: '/db',
        success: function(response){
                    if(response.result=="success"){
                        for(var i=0 ; i<response.boardContent.length ; i++){
                            $("#board-container").append(createBoardItem(response.boardContent[i]));
                        }
                        if(response.boardContent.length=="0"){
                            $("#board-container").html("<div id='board-empty-desc'>The board for this session is empty, add some files to get started...</div>");
                        }
                    }
                    else{
                        alert("Something went wrong.");
                    }
                },
        failure: function(response){
                    alert("Something went wrong.");
                },
        dataType: 'json'
    });
}

function animateRevisionsTo(mainNode){

    boardItems = $("#board-container").children();
    id = $(mainNode).attr("id");
    for(var i=0 ; i<boardItems.length ; i++){
        if($(boardItems[i]).attr("prevId")==id){
            $(boardItems[i]).animate({
                opacity:"1",
                height:"60px",
                borderLeftWidth: "2px"
            },200);
            setTimeout(function(){
                $("#board-joiner").css("top",($(mainNode).offset().top + 10 - $(document).scrollTop())+"px");
                $("#board-joiner").css("left",($(mainNode).offset().left - 30)+"px");
                var lineHeight = ($(boardItems[i]).offset().top)-($(mainNode).offset().top);
                $("#joiner-line").css("height",lineHeight+"px");
                $("#board-joiner").animate({
                    opacity:"1"
                },200);
            },400);
            return;
        }
    }
    $("#board-joiner").animate({
        opacity:"0"
    },200);
}

function animateRevisionsBack(mainNode){
    boardItems = $("#board-container").children();
    id = $(mainNode).attr("id");
    for(var i=0 ; i<boardItems.length ; i++){
        if($(boardItems[i]).attr("prevId")==id){
            $(boardItems[i]).animate({
                opacity:"0.6",
                height:"30px",
                borderLeftWidth: "0px"
            });
            $("#board-joiner").animate({
                opacity:"0"
            },200);
            return;
        }
    }
    $("#board-joiner").animate({
        opacity:"0"
    },200);
}

function refreshBoard(){
    $("#board").css("margin-top","40px");
    $("#board").css("opacity","0");
    $("#board").animate({
        marginTop: "5px",
        opacity: 1
    },300);
    if(_currentSession!=""){
        updateBoard(_currentSession);
    }
}

function drag(ev) {
    ev.dataTransfer.setData("text", "#"+ev.target.id);
}

function allowDrop(ev){
    ev.preventDefault();
}

function drop(ev){
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    $("#message-input").val(data);
    sendMessage();
}

function createBoardItem(listObj){
    listItem = document.createElement("li");
    $(listItem).addClass("board-list-item");
    $(listItem).attr("id",listObj["id"]);
    $(listItem).attr("name",listObj["name"]);
    $(listItem).attr("stamp",listObj["stamp"]);
    $(listItem).attr("author",listObj["author"]);
    $(listItem).attr("prevId",listObj["prevId"]);
    $(listItem).attr("draggable","true");
    $(listItem).attr("ondragstart","drag(event)");
    $(listItem).attr("onclick","editBoardItem(this)");
    listItem.innerHTML ="<div style='block'><span class='glyphicon glyphicon-file glyphicon-board'></span> "+listObj["id"]+"  <span class='glyphicon glyphicon-user glyphicon-board'></span>"+listObj["author"]+" </div><div style='block'><span class='glyphicon glyphicon-time glyphicon-board'></span>"+listObj["stamp"]+"</div><div style='block'><div class='board-item-name'><span class='glyphicon glyphicon-folder-close'></span>"+listObj["name"]+"</div></div>";
    $(listItem).hover(
        function(){
            $(this).animate({
                opacity: "1",
                height: "60px",
                borderLeftWidth: "2px"
            },200);
            animateRevisionsTo(this);
        },function(){
            $(this).animate({
                opacity: "0.6",
                height: "30px",
                borderLeftWidth: "0px"
            },200);
            animateRevisionsBack(this);
        }
    );
    return listItem;
}

function editBoardItem(currentElement){
    fileId = currentElement.getAttribute("id");
    fileName = currentElement.getAttribute("name");
    session = _currentSession;
    userId = $("#user-name").text();
    data = {'fileId':fileId, 'userId':userId, 'fileName':fileName, "session":session};
    window.open("http://localhost:8080/rhinestone?"+$.param(data));
}

function loadingAnim(){
    $("#board").css("margin-top","20px");
    $("#board").css("opacity","0");
    $("#chat-window").css("margin-left","20px");
    $("#chat-window").css("opacity","0");
    $("#board").animate({
        marginTop: '5px',
        opacity: '1'
    },300);
    $("#chat-window").animate({
        marginLeft: "5px",
        opacity: '1'
    },300);
}

function init(){
    fetchSessions();
    getUserName();
    setSessionPrefix();
    pollSession();
    checkFileShare();
    loadingAnim();
}

function cancelAdd(){
    $("#file-share-container").css("display","none");
    $("#main-container").css("display","");
    $("body").css("background-color","white");
}

window.onload = init;

function landingLogin(){
    var user = document.getElementById("usr").value;
    var pwd = document.getElementById("pwd").value;
}
