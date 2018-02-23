import { Injectable } from "@angular/core";

@Injectable()
export class EventService {

  register(successCallback: (response: string) => void,
    errorCallback: (error: string) => void) {
    try {
      (<any>window).GenieSDK.event.register(successCallback, errorCallback);
    } catch (error) {
      console.log(error);
    }
  }

  unregister(successCallback: (response: string) => void,
    errorCallback: (error: string) => void) {

    try {
      (<any>window).GenieSDK.event.unregister(successCallback, errorCallback);
    } catch (error) {
      console.log(error);
    }

  }

}
