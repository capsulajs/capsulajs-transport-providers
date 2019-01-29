# CapsulaJS Transport Providers

Impements Dispatcher-like transport providers for HTTP and WebSocket protocols.

## Base class:
```javascript
export abstract class Dispatcher {
  // Base URL
  protected baseUrl: string;

  // Base Constructor
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  };

  // Interface for the Dispatcher
  abstract dispatch<T, R>(api: string, request: T): Promise<R>;

  // Optional Destructor-like method
  finalize?(): Promise<void>;
};
```
baseUrl - base URL of the service, being set by Constructor

constructor(baseUrl: string) - base constructor, sets the baseUrl,
call it in the Constructor of any subclasses

dispatch&lt;T, R&gt; (request: T, api: string): Promise&lt;R&gt; - dispatching method,
simply dispatches a Request, returns a Promise with the Response (or a rejected one with an Error)

finalize?(): Promise&lt;null&gt; - optional method,
implement it if a subclass needs to free resources

## AxiosDispatcher and WebSocketDispatcher
Inherits from base Dispatcher class. Pass a base URL to its Constructor, then call the dispatch method, passing an end-point and a body of a request.

```javascript
import { AxiosDispatcher } from '@capsulajs/capsulajs-transport-providers';

const dispatcher = new AxiosDispatcher('http://my-server.com');
dispatcher.dispatch('/end-point', request)
  .then(res => {
    // Process the response
  })
  .catch(err => {
    // Process the error
  });
```

WebSocketDispatcher's usage is the same
