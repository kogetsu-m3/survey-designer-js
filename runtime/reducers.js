import * as Constants from '../constants';
import { cloneObj, findFlow, findBranch } from '../utils';

/**
 * branchを評価する
 */
function evaluateBranch(state, branchFlow) {
  function evaluateConditions(func, childConditions) {
    return func.call(childConditions, cc => {
      const inputValue = state.values.inputValues[cc.refQuestionId];
      if (cc.operator === 'includes') {
        const checkboxValue = inputValue.find(v => v.value === cc.value);
        return checkboxValue.checked;
      }
      return false;
    });
  }
  const conditions = findBranch(state, branchFlow.refId).conditions;
  for (let i = 0, len = conditions.length; i < len; i++) {
    const c = conditions[i];
    const isLast = (i === len - 1);
    if (isLast) {
      return c.nextFlowId;
    } else if (c.type === 'any') {
      const match = evaluateConditions(Array.prototype.some, c.childConditions);
      if (!match) {
        continue;
      }
      return c.nextFlowId;
    } else if (c.type === 'all') {
      const match = evaluateConditions(Array.prototype.every, c.childConditions);
      if (!match) {
        continue;
      }
      return c.nextFlowId;
    } else {
      throw `unkown condition type: "${c.type}" at FlowID=${c.flowId}`;
    }
  }
  throw 'next flow is not defined';
}
/**
 * typeがpageの次のflowを返す
 */
function nextFlowPage(state, flowId) {
  const flow = findFlow(state, flowId);
  let nextFlow = findFlow(state, flow.nextFlowId);
  switch (nextFlow.type) {
    case 'page':
      return nextFlow;
    case 'branch':
      for (;;) {
        const nextFlowId = evaluateBranch(state, nextFlow);
        if (!nextFlowId) {
          throw 'next flow is not defined';
        }
        nextFlow = findFlow(state, nextFlowId);
        if (nextFlow.type === 'page') {
          return nextFlow;
        }
      }
    default:
      throw 'unkwon flow type: ' + nextFlow.type;
  }
}
function showPage(state, action) {
  const { currentFlowId, flowStack } = state.values;
  switch (action.type) {
    case Constants.SELECT_FLOW: {
      return { currentFlowId: action.flowId, flowStack: [] };
    }
    case Constants.NEXT_PAGE: {
      const nextFlow = nextFlowPage(state, currentFlowId);
      return { currentFlowId: nextFlow.id, flowStack: [...flowStack, currentFlowId]};
    }
    case Constants.PREV_PAGE: {
      let newFlowStack = [...flowStack];
      const prevFlowId = newFlowStack.pop();
      return { currentFlowId: prevFlowId, flowStack: newFlowStack };
    }
    default: {
      return { currentFlowId: currentFlowId, flowStack: [...flowStack]};
    }
  }
}
function changeValue(state, action) {
  let inputValues = Object.assign({}, state.values.inputValues);
  switch (action.type) {
    case Constants.VALUE_CHANGE:
      return Object.assign(inputValues, action.values);
    default:
      return inputValues;
  }
}
function changeDefs(state, action) {
  let newState = cloneObj(state.defs);
  switch (action.type) {
    case Constants.INIT_ALL_DEFS:
      return cloneObj(action.allDefs);
    case Constants.CHANGE_DEFS:
      newState[action.defsName] = action.defs;
      return newState;
    default:
      return newState;
  }
}

function changeEditorValues(editorValues, action) {
  switch (action.type) {
    case Constants.CHANGE_EDIT_QUESTION:
      return {
        pageId: action.pageId,
        questionId: action.questionId,
      };
    default:
      return editorValues;
  }
}

export default function reducer(state, action) {
  const newState = cloneObj(state);
  try {
    if (action.type === Constants.INIT_ALL_DEFS) {
      // 初期化処理だけ別処理
      return {
        values: {
          currentFlowId: action.allDefs.flowDefs[0].id,
          flowStack: [],
          inputValues: [],
        },
        defs: cloneObj(action.allDefs),
        viewSettings: newState.viewSettings,
        editorValues: newState.editorValues,
      };
    }
    const { currentFlowId, flowStack } = showPage(state, action);
    return {
      values: {
        currentFlowId,
        flowStack,
        inputValues: changeValue(state, action),
      },
      defs: changeDefs(state, action),
      viewSettings: newState.viewSettings,
      editorValues: changeEditorValues(state.editorValues, action),
    }
  } catch(e) {
    console.error(e);
    alert(e);
    return newState;
  }
}
