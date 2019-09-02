import { call, put } from 'redux-saga/effects';
import api from '../../services/api';
import UserActions from '../ducks/user';

export function* requestUser({ userId }) {
    try {
        const response = yield call(api.get, `user/${userId}`);
        yield put(UserActions.requestSuccess(response.data));
    } catch (err) {
        yield put(UserActions.requestFailure());
    }
}
