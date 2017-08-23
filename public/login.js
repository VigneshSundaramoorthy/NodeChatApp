var pubsub = angular.module('pubsub', []);

function loginController($scope, $http) {
    $scope.formData = {};
    $scope.messages = [];

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
        $http.post('/api/todos', $scope.formData)
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
    };

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
    
}