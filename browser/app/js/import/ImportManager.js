'use strict';

import jsonview from 'jquery-jsonview';
import Dialog from '../ui/dialog';
import overlayOperationDialogBodySpan from '../utils/dialog/domSpan';
import createDomElementInContainer from '../utils/dom';

/** ====================================================================================================================
 * @type {Object}
 ==================================================================================================================== */
const ImportManager = {

  /**
   * @param {Object} rawData
   * @param {array} rawData.nodes - An Array of nodes
   * @param {array} rawData.edges - An Array of edges
   * @param {boolean} isFromHistory - if the load is from history or save no savable event should be fired
   * @returns {Object}
   */
  singleModleGraphJson: () => {
    // 1、创建输入框，接收JSON
    // 2、使用load按钮加载数据到图
    const vl = document.getElementById('overlay-operation-dialog-body-span-id');

    document.querySelector('.overlay-dialog.opened .dialog .footer .load-btn').style.display = 'inline';

    if (vl !== null) {
      Dialog.open(false);
    } else {
      document.querySelector('.overlay-dialog.opened .dialog .body .saves-list').remove();
      // 创建用来中间跳转的span
      overlayOperationDialogBodySpan();
      // span绑定输入框
      document.querySelector('.overlay-dialog.opened .dialog .body')
          .insertAdjacentHTML('beforeend', _getHTML());

      // 创建样例数据预览的DIV
      createDomElementInContainer('.overlay-dialog.opened .dialog .body',
            'view-div',
            'view-div',
            'view-div'
        );
      $('.overlay-dialog.opened .dialog .body .view-div').JSONView(_demoJson);

        // 创建样例数据预览【字符串】的SPAN
      const element = createDomElementInContainer('.overlay-dialog.opened .dialog .body',
            'span',
            'view-div-temp',
            'view-div-temp'
        );
      element.innerHTML = ['JSON字符串：', _demoJson].join('');
    }
  },

  /**
   * 获取浏览器输入的JSON数据
   */
  getInputJsonData: () => {
    const inputData = document.querySelector('.overlay-dialog.opened .dialog .body .overlay-operation-dialog-body-input').value;
    return JSON.parse(inputData)['data'];
  },
    /**
     * 获取浏览器输入的JSON数据
     */
  getDemoJson: () => {
    return _demoJson;
  }
};

/**
 * @param saves
 * @private style='height: 256px; width: 512px;'
 */
const _getHTML = () => `
          <input type='text' placeholder='输入支持前端直接渲染的JSON格式数据！！！' class="overlay-operation-dialog-body-input" value=''/>样例JSON格式：`;

