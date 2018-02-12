import { Injectable } from "@angular/core";
import { Impression, Start, Audit, End, ExData, Feedback, Interact, Interrupt, Log, Search, Share } from './bean';

@Injectable()
export class TelemetryService {

  audit(audit: Audit) {
    try {
      (<any>window).GenieSDK.telemetry.audit(JSON.stringify(audit));
    } catch (error) {
      console.log(error);
    }
  }

  start(start: Start) {
    try {
      (<any>window).GenieSDK.telemetry.start(JSON.stringify(start));
    } catch (error) {
      console.log(error);
    }
  }

  end(end: End) {
    try {
      (<any>window).GenieSDK.telemetry.end(JSON.stringify(end));
    } catch (error) {
      console.log(error);
    }
  }

  error(error: Error) {
    try {
      (<any>window).GenieSDK.telemetry.error(JSON.stringify(error));
    } catch (error) {
      console.log(error);
    }
  }

  exdata(exdata: ExData) {
    try {
      (<any>window).GenieSDK.telemetry.exdata(JSON.stringify(exdata));
    } catch (error) {
      console.log(error);
    }
  }


  feedback(feedback: Feedback) {
    try {
      (<any>window).GenieSDK.telemetry.feedback(JSON.stringify(feedback));
    } catch (error) {
      console.log(error);
    }
  }

  impression(impression: Impression) {
    try {
      (<any>window).GenieSDK.telemetry.impression(JSON.stringify(impression));
    } catch (error) {
      console.log(error);
    }
  }


  interact(interact: Interact) {
    try {
      (<any>window).GenieSDK.telemetry.interact(JSON.stringify(interact));
    } catch (error) {
      console.log(error);
    }
  }


  interrupt(interrupt: Interrupt) {
    try {
      (<any>window).GenieSDK.telemetry.interrupt(JSON.stringify(interrupt));
    } catch (error) {
      console.log(error);
    }
  }


  log(log: Log) {
    try {
      (<any>window).GenieSDK.telemetry.log(JSON.stringify(log));
    } catch (error) {
      console.log(error);
    }
  }

  search(search: Search) {
    try {
      (<any>window).GenieSDK.telemetry.search(JSON.stringify(search));
    } catch (error) {
      console.log(error);
    }
  }

  share(share: Share) {
    try {
      (<any>window).GenieSDK.telemetry.share(JSON.stringify(share));
    } catch (error) {
      console.log(error);
    }
  }

  sync() {
    try {
      (<any>window).GenieSDK.telemetry.sync();
    } catch (error) {
      console.log(error);
    }
  }

}
