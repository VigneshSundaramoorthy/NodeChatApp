
  // sends message to server, resets & prevents default form action
  $('form').submit(function() {
  	var message = $('#message').val();
    //   //socket.emit('messages', message);
    
      $http.post('/api/send',
      message,
      function(data, status){
          alert("Data: " + data + "\nStatus: " + status);
      });   
  	
  	return false;
  }); 

