'use strict';

import DataManager from '../DataManager';
import createDomElementInContainer from '../utils/dom';
import jsonview from 'jquery-jsonview';
import Dialog from "../ui/dialog";

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

    const json = JSON.stringify(dataToSave);
    DataManager.dialogLayer.innerHTML = _getHTML(json);
    $('#overlay-export-all-json-dialog-json-id').JSONView(json, {collapsed: true, nl2br: true});

    DataManager.dialogLayer.addEventListener('click', (e) => {
      // const target = e.target;
      // const className = target.classList[0];
      // console.log(className);
      // switch (className) {
      //   case 'close-overlay-export-all-json-dialog-btn':
      //     DataManager.dialogLayer.classList.remove('overlay-export-all-json-dialog');
      //     break;
      //   default:
      //     break;
      // }
      //   document.getElementById('overlay-export-all-json-dialog').style.display = 'none';
      //   document.querySelector('.overlay-export-all-json-dialog').style.display = 'none';
        $('.overlay-export-all-json-dialog').attr('display','none');
    });
  }
};

/**
 * @private
 */
const _getHTML = (data) => `
     <div class="export-all-json-dialog">
        <div class="header">
          <span>Json Data</span>
        </div>
        <div class="body">
            <span id="overlay-export-all-json-dialog-json-id"/></span>
            <span>${data}</span>
        </div>
        <div class="footer">
          <button class="close-overlay-export-all-json-dialog-btn">Close</button>
        </div>
      </div>`;

export default ExportManager;

