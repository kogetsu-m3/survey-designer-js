import React, { Component, PropTypes } from 'react'
import IconButton from 'material-ui/IconButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Delete from 'material-ui/svg-icons/action/delete';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import ContentCopy from 'material-ui/svg-icons/content/content-copy';
import Drawer from 'material-ui/Drawer';
import styles from '../../www/css/QuestionEditHOC.css';
import CheckboxEditor from '../../editor/components/question_editor/CheckboxEditor';

const EDITORS = {
  CheckboxEditor,
}

export default function QuestionEditHOC(QuestionComponent) {
  return class QuestionEditorHOC extends React.Component {
    constructor(prop) {
      super(prop);
      this.state = {
        open: false
      };
    }
    startEditMode() {
      this.setState({open: true});
    }
    getEditor() {
      if (!this.state.open) {
        return null;
      }
      const editorClassName = QuestionComponent.name.replace(/Question/, '') + 'Editor';
      const editor = EDITORS[editorClassName];
      return React.createElement(editor, {question: this.props});
    }
    render() {
      return (
        <div className={styles.questionContainer}>
          <div className={styles.buttonContainer}>
            <IconButton tooltip="Edit" onClick={this.startEditMode.bind(this)}><ModeEdit/></IconButton>
            <IconButton tooltip="Copy"><ContentCopy/></IconButton>
            <IconButton tooltip="Delete"><Delete/></IconButton>
          </div>
          <Drawer docked={false} width={500} open={this.state.open} onRequestChange={(open) => this.setState({open})}>
            {this.getEditor()}
          </Drawer>
          <QuestionComponent {...this.props}/>
        </div>
      );
    }
  }
}
