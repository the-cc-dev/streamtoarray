'use strict';

const streamToArray = function (stream, callback) {
  if (!stream) {
    throw new Error('Stream is missing.');
  }
  if (!callback) {
    throw new Error('Callback is missing.');
  }

  /* eslint-disable no-underscore-dangle */
  if (stream._readableState.ended) {
    return callback(new Error('Stream is closed.'));
  }
  /* eslint-enable no-underscore-dangle */

  const array = [];

  let onData,
      onEnd,
      onError,
      unsubscribe;

  unsubscribe = function () {
    stream.removeListener('data', onData);
    stream.removeListener('error', onError);
    stream.removeListener('end', onEnd);
  };

  onData = function (data) {
    array.push(data);
  };

  onError = function (err) {
    unsubscribe();
    callback(err);
  };

  onEnd = function () {
    unsubscribe();
    callback(null, array);
  };

  stream.on('data', onData);
  stream.on('error', onError);
  stream.on('end', onEnd);
};

module.exports = streamToArray;