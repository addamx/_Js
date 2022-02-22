import { injectable } from './di';

@injectable()
export default class ServiceB {
    getData() {
        return ['id1', 'id2', 'id3']
    }
}

