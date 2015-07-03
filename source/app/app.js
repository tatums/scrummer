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


