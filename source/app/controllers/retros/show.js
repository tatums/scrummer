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
