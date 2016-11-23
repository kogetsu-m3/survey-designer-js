import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton';
import * as EditorActions from '../actions'
import * as Utils from '../../utils'

class ComponentButton extends Component {
  constructor(props) {
    super(props);
  }
  onButtonClick(e) {
    const { component, addComponent } = this.props;
    addComponent(component);
  }
  render() {
    const { label, componentGroup } = this.props;
    return (
      <RaisedButton fullWidth={true} onClick={this.onButtonClick.bind(this)} label={label} />
    );
  }
}
// typeとBootstrapのclassの紐つけ
ComponentButton.TYPE_MAPPING = {
  'question': 'info',
  'non-question': 'success'
};

ComponentButton.defaultProps = {
};

ComponentButton.propTypes = {
};

const stateToProps = state => ({
  state: state
});
const actionsToProps = dispatch => ({
  addComponent: comopnentType => dispatch(EditorActions.addComponent(comopnentType))
});

export default connect(
  stateToProps,
  actionsToProps
)(ComponentButton);
