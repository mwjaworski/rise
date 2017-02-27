import { Event, IEvent } from './event';
import { IService, ProducerService, ConsumerService } from './service';
import { ServiceQuery } from '../engine/service_query';
import { Queue, IFilter, IMessage, integer } from '../core/types';
import { Component, IComponent } from '../engine/component';
import { unionWith } from 'lodash';

export interface IChannel extends IComponent {

}
export class Channel extends Component implements IChannel {

  private _queue: Queue<IEvent>;
  private _servicesId: Record<string, IService>;
  private _servicesQuery: ServiceQuery;

  constructor() {
    super();
  }

  intercept(transformation: (message: IMessage) => IMessage, rule: () => IFilter | IFilter): this {
    // ...intercept messages and transform them
    return this;
  }

  producer(produce: () => IMessage): () => this {    
    const service: IService = new ProducerService(produce);
    
    this.service(service);
    return () => {
      // TODO when we call produce, how do we get alerted? 
      // in the `this.service` method we need to add listeners...
      service.produce();
      return this;
    };
  }

  // register something that always receives
  consumer(consume: (message: IEvent) => IMessage | undefined, filter: () => IFilter | IFilter): this {
    this.service(new ConsumerService(consume, filter));
    return this;
  }

  service(service: IService): this {
    // TODO prevent overwrite
    this._servicesId[service.id] = service;
    // TODO add to service tree
    return this;
  }
}