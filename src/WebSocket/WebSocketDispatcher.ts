// @flow

/*
*  Send and receive requests serially
*  next reuqest is only sent when the previous one got its response
*/

import { Dispatcher } from 'api';

const errorMessages = {
  notConnected: 'Not connected!',
  resourceIsBusy: 'Resource is busy!',
  unknownState: 'Error due to unknown state',
};

export class WebSocketDispatcher extends Dispatcher {
  private webSocket?: WebSocket;
  private responseData: any;

  open(): Promise<null> {

    if (this.getState() === 'OPEN') {
      return Promise.resolve(null);
    }

    return new Promise((resolve, reject) => {
      this.webSocket = new WebSocket(this.baseUrl);
      this.webSocket.onopen = () => resolve(null);
      this.webSocket.onerror = error => reject(error);
    });
  }

  dispatchInt<T, R> (request: T, api: string): Promise<R> {
    const { webSocket } = this;

    if (!webSocket) {
      return Promise.reject(new Error('Not initializied'));
    }

    if (webSocket.onmessage) {
      return Promise.reject(new Error(errorMessages.resourceIsBusy));
    }

    const fullRequest = {
      q: api,
      sid: 1,
      d: request,
    };

    this.responseData = null;

    return new Promise((resolve, reject) => {

      webSocket.onmessage = message => {
        const parsedResponse = JSON.parse(message.data);

        this.responseData = parsedResponse.d || this.responseData;

        if (parsedResponse.sig) {
          webSocket.onmessage = null;

          const { responseData } = this;
          responseData.errorCode ?
            reject(responseData) :
            resolve(responseData);
        }
      }
      webSocket.onerror = error => reject(error);
      webSocket.send(JSON.stringify(fullRequest));
    });
  }

  dispatch<T, R> (request: T, api: string): Promise<R> {

    switch (this.getState()) {
      case 'OPEN': return this.dispatchInt(request, api);
      case 'NONE':
      case 'CLOSED':
        return this.open().then(() =>
          this.dispatchInt<T, R>(request, api)
        );
      default: return Promise.reject(errorMessages.unknownState);
    };
  }

  finalize(): Promise<null> {
    const { webSocket } = this;
    const state = this.getState();

    if (!webSocket || state === 'NONE' || state === 'CLOSED') {
      return Promise.resolve(null);
    }

    return new Promise((resolve, reject) => {
      webSocket.onclose = () => resolve(null);
      webSocket.onerror = () => reject();
      webSocket.close();
    });
  }

  getState(): string {
    const { webSocket } = this;

    if (!webSocket) {
      return 'NONE';
    };

    switch (webSocket.readyState) {
      case 0: return 'CONNECTING';
      case 1: return 'OPEN';
      case 2: return 'CLOSING';
      case 3: return 'CLOSED';
      default: return 'UNKNOWN';
    }
  }
};
