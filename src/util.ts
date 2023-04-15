export function simpleUpdateState(state, action) {
    switch (action.type) {
        case 'update':
            return {
                ...state,
                ...action.payload
            }
        default:
            return state;
    }
}