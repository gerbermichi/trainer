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
            $scope.training = {};
            var Training = $resource('https://api.mongolab.com/api/1/databases/trainer1/collections/trainings/:trainingId?apiKey=2Sw3F_pv2AYcPuIGV9qtzgt9iy9gCZuW', {trainingId: '@id'});

            $scope.save = function () {
                var training = new Training();
                console.log($scope.training.file);
                angular.copy($scope.training, training);
                $scope.training = {};
                training.$save();
            };

            var halfSize = function (i) {
                var canvas = document.createElement("canvas");
                canvas.width = i.width / 2;
                canvas.height = i.height / 2;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(i, 0, 0, canvas.width, canvas.height);
                return canvas;
            };

            $scope.setFiles = function (element) {
                var reader = new FileReader();
                var file = element.files[0];
                reader.onloadend = function () {
                    var img = new Image();
                    img.onload = function () {
                        $scope.$apply(function () {
                            var mainCanvas = document.createElement("canvas");
                            mainCanvas.width = 1024;
                            mainCanvas.height = 768;
                            var ctx = mainCanvas.getContext("2d");
                            ctx.drawImage(img, 0, 0, mainCanvas.width, mainCanvas.height);
                            while (mainCanvas.width > 500) {
                                var canvas = document.createElement("canvas");
                                canvas.width = mainCanvas.width / 2;
                                canvas.height = mainCanvas.height / 2;
                                var ctx = canvas.getContext("2d");
                                ctx.drawImage(mainCanvas, 0, 0, canvas.width, canvas.height);
                                mainCanvas = canvas;
                            }
                            $scope.training.file = mainCanvas.toDataURL("image/jpeg");
                        });
                    };
                    img.src = reader.result;
                };

                if (file) {
                    reader.readAsDataURL(file);
                } else {
                    $scope.training.file = undefined;
                }
            };

        }]);
    angular.module('trainer').controller("trainingsCtrl", ['$scope', '$resource', function ($scope, $resource) {
            var Training = $resource('https://api.mongolab.com/api/1/databases/trainer1/collections/trainings/:trainingId?apiKey=2Sw3F_pv2AYcPuIGV9qtzgt9iy9gCZuW', {trainingId: '@id'});
            $scope.trainings = Training.query();
        }]);


})();
