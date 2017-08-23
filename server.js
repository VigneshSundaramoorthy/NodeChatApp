var express  = require('express');
var app      = express();        
var server = app.listen(8080);                       // create our app w/ express
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
const PubSub = require(`@google-cloud/pubsub`);
const pubsub = PubSub();
var io = require('socket.io').listen(server);
//var http = require('http').Server(app);
//var io = require('socket.io')(http);
//var io = require('socket.io').listen(http);

// configuration =================

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());


io.on('connection', function(socket){
    //socket.emit('chatmessage','Message from server : Hi from Socket IO..!!');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
  });

var topic_history = pubsub.topic('History');
var subscription = topic_history.subscription('newMessages');
subscription.on('message', function(message) {       
       io.emit('chatmessage',message);
       subscription.ack(message.ackId).then(function(data){
           console.log(message.data + " Acknowledged " + message.ackId)

       });
  });


// listen (start app with node server.js) ======================================

console.log("App listening on port 8080");



        app.get('/api/todos', function(req, res) {            
            
            // subscription.pull().then((results) => {
            //     const messages = results[0];                
            //     console.log(`Received ${messages.length} messages.`);
            //     //io.emit('chatmessage','Message from server : Hi from Socket IO..!!');
            //     res.json(messages);
            // });
            res.json('success');
            // subscription.pull(function(err, messages) {
            //     if(err)
            //         res.send(err);
            //     res.json(messages);
            // });     

                // messages = [
                //   {
                //     ackId: '',     // ID used to acknowledge its receival.
                //     id: '',        // Unique message ID.
                //     data: '',      // Contents of the message.
                //     attributes: {} // Attributes of the message.
                //
                //     Helper functions:
                //     ack(callback): // Ack the message.
                //     skip():        // Free up 1 slot on the sub's maxInProgress value.
                //   },
                //   // ...
                // ]
                     
               
                // // use mongoose to get all todos in the database
                // Todo.find(function(err, todos) {
        
                //     // if there is an error retrieving, send the error. nothing after res.send(err) will execute
                //     if (err)
                //         res.send(err)
        
                //     res.json(todos); // return all todos in JSON format
                // });
        });
    
        // create todo and send back all todos after creation
        app.post('/api/todos', function(req, res) {
            

            topic_history.publish(req.body.text, function(err, messageIds, apiResponse) {                
                    res.json(messageIds);
                });
    
            // // create a todo, information comes from AJAX request from Angular
            // Todo.create({
            //     text : req.body.text,
            //     done : false
            // }, function(err, todo) {
            //     if (err)
            //         res.send(err);
    
            //     // get and return all the todos after you create another
            //     Todo.find(function(err, todos) {
            //         if (err)
            //             res.send(err)
            //         res.json(todos);
            //     });
            // });
    
        });
    
        // delete a todo
        app.delete('/api/todos/:todo_id', function(req, res) {
            // Todo.remove({
            //     _id : req.params.todo_id
            // }, function(err, todo) {
            //     if (err)
            //         res.send(err);
    
            //     // get and return all the todos after you create another
            //     Todo.find(function(err, todos) {
            //         if (err)
            //             res.send(err)
            //         res.json(todos);
            //     });
            // });
            console.log("Delete request....");
        });

        app.get('/', function(req, res) {
            res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
        });
    
