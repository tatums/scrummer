'use strict';

var myApp = angular.module('myApp', [
        'ngRoute',
        'myControllers',
        'myServices',
        'builder',
        'builder.components',
        'validator.rules'
]);

var myServices = angular.module('myServices', ['ngResource']);
var myControllers = angular.module('myControllers', []);

'use strict';

angular.module('myApp').config( function($routeProvider, $locationProvider) {

    $routeProvider
        .when('/', {
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
        .when('/retros/new', {
            templateUrl: 'templates/retros/new.html',
            controller: 'NewController'
        })
        .when('/retros/:id', {
            templateUrl: 'templates/retros/show.html',
            controller: 'ShowController',
            resolve: {
                retro: function($q, Retro, $route) {
                    var deferred = $q.defer();
                    Retro.get({id: $route.current.params.id}).$promise.then(function(data){
                        deferred.resolve(data)
                    });
                    return deferred.promise;
                },
                responses: function($q, Response, $route) {
                    var deferred = $q.defer();
                    Response.all({retro_id: $route.current.params.id}).$promise.then(function(data){
                        deferred.resolve(data.responses)
                    });
                    return deferred.promise;
                }
            }
        })

    .otherwise({
        redirectTo: '/'
    });
});



'use strict';

myControllers.controller('FormCanvasController', [
        '$scope',
        'Retro',
        '$builder',
        '$validator', function($scope, Retro, $builder, $validator){

      $scope.formCanvas = $builder.forms['default'];
      $scope.input = [];
      $scope.defaultValue = {};


    this.submit = function(formData, validity, retros){

        if (validity) {

            var r = new Retro();
            r.title = formData.title;
            r.form = angular.toJson( $scope.formCanvas );

            console.log('fd', formData)
            console.log('r', r)

            r.$save().then(function(data) {

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
        '$validator', function($scope, retro, responses, $builder, $validator) {

    $scope.retro = retro;
    $scope.responses = responses;
    var defaultForm = angular.fromJson(retro.form);

    $builder.forms['default'] = defaultForm;


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
