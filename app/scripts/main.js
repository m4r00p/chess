require.config({
  deps: [
    'polyfill'
  ],

  shim: {
  },

  paths: {
    app: 'app.js?'+(new Date()),
    jquery: 'vendor/jquery.min'
  }
});
 
require(['app'], function(app) {
  // use app here
  console.log('Start');
});
