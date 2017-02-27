"use strict";
var Rise = (function() {
  function Rise() {}
  return Rise;
}());
exports.rise = new Rise();
//# sourceMappingURL=index.js.maping TypeScript decorators.

## Install

Install with npm.

```sh
npm install --save simple-ui_rise
```

Install with bower.

```sh
bower install --save simple-ui_rise
```

## Setup

The library uses ES6 exports for all decorators and the main DI object. To import the full library into a file you can destructure the export object.

```TypeScript
import {  } from 'simple-ui_rise';
```

The four object you are injecting are:

| Object     | Purpose
|:-----------|:--------------
| ``         | 

## A Simple Service

```TypeScript
import { rise } from 'simple-ui_rise';

rise
  .channel()
  .service({
    identity: () => { type: `purpose` },
    consume: (message: IMessage) => {
      return `response`;
    }
  })  
  .intercept((message: IMessage): IMessage => {
    return message;
  })
  .consume((response: any) => console.log(response), {
    shape: {
      type: `purpose::response`
    }
  })
  .produce(() => { 
    type: `purpose`
  });
```

## Future Enhancements

A list of future enhancements.

- `proxy` to override any bus method