'use strict';

import CONST from './enums/CONST';
import createDomElementInContainer from './utils/dom';

/**
 *
 * @param containerSelector
 * @constructor
 */
function ContextMenu(containerSelector) {
  // create and attach a contextMenuLayer
  const contextMenuLayer = createDomElementInContainer(containerSelector, 'div', 'contextMenuLayer', 'contextMenuLayer');

  // create a context menu
  this.contextMenuElement = createDomElementInContainer(`#${contextMenuLayer.id}`, 'ul', 'contextMenu', 'contextMenu');
}

ContextMenu.prototype.open = function _openC(position, options) {
  this.contextMenuElement.innerHTML = this._getContextMenuHTML(options);

  this.contextMenuElement.style.left = `${position[0]}px`;
  this.contextMenuElement.style.top = `${position[1]}px`;
  this.contextMenuElement.classList.add('opened');
};

ContextMenu.prototype.close = function _closeC() {
  this.contextMenuElement.classList.remove('opened');
};

ContextMenu.prototype._getContextMenuHTML = (options) => {
  let html = '';

  if (options.type === CONST.ENTITY_NODE) {
    html += '<li>Create Edge</li>';
    html += '<li>Delete Node</li>';
  }

  if (options.type === CONST.ENTITY_ROOT_SVG) {
    html += '<li>New Node</li>';
  }

  return html;
};

export default ContextMenu;