
var app = angular.module('ngCartDemo', ['ngResource', 'ui.router', 'ngCart']);


app.run (['$rootScope', '$state', function($rootScope, $state){
    $rootScope.$state = $state;

}])

app.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function($locationProvider, $stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider


        .state('site', {
            abstract:true,
            url: "/",
            template: "<div ui-view></div>"
        })


        .state('site.index', {
            url: "",
            templateUrl: 'partials/index.html'
        })

      .state('site.cart', {
            url: "cart",
            templateUrl: 'partials/cart.html'
        })

        .state('site.docs', {
            url: "docs",
            templateUrl: 'partials/docs.html'
        })


}]);
    app.controller('main',[ '$http','ngCart', '$scope', function ($http, ngCart, $scope) {

        ngCart.setShipping(10.99);
        ngCart.setTax(13);


    $http({method: 'GET', url: 'data/phones.json'}).
        success(function(data, status, headers, config) {
            $scope.products = data;
        }).
        error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });

}])

    .directive('rainbowBlock', function () {

    return {
        restrict: 'A',
        link: function(el) {
            Rainbow.color();
        }
    };
})
;

