'use strict';

var myApp = angular.module('myApp', [
        'ui.router',
        'myControllers',
        'myServices',
        'builder',
        'builder.components',
        'validator.rules',
        'ui.bootstrap'
]);

var myServices = angular.module('myServices', ['ngResource']);
var myControllers = angular.module('myControllers', []);

'use strict';


angular.module('myApp').config( function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');


    $stateProvider
        .state('root', {
            url: '/',
            templateUrl: 'templates/index.html',
            controller: 'IndexController',
            resolve: {
                retros: function($q, Retro) {
                    var deferred = $q.defer();
                    Retro.query().$promise.then(function(data){
                        deferred.resolve(data)
                    });
                    return deferred.promise;
                }
            }
        })

        .state('retros', {
            templateUrl: 'templates/retros/base.html',
        })

        .state('retros.index', {
            url: '/retros',
            templateUrl: 'templates/retros/index.html',
            controller: 'IndexController',
            resolve: {
                retros: function($q, Retro) {
                    var deferred = $q.defer();
                    Retro.query().$promise.then(function(data){
                        deferred.resolve(data)
                    });
                    return deferred.promise;
                }
            }
        })
        .state('retros.new', {
            url: '/retros/new',
            templateUrl: 'templates/retros/new.html',
            controller: 'NewController'
        })

        .state('retros.show', {
            url: '/retros/:id',
            templateUrl: 'templates/retros/show.html',
            controller: 'ShowController',
            resolve: {
                retro: function($q, Retro, $stateParams) {
                    var deferred = $q.defer();
                    Retro.get({id: $stateParams.id}).$promise.then(function(data){
                        deferred.resolve(data)
                    });
                    return deferred.promise;
                },
                responses: function($q, Response, $stateParams) {
                    var deferred = $q.defer();
                    Response.all({retro_id: $stateParams.id}).$promise.then(function(data){
                        deferred.resolve(data.responses)
                    });
                    return deferred.promise;
                }
            }
        })

});



angular.module('myApp').controller('ModalDemoCtrl', function ($scope, $modal, $log) {

  $scope.items = ['item1', 'item2', 'item3'];

  $scope.animationsEnabled = true;

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };

});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.
angular.module('myApp').controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

'use strict';

myControllers.controller('FormCanvasController', [
        '$scope',
        'Retro',
        '$builder',
        '$validator', '$location', function($scope, Retro, $builder, $validator, $location){

      $scope.formCanvas = $builder.forms['default'];
      $scope.input = [];
      $scope.defaultValue = {};


    this.submit = function(formData, validity, retros){

        if (validity) {

            var r = new Retro();
            r.title = formData.title;
            r.form = angular.toJson( $scope.formCanvas );

            r.$save().then(function(data) {
                console.log('data')
                    console.log( $location.path("/")
                );
                //retros.push(data.retro)
                //this.$setPristine(true)
            })
        }
    }

}]);

'use strict';

myControllers.controller('FormConsumeController', [ '$scope', 'Response', function($scope, Response){

    this.submit = function(retro, formData, validity){

            var r = new Response();
            r.retro_id = retro._id;
            r.input = angular.toJson( formData );

            r.$save().then(function(data) {
                console.log(data)
                //this.$setPristine(true)
            })
            console.log(r)

    };


}]);

'use strict';

myControllers.controller('IndexController', [ '$scope', 'retros', 'Retro', function($scope, retros, Retro) {
    $scope.retros = retros;

    $scope.delete = function(retro){
        var index = $scope.retros.indexOf(retro)
        var r = new Retro();
        r.$delete({id: retro._id}).then(function(data) {
            $scope.retros.splice(index, 1);
        })
    };

}]);

'use strict';

myControllers.controller('NewController', [ '$scope', function($scope) {

}]);

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

myServices.factory('Response', [ '$resource', function($resource) {
    return $resource('/responses/:id', {}, {
        all: {
            method: 'get' // this method issues a PUT request
        }
    })
}]);

myServices.factory('Retro', [ '$resource', function($resource) {
    return $resource('/retros/:id')
}]);

'use strict';

myServices.factory('socketio', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function(eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function(eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});
