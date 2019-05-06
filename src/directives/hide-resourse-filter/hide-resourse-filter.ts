import { Directive, Renderer2, ElementRef } from '@angular/core';
import { Events } from 'ionic-angular';

@Directive({
  selector: '[hide-resourse-filter]' // Attribute selector
})
export class HideResourseFilterDirective {
  hideTimer: NodeJS.Timer;

  constructor(private elemRef: ElementRef, private renderer: Renderer2, public event: Events) {}

  ngOnInit() {
    this.event.subscribe('hideResourseFilterOnScroll', (data) => {
      console.log('hideResourseFilterOnScroll', data);
      this.renderer.setStyle(this.elemRef.nativeElement, 'webkitTransition', 'top 200ms');
      this.renderer.setStyle(this.elemRef.nativeElement, 'top', '-170px');
      this.hideTimer = setTimeout(() => {
        this.renderer.setStyle(this.elemRef.nativeElement, 'webkitTransition', 'top 500ms');
        this.renderer.setStyle(this.elemRef.nativeElement, 'top', '0px');
      }, 500);
    });
  }

}
