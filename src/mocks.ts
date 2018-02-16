export class MockNavParams{
    data = {
    };
  
    get(param){
      return this.data[param];
    }
  }
  export class MockPopoverController {
    create(component: any, data?: {}, opts?: any): MockPopover {
      return new MockPopover();
    }
  }
  
  // Popover
  export class MockPopover {
    present(navOptions?: any): Promise<any> {
      return Promise.resolve();
    }
  }