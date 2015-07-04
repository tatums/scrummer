'use strict';

myControllers.controller('ShowController', [ '$scope',
        'retro',
        'responses',
        '$builder',
        '$validator',
        'socketio',
        function($scope,
            retro,
            responses,
            $builder,
            $validator,
            socketio) {

    $scope.retro = retro;
    $scope.responses = responses;
    var defaultForm = angular.fromJson(retro.form);

    $builder.forms['default'] = defaultForm;

    $scope.messages = ['hello'];

    console.log('reminder: There is an instance of socketio attached to window')
    window.socketio = socketio;



    socketio.on('send:message', function(message) {
        console.log('send:message', message)
        console.log('$scope.messages', $scope.messages)
        $scope.messages.push(message);
    });



    $scope.submit = function(form, validity){

        socketio.emit('send:message', {
            message: form.body
        });

        // add the message to our model locally
        $scope.messages.push({
          user: $scope.name,
          text: form.body
        });
        form.body = '';

    }



           // var room = 'retro'

           // io.on('connection', function(socket){
           //   socket.on(room, function(msg){
           //     io.emit(room, msg);
           //   });
           // });






}]);
