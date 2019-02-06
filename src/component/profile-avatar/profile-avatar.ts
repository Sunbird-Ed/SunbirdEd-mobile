import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { setTimeout } from 'timers';

/**
 * Generated class for the ProfileAvatarComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'profile-avatar',
  templateUrl: 'profile-avatar.html'
})
export class ProfileAvatarComponent implements OnInit, OnChanges {
  @Input() username: string;
  bgColor: string;
  color: string;
  initial: string;
  GraphemeSplitter = require('grapheme-splitter');
  constructor() {
  }

  ngOnInit() {
    this.extractInitial();
  }

  /**
   * It will detect the changes of username and call the extractInitial() method
   * @param changes
   */
  ngOnChanges(changes: any) {
    this.username = changes.username.currentValue;
    this.extractInitial();
  }

  getBgColor(pname) {
    this.bgColor = this.stringToColor(pname.toLowerCase());
    this.color = this.getContrast(this.bgColor);
    // return { 'background-color': bgColor, 'color': color, 'opacity': 0.9 };
  }

  /*Get color Hex code by passing a string*/
  stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      // tslint:disable-next-line:no-bitwise
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let colour = '#';
    for (let i = 0; i < 3; i++) {
      // tslint:disable-next-line:no-bitwise
      const value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
  }

  /*Get text contrast by passing background hex color*/
  getContrast(hexcolor) {
    const r = parseInt(hexcolor.substr(1, 2), 16);
    const g = parseInt(hexcolor.substr(3, 2), 16);
    const b = parseInt(hexcolor.substr(5, 2), 16);
    const color = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (color >= 128) ? '#000000' : '#ffffff';
  }

  /**
 * It will extract the first character of the user name and return with different BG color
 */
  extractInitial() {
    const splitter = new this.GraphemeSplitter();
    const split: string[] = splitter.splitGraphemes(this.username.trim());
    const temp = [this.username.trim().substr(0, 1)];
    const initials = temp || [];
    // this.initial = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
    this.initial = split[0];
    if (this.initial) {
      this.getBgColor(this.username);
    }
  }
}
