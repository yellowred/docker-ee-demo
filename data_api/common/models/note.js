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
  
  Note.random = (next) => {
    console.log('111')
    
    next(null, require('crypto').randomBytes(256).toString('hex'))
  }
  
  
};
