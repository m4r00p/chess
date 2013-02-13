define(['browser'], function(browser) {
  'use strict';

  var map = {
    'P': 'pawn',
    'N': 'knight',
    'B': 'bishop',
    'R': 'rook',
    'Q': 'queen',
    'K': 'king'
  };

  var inversedMap = {
    'pawn': '',
    'knight': 'N',
    'bishop': 'B',
    'rook': 'R',
    'queen': 'Q',
    'king': 'K'
  };

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
      this.selected.style.backgroundColor = 'green';
    }

    event.preventDefault();
    return false;
  };

  Chessboard.prototype.place = function (element, position) {
    var style = element.style;

    element.x = position.x;
    element.y = position.y;

    if (browser.hasTransition) {
      style[browser.transformPropertyName] = 'translate3d(' + position.x + 'px,' + position.y+ 'px, 0)';
      //style['-webkit-transform'] = 'translate3d(' + position.x + 'px,' + position.y+ 'px, 0)';
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

      style[browser.transformPropertyName] = 'translate3d(' + position.x + 'px,' + position.y+ 'px, 0)';
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
  },

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

      entry = this.parseEntry(pieces[i], true);

      piece.className = 'piece' + ' ' + entry.kind + (i < 16 ? '-black' : '-white');

      this.place(piece, entry);

      fragment.appendChild(piece);
    }

    this.root.appendChild(fragment);
  };

  Chessboard.prototype.flip90 = function () {
    console.log('Flip');
    var $pieces = $('.piece');
    for (var i = 0, leni = $pieces.length, piece; i < leni; ++i) {
      piece = $pieces[i]; 

      this.place(piece, {
        x: piece.y,
        y: piece.x
      });
    }
  };

  Chessboard.prototype.parseEntry = function (entry, flipped) {
    var x, y, kind, split;

    var size = 60;
    var values = !flipped ? 'abcdefgh' : 'hgfedcba';

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
    y = !flipped ? y : 7 - y;

    return {
      entry: entry,
      x: x * size,
      y: y * size,
      kind: kind
    };
  };

  return Chessboard;
});
