import React, { Component, PropTypes } from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import ReactMixin from 'react-mixin';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TinyMCE from 'react-tinymce';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import ChoiceEditor from '../ChoiceEditor';
import * as EditorActions from '../../actions';
import * as RuntimeActions from '../../../runtime/actions';
import * as Utils from '../../../utils';
import uuid from 'node-uuid';
import formStyles from '../../../www/css/form.css';

class CheckboxEditor extends Component {
  constructor(props) {
    super(props);
    const { question } = props;
    this.uuid = uuid.v4();
    this.state = {
      title: question.title,
      beforeNote: question.beroreNote === undefined ? '' : question.beforeNote,
      choices: question.choices
    };
  }

  static getDefaultDefinition() {
    return {
      title: '複数選択肢',
      beforeNote: '',
      type: 'checkbox',
      vertical: true,
      choices: [
        '選択肢1',
        '選択肢2'
      ],
      random: false,
      randomFixLast: false
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const oldPage = prevProps.page;
    const page = this.props.page;
    if (oldPage.id === page.id) {
      return;
    }
    const { question } = this.props;
    const questionTitleEditor = tinymce.EditorManager.get(`${this.uuid}-questionTitleEditor`);
    const questionBeforeNoteEditor = tinymce.EditorManager.get(`${this.uuid}-questionBeforeNoteEditor`);
    questionTitleEditor.setContent(question.title);
    questionBeforeNoteEditor.setContent(question.beforeNote);
  }

  handleCheckboxEditorChange(e) {
    const { page, question, changeQuestion } = this.props;
    const title = this.state.title;
    const beforeNote = this.state.beforeNote;
    const vertical = this.directionVertical.checked;
    const choices = this.state.choices;
    const questionDef = {
      title, beforeNote, vertical, choices
    };
    changeQuestion(page.id, question.id, questionDef);
  }

  handleChoiceChange(choices) {
    this.setState({choices}, this.handleCheckboxEditorChange.bind(this));
  }

  handleTinyMCEChange(prop, event, editor) {
    const state = {};
    state[prop] = editor.getContent();
    this.setState(state, this.handleCheckboxEditorChange.bind(this, event));
  }

  render() {
    const { page, question, plainText } = this.props;
    const choices = question.choices;

    return (
      <div>
        <h4 className={formStyles.formTitle}>質問タイトル</h4>
        <TinyMCE id={`${this.uuid}-questionTitleEditor`}
          config={
            {
              menubar: '',
              toolbar: 'styleselect fontselect fontsizeselect bullist numlist outdent indent blockquote removeformat link unlink image visualchars fullscreen table forecolor backcolor',
              plugins: 'table contextmenu textcolor paste fullscreen lists image link',
              inline: false,
              height: 40,
              statusbar: false
            }
          }
          onKeyup={this.handleTinyMCEChange.bind(this, 'title')}
          onChange={this.handleTinyMCEChange.bind(this, 'title')}
          content={question.title}
        />
        <h4 className={formStyles.formTitle}>補足</h4>
        <TinyMCE id={`${this.uuid}-questionBeforeNoteEditor`}
          config={
            {
              menubar: '',
              toolbar: 'styleselect fontselect fontsizeselect bullist numlist outdent indent blockquote removeformat link unlink image visualchars fullscreen table forecolor backcolor',
              plugins: 'table contextmenu textcolor paste fullscreen lists image link',
              inline: false,
              height: 40,
              statusbar: false
            }
          }
          onKeyup={this.handleTinyMCEChange.bind(this, 'beforeNote')}
          onChange={this.handleTinyMCEChange.bind(this, 'beforeNote')}
          content={question.beforeNote}
        />
        <h4 className={formStyles.formTitle}>選択肢</h4>
        <ChoiceEditor page={page} question={question} choices={choices} plainText={plainText} handleChoiceChange={this.handleChoiceChange.bind(this)}/>

        <h4 className={formStyles.formTitle}>オプション</h4>
        <Toggle label="縦に並べる" labelPosition="right" onChange={this.handleCheckboxEditorChange.bind(this)}/>
        <Toggle label="選択肢の表示順をランダム表示" labelPosition="right" onChange={this.handleCheckboxEditorChange.bind(this)}/>
        <Toggle label="ランダム制御" labelPosition="right" onChange={this.handleCheckboxEditorChange.bind(this)}/>
      </div>
    );
  }
}

ReactMixin(CheckboxEditor.prototype, LinkedStateMixin);

const stateToProps = state => ({
});
const actionsToProps = dispatch => ({
  changeQuestion: (pageId, questionId, value) => dispatch(EditorActions.changeQuestion(pageId, questionId, value))
});

export default connect(
  stateToProps,
  actionsToProps
)(CheckboxEditor);
