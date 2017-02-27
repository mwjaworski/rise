import { IEvent } from './event';
import { integer, IMessage, IFilter } from '../core/types';
import { Component, IComponent } from '../engine/component';

export interface IService extends IComponent {
  identity(): IMessage;
  produce?(): IMessage;
  consume?(message: IEvent): IMessage | undefined;
  started?(): this;
  stopped?(): this;
}

export class ProducerService extends Component implements IService {
  constructor(private _produce: () => IMessage) {
    super();
  }
  identity(): IMessage {
    return {
      type: `--producer--`
    };
  }
  produce(): IMessage {
    return this._produce();
  }
}

export class ConsumerService extends Component implements IService {
  constructor(private _consume: (message: IEvent) => IMessage | undefined, private _filter: () => IFilter | IFilter) {
    super();
  }
  identity(): IMessage {
    return (typeof this._filter === 'function')
      ? this._filter()
      : this._filter;
  }
  consume(message: IEvent): IMessage | undefined {
    return this._consume(message);
  }
}
