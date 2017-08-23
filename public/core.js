var pubsub = angular.module('pubsub', []);

function mainController($scope, $http) {
    $scope.formData = {};
    $scope.messages = [];
    $scope.isHidden = false;
    $scope.isChatHidden = true;
    $scope.userName = "";
    $scope.chatMessage = null;


    function notifyMe(msg) {
        if (Notification.permission !== "granted")
          Notification.requestPermission();
        else {
            if(! (msg.data.split(":")[0].trim().toUpperCase() == $scope.userName.toUpperCase()) ){
                 var notification = new Notification(msg.data.split(":")[0], { 
                    icon: "Logitech_logo.png",           
                    body: msg.data.split(":")[1]                    
                  });
                  setTimeout(notification.close(), 1000);
            }
        }
      }

    //when landing on the page, get all todos and show them
    $scope.getMessages = function(){
        $http.get('/api/todos')
        .success(function(data) {
            //$scope.messages = data;
            //console.log(data);
            
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    }        

    // when submitting the add form, send the text to the node API
    $scope.createTodo = function() {  
        if($scope.formData.text != undefined){
            $scope.chatMessage = angular.copy($scope.formData);
            $scope.chatMessage.text = $scope.userName + " : " + $scope.chatMessage.text;        
            $http.post('/api/todos', $scope.chatMessage)
                .success(function(data) {
                    $scope.formData = {}; // clear the form so our user is ready to enter another
                    //$scope.messages = data;
                    data.forEach(msg =>{
                        console.log(msg);
                    });
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        }
        
    };

    $scope.setUserName = function(){
        $scope.userName = $scope.loginData.text;
        $scope.isChatHidden = false;
        $scope.isHidden = true;
    }

    // delete a todo after checking it
    // $scope.deleteTodo = function(id) {
    //     $http.delete('/api/todos/' + id)
    //         .success(function(data) {
    //             $scope.todos = data;
    //             console.log(data);
    //         })
    //         .error(function(data) {
    //             console.log('Error: ' + data);
    //         });
    // };
    $(function () {       
        $scope.getMessages;
        var socket = io();
        socket.on('chatmessage', function(msg){
            notifyMe(msg);
            $scope.messages.push(msg);   
            $scope.getMessages();     
            console.log(msg);            
        });
    });




}