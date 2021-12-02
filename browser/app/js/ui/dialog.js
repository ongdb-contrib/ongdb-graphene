'use strict';

import CONST from '../enums/CONST';
import createDomElementInContainer from '../utils/dom';

import SaveManager from '../SaveManager';
import DataManager from '../DataManager';
import ExportManager from '../export/ExportManager';
import ImportManager from '../import/ImportManager';
import NotificationManager from "../NotificationManager";

/**
 * @type {string} The Id of the selected save entry
 */
let _selectedSaveId;

/**
 * @param {string} id
 * @private
 */
const _selectSave = (id) => {
  _selectedSaveId = id;
  Dialog.render();
};

const _createNewSave = () => {
  const dataToSave = {
    data: {
      nodes: DataManager.getAllNodes(),
      edges: DataManager.getAllEdges()
    }
  };

  const name = document.querySelector('.new-save-name-input').value;
  SaveManager.save(dataToSave, name);
};

/**
 * @param saves
 * @private
 */
const _getHTML = (saves) => `
     <div class="dialog">
        <div class="header">
          <span>Saved graphs</span>
          <button class="export-all-json left">Export All Json</button>
          <button class="import-from-json left">Import From Json</button>
          <button class="save-to-graphdatabases left">Associate With Graph Databases</button>
        </div>
        <div id="set_file_name" class="sub-header">
          <span>Save graph as:</span>
          <input type="text" maxlength="20" placeholder="Name of the save you wanna save." class="new-save-name-input" />
          <button class="save-btn">Save</button>
        </div>
        <div class="body">
          <ul class="saves-list">${_getSavesHTML(saves)}</ul>
        </div>
        <div class="footer">
          <button class="new-save-btn left">New Save</button>
          <button class="graph-task-mapping left">Graph Task Mapping</button>
          <button class="delete-btn" style="${!_selectedSaveId && 'display: none;'}">Delete</button>
          <button class="load-btn" style="${!_selectedSaveId && 'display: none;'}">Load</button>
          <button class="close-dialog-btn">Close</button>
        </div>
      </div>`;

/**
 * @param saves
 * @returns {string}
 * @private
 */
const _getSavesHTML = (saves) => {
  let html = ``;

  saves.forEach(save => {
    html += `
    <li class="save-entry ${_selectedSaveId === save.id && 'selected'}" title="文件名称：${save.name} \n节点关系：${save.data.nodes.length} nodes, ${save.data.edges.length} edges \n创建时间：${save.date}" id="${save.id}">
<!--      <div class="icon">&#128196;</div>-->
      <div class="icon"><img src="img/document-cover.jpg" height="90%" width="100%" title="显示的文件封面"/></div>
      <div class="name">${save.name}
        <small>${save.date}</small>
      </div>
    </li>`;
  });

  return html;
};

/**
 * @private
 */
const _setupDialog = () => {
  if (_setupDialog.isDone) {
    return;
  }

  Dialog.dialogLayer = createDomElementInContainer(`#${CONST.EDITOR_ID}`,
    'div',
    'overlay-dialog',
    'overlay-dialog'
  );

  SaveManager.onChange(data => {
    _selectedSaveId = null;
    Dialog.render(data);
  });

  d3.select('body').on('keydown', () => {
    const enterKey = 13;
    const esc = 27;
    const focusedElement = document.activeElement;

    // load the selected save
    if ((d3.event.keyCode === enterKey) && _selectedSaveId) {
      SaveManager.load(_selectedSaveId);
      Dialog.close();
      d3.event.preventDefault();
      d3.event.stopPropagation();
    }

    // create new save with the string in the input field
    if (d3.event.keyCode === enterKey && focusedElement && focusedElement.classList.contains('new-save-name-input')) {
      if (document.querySelector('.new-save-name-input').value.length > 0) {
        _createNewSave();
        d3.event.preventDefault();
        d3.event.stopPropagation();
      }
    }

    if (d3.event.keyCode === esc) {
      Dialog.close();
      d3.event.preventDefault();
      d3.event.stopPropagation();
    }
  });

  var _lastClickedElementId;
  const DOUBLE_CLICK_SPEED = 400; // in ms

  Dialog.dialogLayer.addEventListener('click', (e) => {
    const target = e.target;
    const className = target.classList[0];

    switch (className) {
      case 'close-dialog-btn':
        Dialog.close();
        break;
      case 'new-save-btn':
        Dialog.open(true);
        break;
      case 'save-btn':
        _createNewSave();
        break;
      case 'load-btn':
        if (_selectedSaveId === null) {
          try {
            DataManager.loadData(ImportManager.getInputJsonData());
            NotificationManager.success('Save successfully loaded.');
            Dialog.close();
          } catch (e) {
            alert('【请参考样例数据】\n【主要为data中nodes和edges列表中数据格式需要一致】\n请输入标准的JSON格式：' + ImportManager.getDemoJson());
          }
        } else {
          SaveManager.load(_selectedSaveId);
          Dialog.close();
        }
        break;
      case 'delete-btn':
        window.confirm('Are you sure you want to delete all saved nodes and edges?') && SaveManager.remove(_selectedSaveId);
        break;
      case 'save-entry':
        _selectSave(target.id);
        // if the same element is clicked in the last DOUBLE_CLICK_SPEED ms
        if (_lastClickedElementId === _selectedSaveId) {
          SaveManager.load(_selectedSaveId);
          Dialog.close();
        }
        break;
      case 'export-all-json':
        ExportManager.json();
        break;
      case 'import-from-json':
        ImportManager.singleModleGraphJson();
        break;
      default:
        break;
    }

    _lastClickedElementId = target.id;

    // reset the last selected element so the dbclick click need to happen in DOUBLE_CLICK_SPEED ms
    setTimeout(() => {
      _lastClickedElementId = null;
    }, DOUBLE_CLICK_SPEED);
  });

  _setupDialog.isDone = true;
};

/**
 * @type {{render: Function, open: Function, close: Function}}
 */
const Dialog = {

  /**
   * render the dialog
   */
  render: () => {
    const saves = SaveManager.getSaves();
    Dialog.dialogLayer.innerHTML = _getHTML(saves);
  },

  /**
   * @param {boolean} forSave is the open for save or load action
   */
  open: (forSave) => {
    _setupDialog();

    // reset the selected
    _selectedSaveId = null;

    Dialog.render();

    // hide header for just loading
    // document.querySelector('.dialog .sub-header').style.display = forSave ? 'flex' : 'none';
    document.getElementById('set_file_name').style.display = forSave ? 'flex' : 'none';
    document.querySelector('.dialog .sub-header .new-save-name-input').focus();
    document.querySelector(`#${CONST.SVGROOT_ID}`).classList.add('blurred');

    // set opened class later on so there will be open-transition
    setTimeout(() => {
      Dialog.dialogLayer.classList.add('opened');
    }, 0);

  },

  /**
   *
   */
  close: () => {
    _setupDialog();
    document.querySelector(`#${CONST.SVGROOT_ID}`).classList.remove('blurred');
    Dialog.dialogLayer.classList.remove('opened');
  }
};

export default Dialog;

