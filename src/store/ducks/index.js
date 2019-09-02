import { combineReducers } from 'redux';

import { reducer as audio } from './audio';

import { reducer as user } from './user';

export default combineReducers({
	audio,
    user
});
