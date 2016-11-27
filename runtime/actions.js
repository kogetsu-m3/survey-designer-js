import * as Constants from '../constants';

export function nextPage() {
  return {
    type: Constants.NEXT_PAGE
  };
}
export function prevPage() {
  return {
    type: Constants.PREV_PAGE
  };
}
export function valueChange(values) {
  return { type: Constants.VALUE_CHANGE, values };
}
export function changeEditQuestion(pageId, questionId) {
  return { type: Constants.CHANGE_EDIT_QUESTION, pageId, questionId };
}
