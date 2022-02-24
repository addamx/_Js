/* eslint-disable no-constant-condition */

import { take, fork, all, race, select, call, put, takeEvery, delay, cancel, cancelled } from 'redux-saga/effects'

export function* incrementAsync() {
  yield delay(1000);
  yield put({ type: 'INCREMENT' }); //put 触发的action可以被saga捕获, 所以一定要注意不要进入循环监视
  console.log('run incrementAsync')
}

export function* watchIncrement() {
  console.log('run watchIncrement')
}

function promiseSucc(result) {
  return Promise.resolve().then(() => {
    console.log('%c resolve','color:red');
    return result;
  });
}

function promiseFail() {
  return Promise.reject(new Error('404')).then(() => {
    console.log('Resolved??');
  }, (result) => {
    console.log('%c recject','color:red');
    return {
      error: +result.message
    }
  });
}

function throwError() {
  console.log('%c Error','color:red');
  throw Error();
}

/**
 * call, put 都是为了方便测试, call无需真正地发起真实业务请求, put无需模拟dispatch
 * 直接将generator.next().value结果与call/put的返回值对比即可;
 Effect对象结构
 {
   @@redux-saga/IO: ..,
   combinator: ..,
   payload: {},
   type: ..
 }
 Effect的对象结构直接用 deepEqual对比即可完成测试
 */
export function* testEffect() {
  // { call, apply, cps }  用于处理Promise结果的函数, 或者 另一个generator 函数
  // yield call([obj, obj.method], arg1, arg2, ...) // 如同 obj.method(arg1, arg2 ...)
  // yield apply(obj, obj.method, [arg1, arg2, ...])
  // yeild cps(readFile, '/path/to/file') 适用 Node风格的函数: fn(...args, callback)
  const result = yield call(promiseSucc, 200);
  yield put({ type: 'TRIGGER_PROMISE_SUCC', payload: result })

  /**
   * 错误处理2种:
   * 1. 让API服务返回一个正常的含有错误标志的值
   * 2. `try ... catch` 捕获错误
   */
  const {error} = yield call(promiseFail);
  if (error) {
    yield put({type: 'TRIGGER_PROMISE_FAIL', payload: error})
  }

  try {
    yield call(throwError)
  } catch(error) {
    yield put({type: 'CATCH_ERROR', payload: 403})
  }
}

function* authorize(isSuccess) {
  try {
    yield delay(2000);
    const result = isSuccess ? yield call(promiseSucc, 200) : yield call(throwError);
    yield put({type: 'LOGIN_SUCCESS'})
    // return result; // 由于authorize被fork调用, 不需返回值
  } catch(error) {
    yield delay(2000);
    yield put({type: 'LOGIN_ERROR'})
  } finally {
    if (yield cancelled()) {
      // 重置设置, 譬如将reducer的isLogining改为false
      console.log('LOGIN is cancelled')
    }
  }
}

export function* loginFlow() {
  while(true) {
    yield take('LOGIN_REQUEST');
    const task = yield fork(authorize, true);  //为了避免auth过程阻塞, 而让LOGOUT监视被忽视, 这里应该用无阻塞`fork`
    const action = yield take(['LOGOUT','LOGIN_ERROR'])
    if(action.type === 'LOGOUT') {
      yield cancel(task); //将task的cancelled状态设为true
      console.log('LoginOut -- 88')
    } else {
      console.log('LoginIn -- welcome')
    }
  }
}

export function* loginRace() {
  while(true) {
    yield take('LOGIN_REQUEST');
    // const {success, cancelled} = yield race({
    //   success: call(authorize, true),
    //   cancelled: take('LOGOUT')
    // })
    const [success, cancelled] = yield race([
      call(authorize, true),
      take('LOGOUT')
    ])
    if(cancelled) {
      // 不需要`cancel`, race会将authorize谁cancel状态
      console.log('LoginOut -- 88')
    } else {
      console.log('LoginIn -- welcome')
    }
  }
}

export function* firstToThird() {
  /**
   * 监视 3 次'DECREMENT', 之后执行`DONE_WATCH3`, 进入take('*')的监视范围
   */
  for (let i = 0; i < 3; i++) {
    const action = yield take('DECREMENT')
  }
  yield put({type: 'DONE_firstToThird'})
}

export function* watchLog() {
  while (true) {
    const action = yield take('*');
    // const state = yield select();
    console.log('action', action.type);
  }
}

/**
 * Saga Helpers: takeEvery, takeLatest
 */
export default function* rootSaga() {
  console.log('[init-before]')
  // 一旦其中任何一个任务被拒绝，并行的 Effect 将会被拒绝
  yield all([
    takeEvery('INCREMENT_ASYNC', incrementAsync),
    takeEvery('TEST_EFFECT', testEffect),
    call(firstToThird),
    call(watchLog),
    // call(loginFlow),
    call(loginRace),
  ]);

  /**
   * 前面由`all`组合的Effect如果不结束while/for等阻塞监视, 则无法执行到此处
   */
  console.log('[innit-after]');
}
