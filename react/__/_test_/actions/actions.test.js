import thunk from 'redux-thunk';
import {stub} from 'sinon';
import configureStore from 'redux-mock-store';

import * as actions from '../../src/weather/actions.js';
import * as actionTypes from '../../src/weather/actionTypes.js';

const middlewares = [thunk];
const createMockStore = configureStore(middlewares);


describe('weather/actions', () => {
  describe('fetchWeather', () => {
    let stubbedFetch;
    // redux-mock-store 提供store 的功能, 用于接收action
    const store = createMockStore();

    // 每一个单元测试都应该把环境清理干净
    beforeEach(() => {
      stubbedFetch = stub(global, 'fetch');
    });

    afterEach(() => {
      stubbedFetch.restore();
    });

    it('should dispatch fetchWeatherSuccess action type on fetch success', () => {
      const mockResponse= Promise.resolve({
        status: 200,
        json: () => Promise.resolve({
          weatherinfo: {}
        })
      });
      // stub篡改了fetch的返回结果
      stubbedFetch.returns(mockResponse);

      // 返回一个Promise函数后, 会告诉Jest该**异步**测试用例已经结束
      return store.dispatch(actions.fetchWeather(1)).then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions.length).toBe(2);
        expect(dispatchedActions[0].type).toBe(actionTypes.FETCH_STARTED);
        expect(dispatchedActions[1].type).toBe(actionTypes.FETCH_SUCCESS);
      });
    });

  });
});
