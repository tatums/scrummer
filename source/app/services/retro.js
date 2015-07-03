myServices.factory('Retro', [ '$resource', function($resource) {
    return $resource('/retros/:id')
}]);
