(function () {
    'use strict';

    angular.module('trainer').controller("layoutCtrl", ['$scope', '$mdSidenav', '$location', function ($scope, $mdSidenav, $location) {
            $scope.menu = $location.path().substr(1);
            $scope.setMenu = function (menu) {
                $scope.menu = menu;
                $location.path("/" + menu);
                $mdSidenav('left').toggle();
            };
            $scope.toggleList = function () {
                $mdSidenav('left').toggle();
            };
        }]);

    angular.module('trainer').controller("trainingCtrl", ['$scope', '$resource', function ($scope, $resource) {

            var Training = $resource('https://api.mongolab.com/api/1/databases/trainer/collections/training/:trainingId?apiKey=2Sw3F_pv2AYcPuIGV9qtzgt9iy9gCZuW', {trainingId: '@id'});
            $scope.save = function () {
                var training = new Training();
                console.log($scope.training.file);
                angular.copy($scope.training, training);
                $scope.training = null;
                training.$save();
            };

            $scope.setFiles = function (element) {
                var reader = new FileReader();
                var file = element.files[0];
                reader.onloadend = function () {
                    $scope.training.file = reader.result;
                };

                if (file) {
                    reader.readAsDataURL(file);
                } else{
                    $scope.training.file = undefined;
                }
            };

        }]);


})();
