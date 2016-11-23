import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import EnqueteEditorApp  from './containers/EnqueteEditorApp.js'
import configureStore from './store'
import state from './state'
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

$.getJSON('sample.json').done(json => {
  const store = configureStore(json);

  const rootElement = document.getElementById('root');
  const el = render(
    <Provider store={store}>
      <EnqueteEditorApp />
    </Provider>,
    rootElement
  )
});
