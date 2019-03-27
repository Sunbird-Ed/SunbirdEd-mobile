import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Events, App, MenuController } from 'ionic-angular';

@Component({
  selector: 'application-header',
  templateUrl: 'application-header.html',
})
export class ApplicationHeaderComponent {
  @Input() headerConfig: any = false;
  @Output() headerEvents = new EventEmitter();
  @Output() sideMenuItemEvent = new EventEmitter();

  constructor(public menuCtrl: MenuController) {

  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

  emitEvent($event, name) {
    this.headerEvents.emit({ name });
  }

  emitSideMenuItemEvent($event, menuItem) {
    this.sideMenuItemEvent.emit({ menuItem });
  }

}
