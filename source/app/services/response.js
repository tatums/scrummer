myServices.factory('Response', [ '$resource', function($resource) {
    return $resource('/responses/:id', {}, {
        all: {
            method: 'get' // this method issues a PUT request
        }
    })
}]);
