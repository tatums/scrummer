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
