import { Directive, Renderer2, ElementRef, OnInit } from '@angular/core';
import { Events } from 'ionic-angular';

@Directive({
  selector: '[hide-header]'
})
export class HideHeaderDirective implements OnInit {
  hideTimer: NodeJS.Timer;

  constructor(private elemRef: ElementRef, private renderer: Renderer2, public event: Events) {}

  ngOnInit() {
    this.event.subscribe('hideHeaderOnScroll', (data) => {
      this.renderer.setStyle(this.elemRef.nativeElement, 'webkitTransition', 'top 200ms');
      this.renderer.setStyle(this.elemRef.nativeElement, 'top', '-56px');
      this.hideTimer = setTimeout(() => {
        this.renderer.setStyle(this.elemRef.nativeElement, 'webkitTransition', 'top 500ms');
        this.renderer.setStyle(this.elemRef.nativeElement, 'top', '0px');
      }, 500);
    });
  }

}
