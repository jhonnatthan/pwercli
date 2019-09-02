import { all, takeLatest } from 'redux-saga/effects';

import { UserTypes } from '../ducks/user';
import { requestUser } from './user';

export default function* rootSaga() {
    return yield all([
        init(),

        takeLatest(UserTypes.USER_REQUEST, requestUser),
    ]);
}
