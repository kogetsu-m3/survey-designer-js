import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import * as EditorActions from '../actions'
import * as Utils from '../../utils'

class PageSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layout: 'flow_layout'
    };
  }

  onPageSettingChanged(e) {
    const { changePageSetting } = this.props;
    const value = e.target.value;
    const page = {
      pageId: ReactDOM.findDOMNode(this.refs.pageId).value,
      pageTitle: ReactDOM.findDOMNode(this.refs.pageTitle).value,
      pageSubTitle: ReactDOM.findDOMNode(this.refs.pageSubTitle).value,
      pageLayout: ReactDOM.findDOMNode(this.refs.pageLayout).value
    };
    changePageSetting(page);
  }

  render() {
    const { state } = this.props;
    const page = Utils.findPageFromFlow(state, state.values.currentFlowId);
    // ページが見つからない場合は描画しない(branchの場合)
    if (!page) {
      const branch = Utils.findBranchFromFlow(state, state.values.currentFlowId);
      if (branch) {
        return <span>Disabled PageSetting Tab when branch is selected</span>;
      } else {
        throw 'invalid currentFlowId: ' + state.values.currentFlowId;
      }
    }
    return (
      <div>
        <TextField hintText="ページID" floatingLabelText="ページID"/><br/>
        <TextField hintText="ページタイトル" floatingLabelText="ページタイトル"/><br/>
        <TextField hintText="ページサブタイトル" floatingLabelText="ページサブタイトル"/><br/>
        <SelectField floatingLabelText="レイアウト" value={this.state.layout} >
          <MenuItem value="flow_layout" primaryText="フローレイアウト" />
          <MenuItem value="grid_layout" primaryText="グリッドレイアウト" />
        </SelectField><br/>
      </div>
    );
  }
}

const stateToProps = state => ({
  state: state
});
const actionsToProps = dispatch => ({
  changePageSetting: value=> dispatch(EditorActions.changePageSetting(value))
});

export default connect(
  stateToProps,
  actionsToProps
)(PageSetting);
