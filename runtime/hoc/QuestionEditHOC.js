import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import IconButton from 'material-ui/IconButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Delete from 'material-ui/svg-icons/action/delete';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import ContentCopy from 'material-ui/svg-icons/content/content-copy';
import Drawer from 'material-ui/Drawer';
import styles from '../../www/css/QuestionEditHOC.css';
import CheckboxEditor from '../../editor/components/question_editor/CheckboxEditor';
import * as RuntimeActions from '../actions'
import * as EditorActions from '../../editor/actions';

const EDITORS = {
  CheckboxEditor,
}

export default function QuestionEditHOC(QuestionComponent) {
  class QuestionEditorHOC extends React.Component {
    constructor(prop) {
      super(prop);
    }
    startEditMode() {
      const { page, id, changeEditQuestion, changeLeftPaneTab } = this.props;
      changeEditQuestion(page.id, id);
      changeLeftPaneTab('questionEditor');
    }
    getEditor() {
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
          <QuestionComponent {...this.props}/>
        </div>
      );
    }
  }

  const stateToProps = state => ({
  });
  const actionsToProps = dispatch => ({
    changeEditQuestion: (pageId, questionId) => dispatch(RuntimeActions.changeEditQuestion(pageId, questionId)),
    changeLeftPaneTab: value => dispatch(EditorActions.changeLeftPaneTab(value)),
  });

  return connect(
    stateToProps,
    actionsToProps
  )(QuestionEditorHOC)
}
