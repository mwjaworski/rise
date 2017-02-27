import { Channel } from './components/channel';

class Rise {
  constructor() {

  }
  channel(): Channel {
    return new Channel();
  }
}

export const rise = new Rise();