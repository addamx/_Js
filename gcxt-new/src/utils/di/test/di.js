import di from '../index';

const $di = new di();
export default $di;

export const injectable = $di.injectable.bind($di);
export const inject = $di.inject.bind($di);
