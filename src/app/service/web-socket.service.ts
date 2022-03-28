import { Injectable } from '@angular/core';
import {WaitingList} from "../model/WaitingList";

@Injectable()
export class WebSocketService {

    webSocket: WebSocket;

    waitingList: WaitingList[] =[];

  constructor() {
  }

  public openWebSocket() {
      this.webSocket = new WebSocket('ws://localhost:9090/selfservice/waitingList');

      this.webSocket.onopen = (event) => {
          // console.log('Open', event);
      }

      this.webSocket.onmessage = (event) => {
          const waitingListDto = JSON.parse(event.data);
          this.waitingList = [...this.waitingList, waitingListDto];
      }

      this.webSocket.onclose = (event) => {
          // console.log('Close', event);
      }
  }

  public sendData(waitingList : WaitingList) {
    this.webSocket.send(JSON.stringify(waitingList));
  }

  public closeWebSocket() {
      this.webSocket.close();
  }
}
