import React from 'react';
import { render } from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MockApp  from './containers/MockApp.js';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const rootElement = document.getElementById('root');
const el = render(
  <MuiThemeProvider><MockApp /></MuiThemeProvider>,
  rootElement
)
