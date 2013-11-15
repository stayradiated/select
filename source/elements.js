(function () {
  'use strict';

  var Elements;

  Elements = function (query) {
    this.query = query;
    this.selected = [];
  };

  Elements.prototype.reset = function(append) {
    var i, el, rect, pos;

    this.el = document.querySelectorAll(this.query);

    for (i = 0; i < this.el.length; i++) {

      el = this.el[i];

      if (! append) {
        el.className = '';
        el.selected = false;
      }

      rect = el.getBoundingClientRect();
      pos = {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset,
      };
      el.position = {
        top: pos.top,
        left: pos.left,
        bottom: pos.top + rect.height,
        right: pos.left + rect.width
      };
    }

    return this;
  };

  Elements.prototype.check = function(box) {
    var i, el, pos, hit;

    for (i = 0; i < this.el.length; i++) {

      el = this.el[i];
      pos = el.position;

      hit = !(
        pos.left   > box.right  ||
        pos.right  < box.left   ||
        pos.top    > box.bottom ||
        pos.bottom < box.top
      );

      if ((hit && !el.selected) || (!hit && el.selected)) {
        el.className = 'selected';
        el._selected = true;
      } else {
        el.className = '';
        el._selected = false;
      }

    }

    return this;

  };

  Elements.prototype.select = function() {
    var i, el;

    this.selected = [];

    for (i = 0; i < this.el.length; i++) {
      el = this.el[i];

      if (el._selected) {
        el._selected = false;
        el.selected = true;
        this.selected.push(el);
      } else {
        el.selected = false;
      }
    }

    return this;
  };

  module.exports = Elements;

}());