import { Injectable } from "@angular/core";

export interface TabOptions {
  root: any;
  icon?: string;
  label?: string;
  index?: number;
}

@Injectable()
export class ContainerService {

    private tabs:Array<TabOptions> = [];

    addTab(tab: TabOptions) {
      this.tabs.push(tab);
    }

    // addTab(tabObject: any, icon?: string) {
    //     this.tabs.push(tabObject);
    // }

    getAllTabs(): Array<any> {
        return this.tabs.sort((prev, next) => {
          if (prev.index < next.index) return -1;
          if (prev.index > next.index) return 1;
          return 0;
        });
    }

}


