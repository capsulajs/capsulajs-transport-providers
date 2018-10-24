import { AxiosDispatcher } from 'HTTP/AxiosDispatcher';
import { WebSocketDispatcher } from 'WebSocket/WebSocketDispatcher';

describe('Transport providers are available', () => {

  it('Creates an instance of the AxiosDispatcher', () => {
    const axiosDispatcher = new AxiosDispatcher('');
    expect(axiosDispatcher.constructor).toBe(AxiosDispatcher);
  });

  it('Creates an instance of the WebSocketDispatcher', () => {
    const webSocketDispatcher = new WebSocketDispatcher('');
    expect(webSocketDispatcher.constructor).toBe(WebSocketDispatcher);
  });
});
