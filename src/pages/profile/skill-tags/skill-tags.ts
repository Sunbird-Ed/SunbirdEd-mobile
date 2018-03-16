import { Component } from '@angular/core';

@Component({
  selector: 'skill-tags',
  templateUrl: 'skill-tags.html'
})
export class SkillTagsComponent {

  items: Array<string>;
  tags: Array<string> = [];

  constructor() {
    this.items = ['Pizza', 'Pasta', 'Parmesan'];
  }

}
