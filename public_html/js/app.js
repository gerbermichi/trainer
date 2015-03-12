(function () {
    'use strict';

    var app = angular.module('trainer', ['ngMaterial', 'ngRoute', 'ngMessages', 'ngResource','ngSanitize']);
    app.config(['$mdThemingProvider', '$mdIconProvider', '$routeProvider', '$locationProvider', '$httpProvider', function ($mdThemingProvider, $mdIconProvider, $routeProvider, $locationProvider, $httpProvider) {
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
                    })
                    .when('/mytrainings', {
                        templateUrl: 'view/mytrainings.html',
                        controller: 'myTrainingsCtrl'
                    }).otherwise({redirectTo: '/units'});
        }]);

    app.filter('replaceNewLine', function () {
        return function (input) {
            return input.replace("\n","<br />")
        };
    });

})();
