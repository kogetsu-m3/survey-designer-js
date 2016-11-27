import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import Add from 'material-ui/svg-icons/content/add';
import DeleteForever from 'material-ui/svg-icons/action/delete-forever';
import { connect } from 'react-redux';
import TinyMCE from 'react-tinymce';
import * as EditorActions from '../actions';
import * as RuntimeActions from '../../runtime/actions';
import * as Utils from '../../utils';
import styles from '../../www/css/ChoiceEditor.css';

class ChoiceEditor extends Component {
  constructor(props) {
    super(props);
    this.destroyed = false;
  }

  shouldComponentUpdate(nextProps, nextState) {
    const el = document.activeElement;
    // tinymceからのイベントの場合は更新しない
    return !el.classList.contains('choice-editor-tinymce');
  }
  componentDidUpdate(prevProps, prevState) {
  }
  componentWillUnmount() {
    // unmountする時はtinymceのインスタンスをdetroyする
    const editorEls = this.refs.root.querySelectorAll('.choice-editor-tinymce');
    this.destroyed = true;
    return Array.prototype.map.call(editorEls, el => {
      return this.getTinyMCEEditorFromEl(el).destroy();
    });
  }
  getTinyMCEEditorFromEl(el) {
    return tinymce.editors.find(editor => document.getElementById(editor.id) === el);
  }
  getChoiceValue() {
    if (this.props.plainText) {
      const editorEls = this.refs.root.querySelectorAll('.plain-text-choice');
      return Array.prototype.map.call(editorEls, el => {
        return el.value;
      });
    } else {
      const editorEls = this.refs.root.querySelectorAll('.choice-editor-tinymce');
      const freeInputEls = this.refs.root.querySelectorAll('.free-input input');
      const freeInputRequiredEls = this.refs.root.querySelectorAll('.free-input-required input');
      const exclusionEls = this.refs.root.querySelectorAll('.exclusion input');
      return Array.prototype.map.call(editorEls, (el, i) => {
        const label = this.getTinyMCEEditorFromEl(el).getContent();
        const obj = {};
        let optionSpecified = false;
        if (freeInputEls[i].checked) {
          obj.freeInput = true;
          optionSpecified = true;
        }
        if (freeInputRequiredEls[i].checked) {
          obj.freeInputRequired = true;
          optionSpecified = true;
        }
        if (exclusionEls[i].checked) {
          obj.exclustion = true;
          optionSpecified = true;
        }
        if (!optionSpecified) {
          // optionが指定されていない時は単純にlabelを返す
          return label;
        }
        obj.label = label;
        return obj;
      });
    }
  }
  handleChangeQuestionChoices(choiceIndex, e) {
    const { page, question } = this.props;
    if (this.destroyed) {
      // destroy後にtinymceにフォーカスが当たっているとchangeイベントが発火することがあるためthis.destroyedで判定
      return;
    }
    const choiceValue = this.getChoiceValue();
    if (this.props.choices.length != choiceValue.length) {
      // TinyMCEのバグ？行削除時に勝手にchangeイベントが発動することがある
      return;
    }
    this.props.handleChoiceChange(choiceValue);
  }
  handleClickAddButton(index, e) {
    const { page, question } = this.props;
    const choiceValue = this.getChoiceValue();
    choiceValue.splice(index + 1, 0, '');
    this.props.handleChoiceChange(choiceValue);
  }
  handleClickMinusButton(index, e) {
    const { page, question } = this.props;
    const choiceValue = this.getChoiceValue();
    choiceValue.splice(index, 1);
    this.props.handleChoiceChange(choiceValue);
  }
  handleChangeOption(index, e) {
    const { page, question } = this.props;
    const choiceValue = this.getChoiceValue();
    this.props.handleChoiceChange(choiceValue);
  }
  renderChoiceEditorRow(choice, index, choices) {
    const content = choice.label ? choice.label : choice;
    const controllerMinusStyle = {
      visibility: choices.length == 1 ? 'hidden' : ''
    }
    const { plainText } = this.props;
    const checkboxStyle = {
      display: 'inline-block',
      width: '24px',
      height: '24px',
      padding: '0',
    };
    const editor = plainText ? <input type="text" className="form-control plain-text-choice"
      onKeyup={this.handleChangeQuestionChoices.bind(this, index)}
      onChange={this.handleChangeQuestionChoices.bind(this, index)}
      value={content}/>
        : <TinyMCE className="choice-editor-tinymce"
            config={
              {
                menubar: '',
                toolbar: 'fontselect fontsizeselect bold italic underline strikethrough backcolor forecolor subscript superscript anchor code  media removeformat | fullscreen',
                plugins: 'table contextmenu textcolor paste fullscreen lists image link',
                forced_root_block : false,
                inline: true,
                statusbar: false
              }
            }
            onKeyup={this.handleChangeQuestionChoices.bind(this, index)}
            onChange={this.handleChangeQuestionChoices.bind(this, index)}
            content={content}
          />;

    return (
      <div className={styles.choiceEditorRow} key={"choice-editor-row-" + index}>
        <div className={styles.choiceEditorTinymceContainer}>
          {editor}
        </div>
        <div>
          <Checkbox onChange={this.handleChangeOption.bind(this, index)} label="" style={checkboxStyle}/>
          <Checkbox onChange={this.handleChangeOption.bind(this, index)} label="" style={checkboxStyle}/>
          <Checkbox onChange={this.handleChangeOption.bind(this, index)} label="" style={checkboxStyle}/>
          <IconButton mini={true} style={checkboxStyle}><Add /></IconButton>
          <IconButton mini={true} style={checkboxStyle}><DeleteForever/></IconButton>
        </div>
      </div>
    );
  }
  render() {
    const { choices } = this.props;

    return (
      <div ref="root" className="choice-editor">
        {choices.map(this.renderChoiceEditorRow.bind(this))}
      </div>
    );
  }
}

const stateToProps = state => ({
  state: state
});
const actionsToProps = dispatch => ({
});

export default connect(
  stateToProps,
  actionsToProps
)(ChoiceEditor);
