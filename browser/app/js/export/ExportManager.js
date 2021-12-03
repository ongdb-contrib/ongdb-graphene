'use strict';

import jsonview from 'jquery-jsonview';
import Dialog from '../ui/dialog';
import overlayOperationDialogBodySpan from '../utils/dialog/domSpan';
import SaveManager from '../SaveManager';

/** ====================================================================================================================
 * @type {Object}
 ==================================================================================================================== */
const ExportManager = {

  /**
   * @param {Object} rawData
   * @param {array} rawData.nodes - An Array of nodes
   * @param {array} rawData.edges - An Array of edges
   * @param {boolean} isFromHistory - if the load is from history or save no savable event should be fired
   * @returns {Object}
   */
  json: () => {
    const _dataToSave = SaveManager.getSaves();
    const vl = document.getElementById('overlay-operation-dialog-body-span-id');
    if (vl !== null) {
      Dialog.open(false);
    } else {
      $('.overlay-dialog.opened .dialog .body').JSONView(_dataToSave);
      const comElement = overlayOperationDialogBodySpan();
      comElement.innerHTML = ['JSON字符串：', JSON.stringify(_dataToSave)].join('');
    }
  }
};

export default ExportManager;
