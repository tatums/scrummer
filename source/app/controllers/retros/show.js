'use strict';

myControllers.controller('ShowController', [
        '$scope',
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
            $scope.users = [];


            socketio.on('user:connection', function(data) {
                var i = $scope.users.indexOf(data)
                console.log('client received user:connection. data:', data);
                if (i != -1){
                    $scope.users.push(data);
                }
            });

            socketio.on('user:disconnect', function(data) {
                console.log('client received user:disconnect. data:', data);
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

        }
]);
