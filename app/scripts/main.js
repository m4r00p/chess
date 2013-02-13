require.config({
  deps: [
    'polyfill'
  ],

  shim: {
  },

  paths: {
    chessboard: 'chessboard',
    app: 'app',
    jquery: 'vendor/jquery.min'
  }
});
 
require(['app'], function(app) {
  // use app here
  console.log('Start');
});