const _demoJson = '{\n' +
    '  "id": "a6b34397",\n' +
    '  "date": "2/11/2021 3:48pm",\n' +
    '  "name": "人物与电影DEMO",\n' +
    '  "data": {\n' +
    '    "nodes": [\n' +
    '      {\n' +
    '        "x": 731,\n' +
    '        "y": 228,\n' +
    '        "color": "#f05179",\n' +
    '        "label": "person",\n' +
    '        "properties": [\n' +
    '          {\n' +
    '            "id": "ab8b5f82",\n' +
    '            "key": "id",\n' +
    '            "type": "ID",\n' +
    '            "defaultValue": "",\n' +
    '            "limitMin": "",\n' +
    '            "limitMax": "",\n' +
    '            "isRequired": true,\n' +
    '            "isAutoGenerated": true,\n' +
    '            "isSystem": true,\n' +
    '            "description": ""\n' +
    '          },\n' +
    '          {\n' +
    '            "id": "a29ea3b7",\n' +
    '            "key": "name",\n' +
    '            "type": "String",\n' +
    '            "defaultValue": "",\n' +
    '            "limitMin": "",\n' +
    '            "limitMax": "",\n' +
    '            "isRequired": true,\n' +
    '            "isAutoGenerated": false,\n' +
    '            "isSystem": false,\n' +
    '            "description": "名称"\n' +
    '          },\n' +
    '          {\n' +
    '            "id": "a2949994",\n' +
    '            "key": "born",\n' +
    '            "type": "String",\n' +
    '            "defaultValue": "",\n' +
    '            "limitMin": "",\n' +
    '            "limitMax": "",\n' +
    '            "isRequired": false,\n' +
    '            "isAutoGenerated": false,\n' +
    '            "isSystem": false,\n' +
    '            "description": "生日"\n' +
    '          }\n' +
    '        ],\n' +
    '        "id": "af90ada8",\n' +
    '        "isSelected": false,\n' +
    '        "isNode": true\n' +
    '      },\n' +
    '      {\n' +
    '        "x": 612,\n' +
    '        "y": 417,\n' +
    '        "color": "#6379cf",\n' +
    '        "label": "movie",\n' +
    '        "properties": [\n' +
    '          {\n' +
    '            "id": "afb60ca7",\n' +
    '            "key": "id",\n' +
    '            "type": "ID",\n' +
    '            "defaultValue": "",\n' +
    '            "limitMin": "",\n' +
    '            "limitMax": "",\n' +
    '            "isRequired": true,\n' +
    '            "isAutoGenerated": true,\n' +
    '            "isSystem": true,\n' +
    '            "description": ""\n' +
    '          },\n' +
    '          {\n' +
    '            "id": "a4b33fb2",\n' +
    '            "key": "title",\n' +
    '            "type": "String",\n' +
    '            "defaultValue": "",\n' +
    '            "limitMin": "",\n' +
    '            "limitMax": "",\n' +
    '            "isRequired": true,\n' +
    '            "isAutoGenerated": false,\n' +
    '            "isSystem": false,\n' +
    '            "description": "电影名称"\n' +
    '          },\n' +
    '          {\n' +
    '            "id": "a5836ebb",\n' +
    '            "key": "tagline",\n' +
    '            "type": "String",\n' +
    '            "defaultValue": "",\n' +
    '            "limitMin": "",\n' +
    '            "limitMax": "",\n' +
    '            "isRequired": false,\n' +
    '            "isAutoGenerated": false,\n' +
    '            "isSystem": false,\n' +
    '            "description": "电影简介"\n' +
    '          },\n' +
    '          {\n' +
    '            "id": "a2969684",\n' +
    '            "key": "released",\n' +
    '            "type": "String",\n' +
    '            "defaultValue": "",\n' +
    '            "limitMin": "",\n' +
    '            "limitMax": "",\n' +
    '            "isRequired": true,\n' +
    '            "isAutoGenerated": false,\n' +
    '            "isSystem": false,\n' +
    '            "description": "发行时间"\n' +
    '          }\n' +
    '        ],\n' +
    '        "id": "a9ba9c85",\n' +
    '        "isSelected": false,\n' +
    '        "isNode": true\n' +
    '      }\n' +
    '    ],\n' +
    '    "edges": [\n' +
    '      {\n' +
    '        "startNodeId": "af90ada8",\n' +
    '        "endNodeId": "a9ba9c85",\n' +
    '        "middlePointOffset": [\n' +
    '          30.5,\n' +
    '          36.5\n' +
    '        ],\n' +
    '        "properties": [\n' +
    '          {\n' +
    '            "id": "ac8b8991",\n' +
    '            "key": "id",\n' +
    '            "type": "ID",\n' +
    '            "defaultValue": "",\n' +
    '            "limitMin": "",\n' +
    '            "limitMax": "",\n' +
    '            "isRequired": true,\n' +
    '            "isAutoGenerated": true,\n' +
    '            "isSystem": true,\n' +
    '            "description": ""\n' +
    '          },\n' +
    '          {\n' +
    '            "id": "a2b5f298",\n' +
    '            "key": "roles",\n' +
    '            "type": "String",\n' +
    '            "defaultValue": "",\n' +
    '            "limitMin": "",\n' +
    '            "limitMax": "",\n' +
    '            "isRequired": true,\n' +
    '            "isAutoGenerated": false,\n' +
    '            "isSystem": false,\n' +
    '            "description": "出演角色名称"\n' +
    '          }\n' +
    '        ],\n' +
    '        "label": "acted_in",\n' +
    '        "id": "abb1a6a0",\n' +
    '        "isSelected": false,\n' +
    '        "isEdge": true\n' +
    '      }\n' +
    '    ]\n' +
    '  }\n' +
    '}';

export default ImportManager;
