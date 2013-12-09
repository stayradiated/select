
'use strict';

var Sort, Rectangle;

Rectangle = require('./rectangle');

Sort = function (options) {

  this.vent = options.vent;
  this.items = options.items;
  this.container = options.container;

  this.parent = null;
  this.closestItem = null;
  this.selected = null;
  this.above = null;

  this.sorting = false;
  this.startPoint = null;

  this.placeholder = document.createElement('div');
  this.placeholder.className = 'placeholder';

  this.prepare = this.prepare.bind(this);
  this.move = this.move.bind(this);
  this.start = this.start.bind(this);
  this.end = this.end.bind(this);

  this.vent.on('prepare-drag', this.prepare);
  this.vent.on('start-drag', this.start);
  this.vent.on('move-drag', this.move);
  this.vent.on('end-drag', this.end);

};

Sort.prototype.getIndex = function (item) {
  return Array.prototype.indexOf.call(this.parent.children, item);
};

Sort.prototype.prepare = function (selected) {
  this.parent = this.items.elements[0].parentElement;
  this.selected = selected;
  this.rect = new Rectangle(this.container.getBoundingClientRect());
  this.rect.move(window.pageXOffset, window.pageYOffset);
};

Sort.prototype.start = function () {
  var length, endPoint;
  this.items.refreshPosition();

  // Figure out some stuff about the selected items
  length = this.selected.length;
  endPoint = this.getIndex(this.selected[length - 1]) + 1;
  this.startPoint = this.getIndex(this.selected[0]);
  this.sequential = this.startPoint + length === endPoint;
};

Sort.prototype.move = function (event) {

  // Loop through each item
  // Calculate distance from cursor to item
  // Find closest item
  // Insert placeholder before or after item

  var i, len, el, item, closest, distance, above;

  // Don't do anything if the users cursor isn't inside the parent container
  if (! this.rect.contains(event.pageX, event.pageY)) {
    return;
  }

  closest = Infinity;
  len = this.items.elements.length;

  // Find the closest item to the cursor
  for (i = 0; i < len; i++) {
    el = this.items.elements[i];

    // Skip items that are selected
    if (this.selected.indexOf(el) > -1) {
      continue;
    }

    distance = el.rect.distance(event.pageY);

    if (distance[0] < closest) {
      closest = distance[0];
      item = el;
      above = distance[1];
    }

  }


  // Only update the dom if the item or position from the mouse is changed
  if (this.closestItem !== item || this.above !== above) {

    this.sorting = true;

    // Insert the placeholder above or below the item
    if (above) {
      this.parent.insertBefore(this.placeholder, item);
    } else {
      this.parent.insertBefore(this.placeholder, item.nextSibling);
    }

    this.closestItem = item;
    this.above = above;
    this.items.refreshPosition();
  }


};


Sort.prototype.end = function () {
  var i, len, position;

  if (! this.sorting) {
    return;
  }

  this.sorting = false;
  len = this.selected.length;
  position = this.getIndex(this.placeholder);

  // If the items haven't actually moved, then don't move them
  if (position > this.startPoint ?
      position - len === this.startPoint :
      this.sequential ? this.startPoint === position : false
  ) {
    this.parent.removeChild(this.placeholder);
    return;
  }

  // Move each of the selected items to where the placeholder was
  for (i = 0; i < len; i++) {
    this.parent.insertBefore(this.selected[i], this.placeholder);
  }

  // Remove the placeholder
  this.parent.removeChild(this.placeholder);

  // Alert the user
  this.vent.emit('sort', this.selected, position);
};

module.exports = Sort;
