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

export const UserTypes = Types;
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
    [Types.REQUEST_SUCCESS]: (state, { user }) => state.merge({ user, loading: false }),
    [Types.REQUEST_FAILURE]: (state, {}) => state.merge({ error: true, loading: false }),
});
