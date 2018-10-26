import { Component, Input } from '@angular/core';

@Component({
  selector: 'pb-horizontal',
  templateUrl: 'pb-horizontal.html'
})
export class PBHorizontal {
  // tslint:disable-next-line:no-input-rename
  @Input('progress') progress;
  // tslint:disable-next-line:no-input-rename
  @Input('isOnBoardCard') isOnBoardCard;

  constructor() {
  }

}
