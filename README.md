# CapsulaJS Transport Providers

Impements Dispatcher-like transport providers for HTTP and WebSocket protocols.

Base class:
```javascript
export abstract class Dispatcher {
  // Base URL
  protected baseUrl: string;

  // Base Constructor
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  };

  // Interface for the Dispatcher
  abstract dispatch<T, R>(request: T, api: string): Promise<R>;

  // Optional Destructor-like method
  finalize?(): Promise<null>;
};
```
baseUrl - base URL of the service, being set by Constructor

constructor(baseUrl: string) - base constructor, sets the baseUrl,
call it in the Constructor of any subclasses

dispatch<T, R>(request: T, api: string): Promise<R> - dispatching method,
simply dispatches a Request, returns a Promise with the Response (or a rejected one with an Error)

finalize?(): Promise<null> - optional method,
implement it if a subclass needs to free resources