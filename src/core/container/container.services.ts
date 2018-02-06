import { Injectable } from "@angular/core";

export interface TapOptions {
  root: any;
  icon?: string;
  label?: string;
  index?: number;
}

@Injectable()
export class ContainerService {

    private tabs:Array<TapOptions> = [];

    addTab(tab: TapOptions) {
      this.tabs.push(tab);
    }

    // addTab(tabObject: any, icon?: string) {
    //     this.tabs.push(tabObject);
    // }

    getAllTabs(): Array<any> {
        return this.tabs;
    }

}


