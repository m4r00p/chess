define(['browser'], function(browser) {
  'use strict';


  var Chessboard = function () {
  };

  Chessboard.prototype.render = function (where) {
    var root = this.root = document.createElement('div');

    root.className = 'chessboard';
    this.selected = null;

    this.createBoard();
    this.createPieces();

    where.appendChild(root);

    this.addEventListeners();
  };

  Chessboard.prototype.addEventListeners = function () {
    $(this.root).on('click', this.onClick.bind(this));
  };

  Chessboard.prototype.onClick = function (event) {
    var style, target = event.target;

    if (this.selected) {
      style = this.selected.style;
      style.backgroundColor = '';
      this.move(this.selected, target);
      this.selected = null;
    } else if (target.className.indexOf('piece') != -1) {
      this.selected = target
      this.selected.style.backgroundColor = 'rgb(0, 255, 0)';
    }

    event.preventDefault();
    return false;
  };

  Chessboard.prototype.place = function (element, position) {
    var style = element.style;

    element.x = position.x;
    element.y = position.y;

    if (browser.hasTransition) {
      style.webkitTransform = 'matrix3d(' +
        '1,0,0,0,' +
        '0,1,0,0,' +
        '0,0,1,0,' +
        position.x + ',' + position.y+ ',0,1)';
      } else {
      style.left = position.x + 'px';
      style.top = position.y + 'px';
    }
  };

  Chessboard.prototype.move = function (element, position) {
    var style = element.style;

    var speed = 480 / 500; // 480px entire chessboard per 2s
    var dx = position.x - element.x;
    var dy = position.y - element.y;
    var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    var duration = distance / speed;

    if (browser.hasTransition) {
      style.webkitTransform = 'matrix3d(' +
        '1,0,0,0,' +
        '0,1,0,0,' +
        '0,0,1,0,' +
        position.x + ',' + position.y+ ',0,1)';

      style[browser.transitionPropertyName + 'Duration'] = duration + 'ms';

      element.x = position.x;
      element.y = position.y;
    } else {
      var dt = 0;
      var start = Date.now();
      var loop = function () {
        dt = Date.now() - start;

        style.top = element.y + (dy * dt/duration) + 'px';
        style.left = element.x + (dx * dt/duration) + 'px';

        if (dt < duration) {
          requestAnimationFrame(loop);
        } else {
          style.top = position.y + 'px';
          style.left = position.x + 'px';

          element.x = position.x;
          element.y = position.y;
        }
      };

      loop();
    }
  };

  Chessboard.prototype.createBoard = function () {
    var size = 60;
    var fragment = document.createDocumentFragment();
    for (var i = 0, leni = 8; i < leni; ++i) {
      for (var j = 0, lenj = 8, field, style; j < lenj; ++j) {
        field = document.createElement('div');
        field.className = 'field ' + ((j + i) & 1 ? 'light' : 'dark');
        style = field.style;

        field.y = i * size;
        field.x = j * size;

        style.top = i * size + 'px';
        style.left = j * size + 'px';

        fragment.appendChild(field);
      }
    }

    this.root.appendChild(fragment);
  };

  Chessboard.prototype.createPieces = function () {
    var pieces = [
      'Ra8', 'Nb8', 'Bc8', 'Qd8', 'Ke8', 'Bf8', 'Ng8', 'Rh8',
      'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
      'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
      'Ra1', 'Nb1', 'Bc1', 'Qd1', 'Ke1', 'Bf1', 'Ng1', 'Rh1'
      ];

    var fragment = document.createDocumentFragment();
    for (var i = 0, leni = pieces.length, piece, style, entry; i < leni; ++i) {
      piece = document.createElement('div');
      style = piece.style;

      entry = this.parseEntry(pieces[i]);

      piece.className = 'piece ' + (i < 16 ? 'black' : 'white') + ' ' + entry.kind;

      this.place(piece, entry);

      fragment.appendChild(piece);
    }

    this.root.appendChild(fragment);
  };

  Chessboard.prototype.parseEntry = function (entry) {
    var x, y, kind, split;

    var size = 60;
    var values = 'abcdefgh';
    var map = {
      'P': 'pawn',
      'N': 'knight',
      'B': 'bishop',
      'R': 'rook',
      'Q': 'queen',
      'K': 'king'
    };

    split = entry.split(''); 

    if (split[0] === split[0].toUpperCase()) {
      kind = map[split[0]];
      x = values.indexOf(split[1]);
      y = split[2];
    } else {
      kind = map['P'];
      x = values.indexOf(split[0]);
      y = split[1];
    }

    y -= 1;

    return {
      x: x * size,
      y: y * size,
      kind: kind
    };
  };

  var board = new Chessboard();
  board.render($('.chessboard-wrapper')[0]);
});
