import { Component, Input } from '@angular/core';

@Component({
  selector: 'pb-horizontal',
  templateUrl: 'pb-horizontal.html'
})
export class PBHorizontal {

  @Input('progress') progress;
  @Input('isOnBoardCard') isOnBoardCard;

  constructor() {

  }

}