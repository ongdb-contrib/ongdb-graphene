'use strict';

import jsonview from 'jquery-jsonview';
import Dialog from '../ui/dialog';
import overlayOperationDialogBodySpan from '../utils/dialog/domSpan';
import SaveManager from '../SaveManager';
import DataManager from '../DataManager';
import CONST from '../enums/CONST';
import json from '../utils/json/json';

/** ====================================================================================================================
 * @type {Object}
 ==================================================================================================================== */
const ExportManager = {

  /**
   * @description 生成JSON数据
   * @returns {Object}
   */
  json: () => {
    const _currentDataToSave = {
      data: {
        nodes: DataManager.getAllNodes(),
        edges: DataManager.getAllEdges()
      }
    };

    const _allDataToSave = SaveManager.getSaves();

    const data = { current: _currentDataToSave, all: _allDataToSave };

    const vl = document.getElementById('overlay-operation-dialog-body-span-id');
    if (vl !== null) {
      Dialog.open(false, CONST.MENU_EXPORT);
    } else {
      $('.overlay-dialog.opened .dialog .body').JSONView(data);
      const comElement = overlayOperationDialogBodySpan();
      comElement.innerHTML = ['JSON字符串：', JSON.stringify(data)].join('');
    }
  },

  /**
   * @description 上传JSON文件到服务器
   * @returns {Object}
   */
  uploadJson: () => {
    const vl = document.getElementById('overlay-operation-dialog-body-span-id');

    if (vl !== null) {
      Dialog.open(false, CONST.MENU_EXPORT);
    } else {
      document.querySelector('.overlay-dialog.opened .dialog .body .saves-list').remove();
      // 创建用来中间跳转的span
      overlayOperationDialogBodySpan();
      // 设置输入框，输入文件名，并设置上传按钮
      document.querySelector('.overlay-dialog.opened .dialog .body')
          .insertAdjacentHTML('beforeend', _getHTML());
      // 绑定点击事件
      _setupUpload();
    }
  }
};

/**
 * @private
 */
const _setupUpload = () => {
  document.querySelector('.overlay-dialog.opened .dialog .body').addEventListener('click', (e) => {
    const target = e.target;
    const className = target.classList[0];

    /**
     * @description 获取当前正在操作的数据
     */
    const _dataToSave = {
      data: {
        nodes: DataManager.getAllNodes(),
        edges: DataManager.getAllEdges()
      }
    };

    switch (className) {
      case 'upload-json-file-new-save-commit-btn':
        const fileName = document.getElementById('upload-json-file-new-save-input').value;
        // 保存文件
        json.save(fileName, _dataToSave);
        break;
      default:
        break;
    }
  });
};

/**
 * @param saves
 * @private style='height: 256px; width: 512px;'
 */
const _getHTML = () => `
       <div class="upload-json-file-new-save">
<input id='upload-json-file-new-save-input' type="text" maxlength="20" placeholder="Sets the file name for the current model" class="text-input" />
          <button class="upload-json-file-new-save-commit-btn">upload</button>
       </div>`;

export default ExportManager;
