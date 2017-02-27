import 'mocha';
import { assert } from 'chai';
import { ServiceQuery } from '../lib/engine/service_query';
import { IService } from '../lib/components/service';
import { Component, IComponent } from '../lib/engine/component';
import { IMessage } from '../lib/core/types';
import { head, has, includes } from 'lodash';

class Service1 extends Component implements IService {
  // VALUE
  identity(): IMessage {
    return {
      type: 1
    };
  }
}
class Service2 extends Component implements IService {
  // TYPE
  identity(): IMessage {
    return {
      type: Number
    };
  }
}
class Service3 extends Component implements IService {
  // ANY
  identity(): IMessage {
    return {
      type: null
    };
  }
}

describe('RISE: ServiceQuery', () => {
  
  const service1 = new Service1();
  const service2 = new Service2();
  const service3 = new Service3();

  it('ServiceQuery will track matches against values, types, or *', () => {
  
    const serviceQuery = new ServiceQuery();

    serviceQuery.registerService(service1);
    serviceQuery.registerService(service2);
    serviceQuery.registerService(service3);

    const database = serviceQuery.database;

    assert(head(database['type']['number::1']) === service1, 'Service 1 matches a value');
    assert(head(database['type']['number']) === service2, 'Service 1 matches a type');
    assert(head(database['type']['*']) === service3, 'Service 1 matches a anything');

  });

  it('ServiceQuery will match (lookup) against values, types, or *', () => {
  
    const serviceQuery = new ServiceQuery();

    serviceQuery.registerService(service1);
    serviceQuery.registerService(service2);
    serviceQuery.registerService(service3);

    const serviceLookup1 = serviceQuery.discoverServices({
      type: 1
    });
    const serviceLookup2 = serviceQuery.discoverServices({
      type: 2
    });
    const serviceLookup3 = serviceQuery.discoverServices({
      type: '-'
    });

    assert(includes(serviceLookup1 as any, service3), `service(*) matches 1`);
    assert(includes(serviceLookup1 as any, service2), `service(number) matches 1`);
    assert(includes(serviceLookup1 as any, service1), `service(1) matches 1`);

    assert(includes(serviceLookup2 as any, service3), `service(*) matches 2`);
    assert(includes(serviceLookup2 as any, service2), `service(number) matches 2`);
    
    assert(includes(serviceLookup3 as any, service3), `service(3) matches '-'`);

  });

});