import { Injectable } from "@angular/core";
import { Impression, Start, Audit, End, ExData, Feedback, Interact, Interrupt, Log, Search, Share } from './bean';
import { TelemetryServiceFactory } from "./factory";
import { GenieResponse } from "../service.bean";
import { SyncStat } from "../../../plugins/settings/datasync/syncstat";

@Injectable()
export class TelemetryService {

  constructor(private factory: TelemetryServiceFactory) {

  }

  audit(audit: Audit) {
    try {
      this.factory.getService().audit(JSON.stringify(audit));
    } catch (error) {
      console.log(error);
    }
  }

  start(start: Start) {
    try {
      this.factory.getService().start(JSON.stringify(start));
    } catch (error) {
      console.log(error);
    }
  }

  end(end: End) {
    try {
      this.factory.getService().end(JSON.stringify(end));
    } catch (error) {
      console.log(error);
    }
  }

  error(error: Error) {
    try {
      this.factory.getService().error(JSON.stringify(error));
    } catch (error) {
      console.log(error);
    }
  }

  exdata(exdata: ExData) {
    try {
      this.factory.getService().exdata(JSON.stringify(exdata));
    } catch (error) {
      console.log(error);
    }
  }


  feedback(feedback: Feedback) {
    try {
      this.factory.getService().feedback(JSON.stringify(feedback));
    } catch (error) {
      console.log(error);
    }
  }

  impression(impression: Impression) {
    try {
      this.factory.getService().impression(JSON.stringify(impression));
    } catch (error) {
      console.log(error);
    }
  }


  interact(interact: Interact) {
    try {
      this.factory.getService().interact(JSON.stringify(interact));
    } catch (error) {
      console.log(error);
    }
  }


  interrupt(interrupt: Interrupt) {
    try {
      this.factory.getService().interrupt(JSON.stringify(interrupt));
    } catch (error) {
      console.log(error);
    }
  }


  log(log: Log) {
    try {
      this.factory.getService().log(JSON.stringify(log));
    } catch (error) {
      console.log(error);
    }
  }

  search(search: Search) {
    try {
      this.factory.getService().search(JSON.stringify(search));
    } catch (error) {
      console.log(error);
    }
  }

  share(share: Share) {
    try {
      this.factory.getService().share(JSON.stringify(share));
    } catch (error) {
      console.log(error);
    }
  }

  sync(successCallback: (response: GenieResponse<SyncStat>) => void,
    errorCallback: (error: string) => void) {
    try {
      this.factory.getService().sync(successCallback, errorCallback);
    } catch (error) {
      console.log(error);
    }
  }

}
