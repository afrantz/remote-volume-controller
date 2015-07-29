var loudness = require('loudness');
var CronJob = require('cron').CronJob;

var volume;
var updateVolumeDate;
var updateVolumeDateBySocket;

module.exports = function(socket) {
  new CronJob({
    cronTime: '* * * * * *',
    onTick: function() {
      loudness.getVolume(function(err, data) {
        if (!err) {
          if (volume && data != volume) {
            updateVolumeDate = Date.now();
            if (!updateVolumeDateBySocket || updateVolumeDate - updateVolumeDateBySocket > 1000) {
              socket.emit('volumeChanged', data);
            }
          }
          volume = data;
        }
      });
    },
    start: true
  });

  socket.on('getVolume', function(data, callback) {
    loudness.getVolume(callback);
  });

  socket.on('updateVolume', function(data, callback) {
    loudness.setVolume(data, function(err) {
      if (!err) {
        updateVolumeDateBySocket = Date.now();
        socket.broadcast.emit('volumeChanged', data);
      }
      if (callback)
        return callback(err);
    });
  });
};