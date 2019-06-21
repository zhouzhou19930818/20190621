import {
    bindActionCreators
} from "redux";
import {
    connect
} from "react-redux";

const initState = {
    activeTab: 'tab1',
    isExpendContent: false, // 是否需要扩展 drag-content
    stepCurrent: 0, //步骤数
    latestStep: 0,// 后台最新步数
};

const types = {
    CHANGE_ACTIVE_TAB: 'CHANGE_ACTIVE_TAB',
    CHANGE_IS_EXPEND_CONTENT: 'CHANGE_IS_EXPEND_CONTENT',
    STEP_CURRENT: 'STEP_CURRENT',
    LATEST_STEP: 'LATEST_STEP',
};

export const actions = {
    changeActiveTab: (value) => ({
        type: types.CHANGE_ACTIVE_TAB,
        value: value,
    }),
    changeIsExpendContent: (value) => {
        return {
            type: types.CHANGE_IS_EXPEND_CONTENT,
            value: value
        }
    },
    changeStepCurrent: (value) => ({
        type: types.STEP_CURRENT,
        value: value
    }),
    changeTaskLatestStep: (value) => ({
        type: types.LATEST_STEP,
        value: value
    }),
};

const reducer = (state = initState, actions) => {
    switch (actions.type) {
        case types.CHANGE_ACTIVE_TAB:
            return {
                ...state, activeTab: actions.value
            };
        case types.CHANGE_IS_EXPEND_CONTENT:
            return {
                ...state, isExpendContent: actions.value
            };
        case types.STEP_CURRENT:
            return {
                ...state, stepCurrent: actions.value
            };
        case types.LATEST_STEP:
            return { 
                ...state, latestStep: actions.value 
            };
        default:
            return state;
    }
};

export default reducer;

export const reduxMapper = (C) => {
    const mapStateToProps = (state) => {
        // console.log(state);
        return {
            activeTopTab: state.installManager.activeTopTab,
            activeLeftTab: state.installManager.activeLeftTab,
            isExpendContent: state.installManager.isExpendContent,
            stepCurrent: state.installManager.stepCurrent,
            latestStep: state.installManager.latestStep,
        }
    };

    const mapDispatchToProps = (dispatch) => ({
        ...bindActionCreators(actions, dispatch)
    });

    return connect(mapStateToProps, mapDispatchToProps)(C);
};