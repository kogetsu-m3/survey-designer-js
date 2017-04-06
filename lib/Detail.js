/* eslint-env browser,jquery */
import 'babel-polyfill';
import 'classlist-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import browser from 'detect-browser';
import 'tooltipster/dist/css/tooltipster.bundle.min.css';
import EnqueteDetailApp from './preview/containers/EnqueteDetailApp';
import { configureStore } from './runtime/store';
import SurveyDesignerState from './runtime/models/SurveyDesignerState';
import ParsleyWrapper from './ParsleyWrapper';
import { RequireBrowserForRuntime } from './BrowserRequirements';
import './runtime/css/runtime.scss';
import './preview/css/detail.scss';

/**
 * Detailのエントリポイント
 */
export function Detail(el, json) {
  if (browser.name === 'ie' && parseInt(browser.version.substr(0, browser.version.indexOf('.')), 10) < 9) {
    render(<RequireBrowserForRuntime />, el);
    return;
  }

  const parsleyWrapper = new ParsleyWrapper(el);
  const initialState = SurveyDesignerState.createFromJson(json);
  const store = configureStore(initialState);

  render(
    <Provider store={store}>
      <EnqueteDetailApp parsleyWrapper={parsleyWrapper} />
    </Provider>,
    el,
  );
}