import { Directive, Renderer2, ElementRef } from '@angular/core';
import { Events } from 'ionic-angular';

/**
 * Generated class for the HideTabFooterDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[hide-tab-footer]' // Attribute selector
})
export class HideTabFooterDirective {

  hideTimer: NodeJS.Timer;

  constructor(private elemRef: ElementRef, private renderer: Renderer2, public event: Events) {
    console.log('Hello HideTabFooterDirective Directive');
  }

  ngOnInit() {
    console.log(this.elemRef.nativeElement);
    console.log(document.querySelector('.tabbar'));
    // this.renderer.setStyle(this.elemRef.nativeElement.querySelector('.tabbar'), 'webkitTransition', 'bottom 300ms');
    // this.event.subscribe('hideFooterTabOnScroll', (data) => {
    //   console.log('hideFooterTabOnScroll');
    //   this.renderer.setStyle(this.elemRef.nativeElement.querySelector('.tabbar'), 'bottom', '-56px');
    //   this.hideTimer = setTimeout(() => {
    //     this.renderer.setStyle(this.elemRef.nativeElement.querySelector('.tabbar'), 'bottom', '0px');
    //   }, 1000);
    // });
    this.event.subscribe('hideFooterTabOnScroll', (data) => {
      console.log('hideFooterTabOnScroll');
      this.renderer.setStyle(document.querySelector('.tabbar'), 'webkitTransition', 'bottom 500ms');
      this.renderer.setStyle(document.querySelector('.tabbar'), 'bottom', '-88px');
      this.hideTimer = setTimeout(() => {
        this.renderer.setStyle(document.querySelector('.tabbar'), 'webkitTransition', 'bottom 700ms');
        this.renderer.setStyle(document.querySelector('.tabbar'), 'bottom', '0px');
      }, 300);
    });
  }

}
