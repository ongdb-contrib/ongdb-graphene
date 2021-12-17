'use strict';

import createId from '../utils/id';
import color from '../utils/color';

import Property from './Property';
import PROPERTY_TYPES from '../enums/PROPERTY_TYPES';

class Node {
  /**
   * @param {object} options
   * @param {number} options.x
   * @param {number} options.y
   * @param {string} options.color
   * @param {string} options.label
   * @param {array} options.properties
   * @param {string} options.id
   * @constructor
   */
  constructor(options = {}) {
    const idPropertyConfig = { key: 'id', isRequired: true, type: PROPERTY_TYPES.ID, isAutoGenerated: true, isSystem: true };
    const idProperty = new Property(idPropertyConfig);

    const indexesPropertyConfig = { key: 'schema-indexes', isRequired: false, type: PROPERTY_TYPES.STRING, isAutoGenerated: false, isSystem: false, defaultValue: '//Properties-indexes:CREATE CONSTRAINT ON (n:Label) ASSERT n.code IS UNIQUE;\n' +
          '//CREATE INDEX ON :Label(name);' };
    const indexesProperty = new Property(indexesPropertyConfig);

    this.x = options.x;
    this.y = options.y;
    this.color = options.color || color();
    // 取消默认转小写操作
    // this.label = (options.label || 'new').toLowerCase();
    this.label = (options.label || 'new');
    this.properties = options.properties || [idProperty, indexesProperty];
    this.id = options.id || createId();
    this.isSelected = options.isSelected || false;
    this.isNode = true;
  }

  get copy() {
    return new Node((JSON.parse(JSON.stringify(this))));
  }
}

export default Node;
