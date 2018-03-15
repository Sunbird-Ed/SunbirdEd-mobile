import { Component, Input } from "@angular/core";

@Component({
  selector: 'course-card',
  templateUrl: 'course-card.html'
})
export class CourseCard {

  /**
   * Contains course details
   */
  @Input() course: any;

  @Input() layoutName: string;

  constructor() {
  }
}
