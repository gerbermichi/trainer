(function () {
    'use strict';

    var app = angular.module('trainer', ['ngMaterial', 'ngRoute', 'ngMessages', 'ngResource']);
    app.config(['$mdThemingProvider', '$mdIconProvider', '$routeProvider', '$locationProvider', '$httpProvider', function ($mdThemingProvider, $mdIconProvider, $routeProvider, $locationProvider, $httpProvider) {

            /*
             $mdIconProvider
             .defaultIconSet("./img/avatars.svg", 128)
             .icon("menu", "./img/menu.svg", 24)
             .icon("share", "./img/share.svg", 24)
             .icon("google_plus", "./img/google_plus.svg", 512)
             .icon("hangouts", "./img/hangouts.svg", 512)
             .icon("twitter", "./img/twitter.svg", 512)
             .icon("phone", "./img/phone.svg", 512);
             */

            $mdThemingProvider.theme('default')
                    .primaryPalette('blue');

            $routeProvider
                    .when('/unit', {
                        templateUrl: 'view/unit.html',
                        controller: 'unitCtrl'
                    })
                    .when('/unit/:id', {
                        templateUrl: 'view/unit.html',
                        controller: 'unitCtrl'
                    })
                    .when('/training', {
                        templateUrl: 'view/training.html',
                        controller: 'trainingCtrl'
                    })
                    .when('/training/:id', {
                        templateUrl: 'view/training.html',
                        controller: 'trainingCtrl'
                    })
                    .when('/units', {
                        templateUrl: 'view/units.html',
                        controller: 'unitsCtrl'
                    })
                    .when('/trainings', {
                        templateUrl: 'view/trainings.html',
                        controller: 'trainingsCtrl'
                    }).otherwise({redirectTo: '/units'});
        }]);


})();
