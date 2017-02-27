import { timestamp, integer, IMessage } from '../core/types';
import { Component, IComponent } from '../engine/component';

export interface IEvent extends IComponent {    
  readonly priority: integer;
  readonly sender: integer;    
  readonly ts: timestamp;  
  readonly message: IMessage;
}

export class Event extends Component implements IEvent {  
  
  ts: timestamp = Date.now();
  priority: integer = 0;

  constructor(public message: IMessage, public sender: integer) {
    super();    
  }
}
