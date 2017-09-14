'use strict'

module.exports = function(Note) {
  
  
  
  Note.remoteMethod(
    'random',
    {
      accepts: [],
      returns: { type: "string", root: true },
      http: { path: '/random', verb: 'GET' }
    }
  );
  
  Note.random = () => {
    return require('crypto').randomBytes(256)
  }
  
  
};
