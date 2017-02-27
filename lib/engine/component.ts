import { Queue, integer } from '../core/types';
import { uniqueId, unionWith } from 'lodash';

export interface IComponent {
  readonly id: string;
}
export class Component {
  private _id: string = uniqueId();

  get id(): string {
    return this._id;
  }

  static isEqual(_1: IComponent, _2: IComponent) {
    return _1.id === _2.id;
  }
}