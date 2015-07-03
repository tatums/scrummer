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
