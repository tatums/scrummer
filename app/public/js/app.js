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


