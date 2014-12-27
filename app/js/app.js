
angular.module('ngCartDemo', ['ngResource', 'ui.router', 'ngCart'])

.run (['$rootScope', '$state', function($rootScope, $state){
    $rootScope.$state = $state;

}])

.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function($locationProvider, $stateProvider, $urlRouterProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
    $stateProvider


        .state('site', {
            abstract:true,
            url: "/",
            controller:"main",
            template: "<div ui-view></div>"
        })


        .state('site.index', {
            url: "",
            templateUrl: 'partials/index.html'
        })

      .state('site.cart', {
            url: "cart",
            controller:"cart",
            templateUrl: 'partials/cart.html'
        })

        .state('site.docs', {
            url: "docs",
            templateUrl: 'partials/docs.html'
        })


}])
    .controller('main',[ '$http','ngCart', '$scope', function ($http, ngCart, $scope) {

        ngCart.setShipping(10.99);
        ngCart.setTaxRate(7.5);


    $http({method: 'GET', url: 'data/phones.json'})
        .success(function(data, status, headers, config) {
            $scope.products = data;
        })
        .error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });


}])

.controller('cart',['ngCart', '$log', '$scope', function (ngCart,$log, $scope) {
    $scope.showCart = function(){

        $log.info ('---Items in Cart:---');
        var cart = ngCart.toObject();
        $log.info (cart);
        $scope.checkout = cart;

    }

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

