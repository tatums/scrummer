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
