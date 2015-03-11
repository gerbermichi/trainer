(function () {
    'use strict';

    var app = angular.module('trainer', ['ngMaterial', 'ngRoute', 'ngMessages', 'ngResource']);
    app.config(['$mdThemingProvider', '$mdIconProvider', '$routeProvider', '$locationProvider', function ($mdThemingProvider, $mdIconProvider, $routeProvider, $locationProvider) {

            $mdIconProvider
                    .defaultIconSet("./img/avatars.svg", 128)
                    .icon("menu", "./img/menu.svg", 24)
                    .icon("share", "./img/share.svg", 24)
                    .icon("google_plus", "./img/google_plus.svg", 512)
                    .icon("hangouts", "./img/hangouts.svg", 512)
                    .icon("twitter", "./img/twitter.svg", 512)
                    .icon("phone", "./img/phone.svg", 512);

            $mdThemingProvider.theme('default')
                    .primaryPalette('orange')
                    .accentPalette('red');

            $routeProvider
                    .when('/home', {
                        templateUrl: 'view/home.html'
                    })
                    .when('/training', {
                        templateUrl: 'view/training.html',
                        controller: 'trainingCtrl'
                    }).otherwise({redirectTo: '/training'});



        }]);


})();
