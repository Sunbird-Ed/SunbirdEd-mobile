import { Component, Input, OnInit } from '@angular/core';
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
export class ProfileAvatarComponent implements OnInit {
  @Input() username: string;
  bgColor: string;
  color: string;
  initial: string;

  constructor() {
    console.log('Hello ProfileAvatarComponent Component');
    console.log('name const: ', this.username);
  }

  ngOnInit() {
    const initials = this.username.match(/\b\w/g) || [];
    this.initial = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
    console.log(this.initial);
    if (this.initial) {
      this.getBgColor(this.username);
    }
  }

  getBgColor(pname) {
    this.bgColor = this.stringToColor(pname.toLowerCase());
    this.color = this.getContrast(this.bgColor);
    //return { 'background-color': bgColor, 'color': color, 'opacity': 0.9 };
  }
    /*Get color Hex code by passing a string*/
    stringToColor(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        let colour = '#';
        for (let i = 0; i < 3; i++) {
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


}
