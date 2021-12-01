'use strict';

import DataManager from '../DataManager';
import createDomElementInContainer from '../utils/dom';
import jsonview from 'jquery-jsonview';

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
    const dataToSave = {
      data: {
        nodes: DataManager.getAllNodes(),
        edges: DataManager.getAllEdges()
      }
    };

    DataManager.dialogLayer = createDomElementInContainer('.overlay-dialog.opened',
        'div',
        'overlay-export-all-json-dialog',
        'overlay-export-all-json-dialog'
    );
    DataManager.dialogLayer.innerHTML = _getHTML(JSON.stringify(dataToSave));

    // const json = JSON.stringify(dataToSave);
    // document.getElementById('jsonID').innerText = $('#json').JSONView('collapse');
  }
};

// document.getElementById(id).innerHTML= '<object type='text/html' data='new.html' width='100%' height='100%'></object>'

/**
 * @private
 */
const _getHTML = (data) => `
     <div class="export-all-json-dialog">
        <div class="header">
          <span>Json Data</span>
        </div>
        <div class="body">
            <span id="jsonID">${data}</span>
        </div>
        <div class="footer">
          <button class="close-dialog-btn">Close</button>
        </div>
      </div>`;

export default ExportManager;
