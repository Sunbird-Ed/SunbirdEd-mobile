import { Directive, ElementRef, Renderer2, Input } from '@angular/core';
import { Events } from 'ionic-angular';

@Directive({
  selector: '[hide-header-footer]', // Attribute
  host: {
    '(ionScroll)': 'onContentScroll($event)'
  }
})
export class HideHeaderFooterDirective {

  headerHeight;
  hideTimer: NodeJS.Timer;

  constructor(private elemRef: ElementRef, private renderer: Renderer2, public event: Events) {}

  onContentScroll(event) {
    // this.renderer.addClass(this.elemRef.nativeElement, 'expand-header-footer');
    // this.event.publish('hideHeaderOnScroll', true);
    // this.event.publish('hideFooterTabOnScroll', true);
    // this.event.publish('hideResourseFilterOnScroll', true);
    // this.hideTimer = setTimeout(() => {
    //   this.renderer.removeClass(this.elemRef.nativeElement, 'expand-header-footer');
    // }, 500);
  }

}
