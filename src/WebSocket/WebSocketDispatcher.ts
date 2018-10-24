/*
*  Send and receive requests serially
*  next request is only sent when the previous one got its response
*/

import { Dispatcher } from '../api';

const errorMessages = {
  notConnected: 'Not connected!',
  resourceIsBusy: 'Resource is busy!',
  unknownState: 'Error due to unknown state',
};

export class WebSocketDispatcher extends Dispatcher {
  private webSocket?: WebSocket;
  private responseData: any;

  open(): Promise<void> {

    if (this.getState() === 'OPEN') {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      this.webSocket = new WebSocket(this.baseUrl);
      this.webSocket.onopen = () => resolve();
      this.webSocket.onerror = error => reject(error);
    });
  }

  dispatchInt<T, R> (api: string, request: T): Promise<R> {
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

  dispatch<T, R> (api: string, request: T): Promise<R> {

    switch (this.getState()) {
      case 'OPEN': return this.dispatchInt(api, request);
      case 'NONE':
      case 'CLOSED':
        return this.open().then(() =>
          this.dispatchInt<T, R>(api, request)
        );
      default: return Promise.reject(errorMessages.unknownState);
    };
  }

  finalize(): Promise<void> {
    const { webSocket } = this;
    const state = this.getState();

    if (!webSocket || state === 'NONE' || state === 'CLOSED') {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      webSocket.onclose = () => resolve();
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
