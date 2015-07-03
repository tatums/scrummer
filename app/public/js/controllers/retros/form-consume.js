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
