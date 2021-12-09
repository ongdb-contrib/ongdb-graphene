'use strict';
/** @jsx h */

import { h, Component } from 'preact';

import DataManager from '../DataManager';
import HistoryManager from '../HistoryManager';
import NotificationManager from '../NotificationManager';

import codeMirror from 'codemirror';
import graphql from '../utils/graphql/index';

import Dialog from './dialog';
import CONST from "../enums/CONST";


class MenuPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMenuOpen: false,
      isSchemaOpen: false
    };
  }

  componentDidMount() {
    const codeEditorSchema = codeMirror(document.querySelector('#graphql-schema'), {
      lineNumbers: true,
      readOnly: true,
      undoDepth: 0,
      mode: 'yaml',
      lineWrapping: true,
      value: ''
    });

    const codeEditorJS = codeMirror(document.querySelector('#jshandlers-schema'), {
      lineNumbers: true,
      readOnly: true,
      undoDepth: 0,
      mode: 'javascript',
      lineWrapping: true,
      value: ''
    });

    DataManager.onChange(function () {
      codeEditorSchema.setValue(graphql.getFullSchema());
      codeEditorJS.setValue(graphql.getAllResolvers());
    }.bind(this));

    d3.select('body').on('keydown.menu', () => {
      const l = 76;
      const s = 83;
      const y = 89;
      const z = 90;

      if (d3.event.ctrlKey || d3.event.metaKey) {
        switch (d3.event.keyCode) {
          case s:
            this.save();
            break;
          case l:
            this.load();
            break;
          case z:
            this.undo();
            break;
          case y:
            this.redo();
            break;
          default:
            break;
        }
      }
    });
  }

  toggleMenuOpen() {
    this.setState({
      isMenuOpen: !this.state.isMenuOpen,
      isSchemaOpen: false
    });
  }

  toggleGraphqlView() {
    this.setState({
      isMenuOpen: false,
      isSchemaOpen: !this.state.isSchemaOpen
    });
  }

  closeAll() {
    this.setState({
      isMenuOpen: false,
      isSchemaOpen: false
    });
  }

  deleteAll() {
    if (window.confirm('Are you sure you want to delete all nodes and edges?')) {
      DataManager.clear();
      NotificationManager.error('All nodes and edges have been deleted. (Hint: Ctrl+Z to undo)');
    }

    this.closeAll();
  }

  save() {
    Dialog.open(true, CONST.MENU_SAVE);
    this.closeAll();
  }

  load() {
    Dialog.open(false, CONST.MENU_LOAD);
    this.closeAll();
  }

  task() {
    Dialog.open(false, CONST.MENU_TASK);
    this.closeAll();
  }

  export() {
    Dialog.open(false, CONST.MENU_EXPORT);
    this.closeAll();
  }

  import() {
    Dialog.open(false, CONST.MENU_IMPORT);
    this.closeAll();
  }

  database() {
    Dialog.open(false, CONST.MENU_DATABASE);
    this.closeAll();
  }

  undo() {
    HistoryManager.undo();
    this.closeAll();
  }

  redo() {
    HistoryManager.redo();
    this.closeAll();
  }

  render(props, state) {
    return <menu className="top-menu" id="top-menu">
      <span className={ 'toggle-button' + (state.isMenuOpen ? ' open' : '') } onClick={ this.toggleMenuOpen.bind(this) }>&#9776;</span>
      <section className={ 'drop-down-menu content' + (state.isMenuOpen ? ' open' : '') }>
        <ul>
          <li className="menu-save-btn" onClick={ this.save.bind(this) }>&#128190; Save <small>(ctrl+s)</small></li>
          <li className="menu-load-btn" onClick={ this.load.bind(this) }>&#128194; Load <small>(ctrl+l)</small></li>
          <li className="menu-task-btn" onClick={ this.task.bind(this) }>&#128083; Task <small>(task)</small></li>
          <li className="menu-export-btn" onClick={ this.export.bind(this) }>&#128228; Export<small>(export)</small></li>
          <li className="menu-import-btn" onClick={ this.import.bind(this) }>&#128229; Import<small>(import)</small></li>
          <li className="menu-database-btn" onClick={ this.database.bind(this) }>&#128170; Database<small>(database)</small></li>
          <li className="menu-undo-btn" onClick={ this.undo.bind(this) }>&#8617; Undo <small>(ctrl+z)</small></li>
          <li className="menu-redo-btn" onClick={ this.redo.bind(this) }>&#8618; Redo <small>(ctrl+y)</small></li>
          <li className="menu-delete-all-btn" onClick={ this.deleteAll.bind(this) }>&#10005; Delete all</li>
        </ul>
      </section>

      <span className={ 'toggle-button' + (state.isSchemaOpen ? ' open' : '') } onClick={ this.toggleGraphqlView.bind(this) }>ஃ</span>
      <section className={ 'graphql-schema content' + (state.isSchemaOpen ? ' open' : '') }>
        <section id="graphql-schema" />
        <section id="jshandlers-schema" />
      </section>

      { (this.state.isMenuOpen || this.state.isSchemaOpen) &&
      <overlay className="top-menu-overlay" onClick={ this.closeAll.bind(this) } />
      }
    </menu>;
  }
}

export default MenuPanel;
