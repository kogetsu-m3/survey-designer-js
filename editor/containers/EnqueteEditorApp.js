import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SplitPane from 'react-split-pane';
import Frame from 'react-frame-component';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import {cyan500, darkBlack} from 'material-ui/styles/colors';
import {Tabs, Tab} from 'material-ui/Tabs';
import EnqueteRuntimeApp from '../../runtime/containers/EnqueteRuntimeApp';
import Graph from '../components/Graph';
import ComponentList from '../components/ComponentList';
import Editor from '../components/Editor';
import QuestionEditor from '../components/QuestionEditor';
import PageSetting from '../components/PageSetting';
import yaml from 'js-yaml';
import Dock from 'react-dock';;
import * as EditorActions from '../actions';
import * as RuntimeActions from '../../runtime/actions';
import * as Utils from '../../utils';

export default class EnqueteEditorApp extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.resizeGraphPane();
  }
  handleChangeTab(value) {
    const { changeLeftPaneTab } = this.props;
    changeLeftPaneTab(value);
  }
  resizeGraphPane(e) {
    const { resizeGraphPane } = this.props;
    const width = ReactDOM.findDOMNode(this.refs.left).getBoundingClientRect().width;
    resizeGraphPane(width);
  }
  render() {
    const _this = this;
    const { state, actions, selectedLeftPaneTab } = this.props;
    const splitPaneSize = {
      minSize: 100,
      defaultSize: 400
    };
    const page = Utils.findPageFromFlow(state, state.values.currentFlowId);
    let isYamlValid = false;
    if (page) {
      const draft = Utils.findDraft(state, page.id);
      if (draft) {
        isYamlValid = draft.valid;
      }
    }

    const muiTheme = getMuiTheme({
      tabs: {
        palette: {
          primary1Color: darkBlack,
        }
      }
    });

    // TODO SplitPaneをiframeに対応する
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <SplitPane split="vertical" {...splitPaneSize} onDragFinished={this.resizeGraphPane.bind(this)}>
            <div>
              <AppBar title="React Survey"/>
              <Tabs ref="left" value={selectedLeftPaneTab} onChange={this.handleChangeTab.bind(this)}>
                <Tab icon={<FontIcon className="material-icons">call_split</FontIcon>} value="graph"><Graph actions={actions}/></Tab>
                <Tab icon={<FontIcon className="material-icons">list</FontIcon>} value="componentList"><ComponentList/></Tab>
                <Tab icon={<FontIcon className="material-icons">settings</FontIcon>} value="pageSetting"><PageSetting/></Tab>
                <Tab icon={<ModeEdit/>} value="questionEditor"><QuestionEditor/></Tab>
              </Tabs>
            </div>
            <div>
              <AppBar title="Design Preview" iconElementLeft={<div/>}/>
              <EnqueteRuntimeApp ref="right"/>
            </div>
          </SplitPane>
        </div>
      </MuiThemeProvider>
    )
  }
}

const stateToProps = state => ({
  state: state,
  selectedLeftPaneTab: state.editorValues.selectedLeftPaneTab,
});
const actionsToProps = dispatch => ({
  resizeGraphPane: width => dispatch(EditorActions.resizeGraphPane(width)),
  resizeEditorPane: height => dispatch(EditorActions.resizeEditorPane(height)),
  changeCodemirror: value => dispatch(EditorActions.changeCodemirror(value)),
  changeLeftPaneTab: value => dispatch(EditorActions.changeLeftPaneTab(value)),
});

export default connect(
  stateToProps,
  actionsToProps
)(EnqueteEditorApp);
