import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/**
 * Action types and Creators
 */
const { Types, Creators } = createActions({
    audioRequest: ['audioId'],
    requestSuccess: ['audio'],
    requestFailure: null
});

export const AudioTypes = Types;
export default Creators;

/**
 * Initial state
 */
export const INITIAL_STATE = Immutable({
    audio: null,
    error: false,
    loading: false
});

/**
 * Reducer
 */
export const reducer = createReducer(INITIAL_STATE, {
    [Types.AUDIO_SUCCESS]: (state, { audio }) => state.merge({ audio, loading: false }),
    [Types.AUDIO_FAILURE]: (state, {}) => state.merge({ error: true, loading: false }),
});
