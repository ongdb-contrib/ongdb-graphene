'use strict';

import CONST from './enums/CONST';
import EVENTS from './enums/EVENTS';

import Node from './do/Node';
import Edge from './do/Edge';

import ContextMenu from './ContextMenu';
import PropertiesManager from './PropertiesManager';

/**
 * Handling events like: click, mousemove, dblclick ...
 */

/**
 *
 * @param {object} d3Element
 * @param {Element} RootDivElement
 * @constructor
 */
const InteractionManager = function _InteractionManagerC(d3Element, rootDivElement) {
  if (d3Element === undefined) {
    throw new Error('The EventManager needs a "container" to attach and listen for events.');
  }

  /* eslint-disable */
  //need to attach 'this' because the function will be called in different context
  var dispatch = this.dispatch.bind(this);
  /* eslint-enable */

  this._container = d3Element;
  this._eventCallbackHandlers = {};

  // user event handling
  this._container.on('click', _svgClickHandler);
  this._container.on('dblclick', _svgDbClickHandler);
  this._container.on('mousedown', _svgMouseDownHandler);
  this._container.on('mouseup', _svgMouseUpHandler);
  this._container.on('contextmenu', _contextClickHandler);

  const contextMenu = new ContextMenu(`#${rootDivElement.id}`);
  const propertiesManager = new PropertiesManager(`#${rootDivElement.id}`);

  /**
   *
   * @param node
   * @private
   */
  function _getTargetType(node) {
    const type = node.nodeName;
    const target = {};

    if (type === 'circle' && node.parentNode.getAttribute('class')) {
      target.type = CONST.ENTITY_NODE;
      target.id = node.parentNode.id;
    }

    if (type === 'svg' && node.id === CONST.SVGROOT_ID) {
      target.type = CONST.ENTITY_ROOT_SVG;
      target.id = node.id;
    }

    return target;
  }

  /**
   *
   */
  function _svgClickHandler() {
    const target = _getTargetType(event.target);

    // close the context menu
    contextMenu.close();

    // click on the root svg element
    if (target.type === CONST.ENTITY_ROOT_SVG) {
      /* eslint-disable */
      const node = new Node({
        x: d3.mouse(this)[0],
        y: d3.mouse(this)[1]
      });
      /* eslint-enable */

      d3.event.preventDefault();
      dispatch(EVENTS.ADD_NODE, node);
    }

    // click on node
    if (target.id && target.type === CONST.ENTITY_NODE) {
      propertiesManager.open(d3.mouse(this), target);

      dispatch(EVENTS.SELECT_NODE, target.id);
    } else {
      propertiesManager.close();
    }
  }

  /**
   *
   */
  function _contextClickHandler() {
    d3.event.preventDefault();
    contextMenu.open(d3.mouse(this), _getTargetType(d3.event.target));
  }

  /**
   *
   */
  function _svgMouseDownHandler() {
    // const target = d3.event.target;
    // console.log('svgMouseDownHandler');
    // editor.svg.on("mousemove", svgMouseMoveHandler);
    d3.event.preventDefault();
  }

  /**
   *
   */
  function _svgMouseMoveHandler() {
    // const target = d3.event.target;
    // console.log('svgMouseMoveHandler');
    d3.event.preventDefault();
  }

  /**
   *
   */
  function _svgMouseUpHandler() {
    // const target = d3.event.target;
    // console.log('svgMouseUpHandler');
    // editor.svg.on("mousemove", null);
    d3.event.preventDefault();
  }

  /**
   *
   */
  function _svgDbClickHandler() {
    // const target = d3.event.target;
    // console.log('svgDbClickHandler');
    d3.event.preventDefault();

    // dispatch(EVENTS.SELECT_NODE, {});
    // dispatch(EVENTS.SELECT_EDGE, {});
  }
};

/**
 *
 * @param {string} eventType
 * @param {object} eventData
 */
InteractionManager.prototype.dispatch = function _dispatchC(eventType, eventData) {
  if (!this._eventCallbackHandlers[eventType]) {
    return;
  }

  this._eventCallbackHandlers[eventType].forEach(callbackHandler => callbackHandler(eventData));
};

/**
 *
 * @param {string} eventType
 * @param {function} callbackHandler
 */
InteractionManager.prototype.on = function _onC(eventType, callbackHandler) {
  const eventCallbackHandlers = this._eventCallbackHandlers[eventType];

  if (!eventCallbackHandlers) {
    this._eventCallbackHandlers[eventType] = [];
  }

  this._eventCallbackHandlers[eventType].push(callbackHandler);
};

/**
 *
 * @param {string} eventType
 * @param {function} callbackHandler
 */
InteractionManager.prototype.off = (eventType, callbackHandler) => {
  this._eventCallbackHandlers[eventType].forEach((callback, i) => {
    if (callback === callbackHandler) {
      this._eventCallbackHandlers[eventType].splice(i, 1);
    }
  });
};

export default InteractionManager;