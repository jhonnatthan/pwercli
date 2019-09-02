import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/**
 * Action types and Creators
 */
const { Types, Creators } = createActions({
    userRequest: ['userId'],
    requestSuccess: ['user'],
    requestFailure: null
});

export const AudioTypes = Types;
export default Creators;

/**
 * Initial state
 */
export const INITIAL_STATE = Immutable({
    user: null,
    error: false,
    loading: false
});

/**
 * Reducer
 */
export const reducer = createReducer(INITIAL_STATE, {
    [Types.USER_SUCCESS]: (state, { user }) => state.merge({ user, loading: false }),
    [Types.USER_FAILURE]: (state, {}) => state.merge({ error: true, loading: false }),
});
