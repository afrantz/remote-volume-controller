'use strict';

var app = angular.module('RemoteVolumeController', ['ngMaterial']);

app.controller('AppCtrl', ['$scope', 'socket', function($scope, socket) {
    socket.emit('getVolume', {}, function(err, data) {
        if (!err)
            $scope.volume = data;
    });

    socket.on('volumeChanged', function(data) {
        $scope.volume = data;
    });

    $scope.updateVolume = function() {
        socket.emit('updateVolume', $scope.volume);
    };
}]);