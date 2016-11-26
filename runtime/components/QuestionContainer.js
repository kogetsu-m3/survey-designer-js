import React, { Component, PropTypes } from 'react'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ActionOpenWith from 'material-ui/svg-icons/action/open-with';
import styles from '../../www/css/QuestionContainer.css';

export default class QuestionContainer extends Component {
  constructor() {
    super();
    this.state = {
      mouseover: false
    };
  }
  handleMouseEnter(e) {
    this.setState({mouseover: true});
  }
  handleMouseLeave(e) {
    this.setState({mouseover: false});
  }

  render() {
    const buttonContainerStyle = {
      display: this.state.mouseover ? 'block' : 'none'
    };
    return <div className={styles.questionContainer} onMouseEnter={this.handleMouseEnter.bind(this)} onMouseLeave={this.handleMouseLeave.bind(this)}>
      <div className={styles.buttonContainer} style={buttonContainerStyle}>
        <FloatingActionButton mini={true}><ActionOpenWith/></FloatingActionButton>
      </div>
      {this.props.children}
    </div>;
  }
}
