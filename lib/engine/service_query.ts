import { each, keys, filter, map, compact, get, flatten, uniqWith } from 'lodash';
import { IMessage } from '../core/types';
import { Component } from '../engine/component';
import { IService } from '../components/service';
import { IChannel } from '../components/channel';

const ANY = '*';

interface IServiceQueryMap {
  [key: string]: any;
}
interface IQueryDatabase {
  [filterKey: string]: {
    [filterValue: string]: Array<IService>;
  }
}
export class ServiceQuery {

  private _filterVector: IQueryDatabase = {};

  get database(): IQueryDatabase {
    return this._filterVector;
  }

  registerService(service: IService): this {
    const identity: IMessage = service.identity();
    const filterMap: IServiceQueryMap = this._createFilterMapping(identity);
 
    each(filterMap, (filterValue: any, filterKey: string) => {
      const filterVectorKey = this._filterVector[filterKey] = this._filterVector[filterKey] || {};
      const filterVectorValue = filterVectorKey[`${filterValue}`] = filterVectorKey[`${filterValue}`] || [];

      filterVectorValue.push(service);
    });
    
    return this;
  }

  discoverServices(filterRule: IMessage): IService[] {
    const identity: IMessage = filterRule;
    const filterMap: IServiceQueryMap = this._createFilterMapping(identity);

    return uniqWith(flatten(compact(flatten(map(filterMap, (filterValue: any, filterKey: string) => {
      const [type, value] = filterValue.split('::');

      return compact([
        get(this._filterVector, `${filterKey}.${ANY}`, undefined),
        get(this._filterVector, `${filterKey}.${type}`, undefined),
        get(this._filterVector, `${filterKey}.${filterValue}`, undefined)
      ]);
    })))), Component.isEqual);    
  }

  private _createFilterMapping(message: IMessage, filterMap: IServiceQueryMap = {}, prefix: string = ''): IServiceQueryMap {
    each(keys(message), (key: string): void => {
      const value = message[key];
      const filterMapKey: string = `${prefix}${key}`;
      
      if (!!value && typeof value === 'object') {
        filterMap = this._createFilterMapping(message[key], filterMap, `${filterMapKey}-`);
      }
      else {
        filterMap[filterMapKey] = this._mapValueKey(value);
      }
    });

    return filterMap;
  }

  private _mapValueKey(key: any): string {
    if (key === null) {
      return ANY;
    }
    else if (typeof key === 'function' && typeof key.name === 'string') {
      return key.name.toLowerCase();
    }
    else {
      return `${(typeof key)}::${key}`;
    }
  }

}

// export const filterSet = new FilterSet();
// filterSet.registerService(service.identity(), service);
// filterSet.discoverServices(event.identity());

// methods
// convert object to flattened keys
// build vectors and store services
// filter service list 
// intersection of service list

// { type: 'value' }  // match key & value
// { type: String }   // match key & type
// { type: null }     // match key & (null is a substitute for any)
// { type: { prefix: String, postfix: 'text' } } // match sub-keys
// need a MAP (or maybe an object might work)


// interface FilterNode {
//   key: string;      // type
//   matches: Record<string, string>;     //  
// }

// service = {
//   version: 1,
//   type: 'book',
//   action: 'read',
//   other: {
//     where: 'America',
//     more: String,
//     another: {
//       u: null // which is ANY type or value
//     }
//   }
// }

// action = {
//   version: 1,
//   type: 'book',
//   action: 'read',
//   somethingElse: '...'
// }
// action = { // would also match
//   type: 'book',
//   action: 'read',
//   somethingElse: '...'
// }


// // we flatten search space and then can look for overlap...
// [
//   version: 1,
//   type: book,
//   action: read,
//   other-where: 'america'
// ]

// // service 

// vectors{
//   version: {
//     'value-1': [Service, Service],
//     'value-2': [Service, Service]
//   },
//   type: [Service, Service, ]
//   action: [Service, Service, ],
//   other-where: [Service]
// }

// // 1. find first and filter list
// // 2. find second and intersection list and filter list
// // 3. repeat for all keys until list is zero (quit) or has services - execute all


