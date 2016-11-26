import React from 'react';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import Menu from 'material-ui/Menu';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

export default class JXMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  handleTouchTap(event) {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  }

  handleRequestClose() {
    this.setState({
      open: false,
    });
  }

  render() {
    return <Toolbar>
      <ToolbarGroup firstChild={true}>
        <FlatButton
          onTouchTap={this.handleTouchTap.bind(this)}
          label="アンケート作成"
        />
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestClose.bind(this)}
        >
          <Menu>
            <MenuItem primaryText="Refresh" />
            <MenuItem primaryText="Help &amp; feedback" />
            <MenuItem primaryText="Settings" />
            <MenuItem primaryText="Sign out" />
          </Menu>
        </Popover>
        <DropDownMenu value={1}>
          <MenuItem value={1} primaryText="アンケート作成" />
        </DropDownMenu>
        <DropDownMenu value={1}>
          <MenuItem value={1} primaryText="アンケート配信" />
        </DropDownMenu>
        <DropDownMenu value={1}>
          <MenuItem value={1} primaryText="アンケート配信" />
        </DropDownMenu>
        <FlatButton label="アンケート作成"/>
        <FlatButton label="アンケート配信"/>
        <FlatButton label="メニュー"/>
        <FlatButton label="メニュー"/>
        <FlatButton label="メニュー"/>
      </ToolbarGroup>
    </Toolbar>;
  }
}
