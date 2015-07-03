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
