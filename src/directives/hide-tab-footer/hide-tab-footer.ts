import { Directive, Renderer2, ElementRef, OnInit } from '@angular/core';
import { Events } from 'ionic-angular';

@Directive({
  selector: '[hide-tab-footer]' // Attribute selector
})
export class HideTabFooterDirective implements OnInit {

  hideTimer: NodeJS.Timer;

  constructor(private elemRef: ElementRef, private renderer: Renderer2, public event: Events) {}

  ngOnInit() {
    this.event.subscribe('hideFooterTabOnScroll', (data) => {
      this.renderer.setStyle(document.querySelector('.tabbar'), 'webkitTransition', 'bottom 500ms');
      this.renderer.setStyle(document.querySelector('.tabbar'), 'bottom', '-88px');
      this.hideTimer = setTimeout(() => {
        this.renderer.setStyle(document.querySelector('.tabbar'), 'webkitTransition', 'bottom 700ms');
        this.renderer.setStyle(document.querySelector('.tabbar'), 'bottom', '0px');
      }, 300);
    });
  }

}
