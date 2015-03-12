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
            $scope.$on('$routeChangeSuccess', function () {
                $scope.menu = $location.path().substr(1);
            });
        }]);
    angular.module('trainer').controller("unitCtrl", ['$scope', '$resource', '$routeParams', '$location', function ($scope, $resource, $routeParams, $location) {
            $scope.loaded = false;
            var Unit = $resource('https://api.mongolab.com/api/1/databases/trainer1/collections/units/:id?apiKey=2Sw3F_pv2AYcPuIGV9qtzgt9iy9gCZuW');
            var File = $resource('https://api.mongolab.com/api/1/databases/trainer1/collections/files/:id?apiKey=2Sw3F_pv2AYcPuIGV9qtzgt9iy9gCZuW');
            if (angular.isDefined($routeParams.id)) {
                Unit.get({id: $routeParams.id}, function (unit) {
                    $scope.unit = unit;
                    if (angular.isDefined($scope.unit.fileId)) {
                        File.get({id: $scope.unit.fileId.$oid}, function (file) {
                            $scope.file = file;
                            $scope.loaded = true;
                        });
                    } else {
                        $scope.file = new File();
                    }
                });
            } else {
                $scope.unit = new Unit();
                $scope.file = new File();
                $scope.loaded = true;
            }


            $scope.save = function () {
                $scope.file.$save(function (f) {
                    $scope.unit.fileId = f._id;
                    $scope.unit.$save();
                    $location.path('/units');
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
                            var scale = Math.min(500 / img.width, 500 / img.height);
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
            $scope.back = function () {
                $location.path("units");
            };
        }]);
    angular.module('trainer').controller("unitsCtrl", ['$scope', '$resource', '$location', function ($scope, $resource, $location) {
            $scope.loaded = false;
            var Unit = $resource('https://api.mongolab.com/api/1/databases/trainer1/collections/units/:id?apiKey=2Sw3F_pv2AYcPuIGV9qtzgt9iy9gCZuW');
            $scope.units = Unit.query(function () {
                $scope.loaded = true;
            });
            $scope.delete = function (unit) {
                new Unit(unit).$delete();
                $scope.units = Unit.query();
            };
            $scope.edit = function (unit) {
                $location.path("unit/" + unit._id.$oid);
            };
            $scope.add = function () {
                $location.path("unit");
            };
        }]);
    angular.module('trainer').controller("trainingsCtrl", ['$scope', '$resource', '$location', function ($scope, $resource, $location) {
            $scope.loaded = false;
            var Training = $resource('https://api.mongolab.com/api/1/databases/trainer1/collections/trainings/:id?apiKey=2Sw3F_pv2AYcPuIGV9qtzgt9iy9gCZuW');
            var Unit = $resource('https://api.mongolab.com/api/1/databases/trainer1/collections/units/:id?apiKey=2Sw3F_pv2AYcPuIGV9qtzgt9iy9gCZuW');
            var File = $resource('https://api.mongolab.com/api/1/databases/trainer1/collections/files/:id?apiKey=2Sw3F_pv2AYcPuIGV9qtzgt9iy9gCZuW');
            $scope.trainings = Training.query(function () {
                $scope.loaded = true;
            });
            $scope.delete = function (training) {
                new Training(training).$delete();
                $scope.trainings = Training.query();
            };
            $scope.edit = function (training) {
                $location.path("training/" + training._id.$oid);
            };
            $scope.store = function (training) {
                var trainings = [];
                if (angular.isDefined(localStorage.trainings)) {
                    trainings = angular.fromJson(localStorage.trainings);
                }
                for (var i = trainings.length - 1; i >= 0; i--) {
                    if (trainings[i]._id.$oid === training._id.$oid) {
                        trainings.splice(i, 1);
                    }
                }
                Unit.query({q: {_id: {$in: training.unitIds}}}, function (units) {
                    var fileIds = [];
                    angular.forEach(units, function (value) {
                        fileIds.push(value.fileId);
                    });
                    File.query({q: {_id: {$in: fileIds}}}, function (files) {
                        angular.forEach(units, function (unit) {
                            for(var i = 0; i < files.length; i++){
                                if(unit.fileId.$oid == files[i]._id.$oid){
                                    unit.file = files[i];
                                    break;
                                }
                            }
                        });
                        training.units = units;
                        trainings.push(training);
                        localStorage.trainings = angular.toJson(trainings);
                    });
                });
            };
            $scope.add = function () {
                $location.path("training");
            };
        }]);
    angular.module('trainer').controller("trainingCtrl", ['$scope', '$resource', '$routeParams', '$location', '$filter', function ($scope, $resource, $routeParams, $location, $filter) {
            $scope.loaded = false;
            var Training = $resource('https://api.mongolab.com/api/1/databases/trainer1/collections/trainings/:id?apiKey=2Sw3F_pv2AYcPuIGV9qtzgt9iy9gCZuW');
            var Unit = $resource('https://api.mongolab.com/api/1/databases/trainer1/collections/units/:id?apiKey=2Sw3F_pv2AYcPuIGV9qtzgt9iy9gCZuW');

            $scope.allUnits = Unit.query(function () {
                if (angular.isDefined($routeParams.id)) {
                    Training.get({id: $routeParams.id}, function (training) {
                        $scope.training = training;
                        if (angular.isArray(training.unitIds)) {
                            $scope.units = [];
                            angular.forEach($scope.allUnits, function (value, key) {
                                if ($scope.training.unitIds.indexOf(value._id.$oid) != -1) {
                                    $scope.units.push(value);
                                }
                            });
                        }
                        $scope.loaded = true;
                    });
                } else {
                    $scope.loaded = true;
                    $scope.units = [];
                    $scope.training = new Training();
                }
            });

            $scope.back = function () {
                $location.path("trainings");
            };

            $scope.add = function (unit) {
                if (angular.isDefined(unit) && $scope.units.indexOf(unit) == -1) {
                    $scope.units.push(unit);
                }
            };

            $scope.remove = function (unit) {
                var index = $scope.units.indexOf(unit);
                if (index > -1) {
                    $scope.units.splice(index, 1);
                }
            };

            $scope.save = function () {
                $scope.training.unitIds = [];
                angular.forEach($scope.units, function (value, key) {
                    $scope.training.unitIds.push(value._id);
                });
                $scope.training.$save();
                $location.path('/trainings');
            };
        }]);
     angular.module('trainer').controller("myTrainingsCtrl", ['$scope', '$resource', '$location', function ($scope, $resource, $location) {
            $scope.loaded = false;
            if(angular.isDefined(localStorage.trainings)){
                $scope.trainings = angular.fromJson(localStorage.trainings);
                console.log($scope.trainings)
                $scope.loaded = true;
            }else{
                $scope.loaded = true;
            }
        }]);
})();
