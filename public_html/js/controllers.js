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

    angular.module('trainer').controller("trainingCtrl", ['$scope', '$resource','$routeParams','$location', function ($scope, $resource,$routeParams,$location) {
            $scope.loaded = false;
            var Training = $resource('https://api.mongolab.com/api/1/databases/trainer1/collections/trainings/:id?apiKey=2Sw3F_pv2AYcPuIGV9qtzgt9iy9gCZuW');
            var File = $resource('https://api.mongolab.com/api/1/databases/trainer1/collections/files/:id?apiKey=2Sw3F_pv2AYcPuIGV9qtzgt9iy9gCZuW');
            if(angular.isDefined($routeParams.id)){
                Training.get({id:$routeParams.id},function(training){
                    $scope.training = training;
                    if(angular.isDefined($scope.training.fileId)){
                        File.get({id:$scope.training.fileId},function(file){
                            $scope.file = file;
                            $scope.loaded = true;
                        });
                    }else{
                        $scope.file = new File();
                    }
                });
            }else{
                $scope.training = new Training();
                $scope.file = new File();
                $scope.loaded = true;
            }
           
          
            $scope.save = function () {
                $scope.file.$save(function(f){
                    $scope.training.fileId = f._id.$oid;
                    $scope.training.$save();
                    $location.path('/trainings');
                });
            };
            
            $scope.setFiles = function (element) {
                var reader = new FileReader();
                var file = element.files[0];
                reader.onloadend = function () {
                    var img = new Image();
                    img.onload = function () {
                        $scope.$apply(function () {
                            var mainCanvas = document.createElement("canvas");
                            var scale = Math.min(500/img.width,500/img.height);
                            mainCanvas.width = img.width * scale;
                            mainCanvas.height = img.height * scale;
                            var ctx = mainCanvas.getContext("2d");
                            ctx.drawImage(img, 0, 0, mainCanvas.width, mainCanvas.height);
                            $scope.file.data = mainCanvas.toDataURL("image/jpeg");
                        });
                    };
                    img.src = reader.result;
                };

                if (file) {
                    reader.readAsDataURL(file);
                } else {
                    $scope.file.data = undefined;
                }
            };

        }]);
    angular.module('trainer').controller("trainingsCtrl", ['$scope', '$resource','$location', function ($scope, $resource,$location) {
            var Training = $resource('https://api.mongolab.com/api/1/databases/trainer1/collections/trainings/:trainingId?apiKey=2Sw3F_pv2AYcPuIGV9qtzgt9iy9gCZuW', {trainingId: '@id'});
            $scope.trainings = Training.query();
            
            
            $scope.delete = function(training){
                new Training(training).$delete();
                $scope.trainings = Training.query();
            };
            
            $scope.edit = function(training){
                $location.path("training/"+training._id.$oid);
            };
            
             $scope.add = function(){
                $location.path("training");
            };
        }]);


})();
