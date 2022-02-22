import {
  EntitySubscriberInterface,
  Connection,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { User } from './entity/User.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(private connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  beforeInsert(event: InsertEvent<User>) {
    console.log(`BEFORE USER INSERTED: `, event.entity);
  }
}
