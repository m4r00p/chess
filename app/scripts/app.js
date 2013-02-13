define(['chessboard'], function(Chessboard) {
  'use strict';

  var board = new Chessboard();
  board.render($('.chessboard-wrapper')[0]);

  var $flip90 = $('<input type="button" value="Flip90"></button>');
  $flip90.on('click', board.flip90.bind(board));
  $(document.body).append($flip90);
});
