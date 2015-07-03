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
