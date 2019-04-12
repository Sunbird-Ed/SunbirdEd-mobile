import { Directive, ElementRef, Renderer2, Input } from '@angular/core';
import { Events } from 'ionic-angular';

/**
 * Generated class for the HideHeaderFooterDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[hide-header-footer]', // Attribute
  host: {
    '(ionScroll)': 'onContentScroll($event)'
  }
})
export class HideHeaderFooterDirective {

  headerHeight;
  hideTimer: NodeJS.Timer;

  constructor(private elemRef: ElementRef, private renderer: Renderer2, public event: Events) {
    console.log('Hello HideHeaderFooterDirective Directive');
  }

  ngOnInit() {
    this.renderer.setStyle(this.elemRef.nativeElement, 'webkitTransition', 'top 200ms');
  }

  onContentScroll(event) {
    this.renderer.setStyle(this.elemRef.nativeElement, 'webkitTransition', 'top 200ms');
    this.renderer.setStyle(this.elemRef.nativeElement, 'top', '-56px');
    // this.renderer.setStyle(this.elemRef.nativeElement, 'bottom', '-56px');
    this.event.publish('hideHeaderOnScroll', true);
    this.event.publish('hideFooterTabOnScroll', true);
    this.hideTimer = setTimeout(() => {
      this.renderer.setStyle(this.elemRef.nativeElement, 'webkitTransition', 'top 500ms');
      this.renderer.setStyle(this.elemRef.nativeElement, 'top', '0px');
      // this.renderer.setStyle(this.elemRef.nativeElement, 'bottom', '0px');
    }, 500);
  }

}
