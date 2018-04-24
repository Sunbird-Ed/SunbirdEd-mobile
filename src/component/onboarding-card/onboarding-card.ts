import { NavController, Slides, PopoverController, Events } from 'ionic-angular';
import { Component, ViewChild, NgZone } from '@angular/core';
import * as _ from 'lodash';

import { OnboardingService } from '../onboarding-card/onboarding.service';
import {
  AuthService,
  FrameworkService,
  CategoryRequest,
  FrameworkDetailsRequest,
  Impression,
  ImpressionType,
  Environment,
  TelemetryService,
  ProfileService,
  Profile
} from 'sunbird';
import { OnboardingAlert, onBoardingSlidesCallback } from './../onboarding-alert/onboarding-alert';


@Component({
  selector: 'onboarding-card',
  templateUrl: 'onboarding-card.html'
})
export class OnboardingCardComponent {

  @ViewChild(Slides) mSlides: Slides;

  constructor(
    public navCtrl: NavController,
    private popupCtrl: PopoverController,
    private popCtrl: PopoverController,
    private onboardingService: OnboardingService,
    private events: Events
  ) {

    if(!this.onboardingService.categories.length) {
      this.onboardingService.initializeCard();
    }
    if(this.onboardingService.currentIndex) {
      this.events.publish('onboarding-card:increaseProgress', { cardProgress: ((this.onboardingService.currentIndex) / this.onboardingService.onBoardingSlides.length ) * 100 });
    }
    if(this.onboardingService.isOnBoardingCardCompleted) {
      this.onboardingService.events.publish('onboarding-card:completed', { isOnBoardingCardCompleted: true });
    }
  }

  /**
   * This event get triggred when user tries to swipe the slide
   */
  onSlideDrag() {
    let currentIndex = this.mSlides.getActiveIndex();
    this.mSlides.lockSwipeToNext(!(this.onboardingService.onBoardingSlides[currentIndex].selectedOptions.length));
  }

  /**
   * It Filter out the selected value and stores in object
   * @param {object} selectedSlide Object of all Options
   * @param {number} index         Slide index
   */
  selectedCheckboxValue(selectedSlide: any, index: number) {
    this.onboardingService.onBoardingSlides[index].selectedCode = [];
    this.onboardingService.onBoardingSlides[index].selectedOptions = '';
    selectedSlide.options.forEach(options => {
      if (options.checked) {
        this.onboardingService.onBoardingSlides[index].selectedCode.push(options.value);
      }
    });

    this.onboardingService.onBoardingSlides[index].selectedOptions = this.onboardingService.onBoardingSlides[index].selectedCode.join(", ");

    this.mSlides.slideNext();
    this.onboardingService.saveDetails(index);
  }

  /**
   * This gets called when user clicks on the select box it will internally call an popover and receives a callback from that same page.
   * @param {object} selectedSlide object of Options
   * @param {number} index Slide index
   */
  openFilterOptions(selectedSlide: any, index: number) {
    const that = this;
    const callback: onBoardingSlidesCallback = {
      save() {
        that.selectedCheckboxValue(selectedSlide, index);
      }
    }

    this.onboardingService.checkPrevValue(index, this.onboardingService.getListName(index));

    let popUp = this.popupCtrl.create(OnboardingAlert, { facet: selectedSlide, callback: callback, index: index }, {
      cssClass: 'onboarding-alert'
    });
    popUp.present();
  }
}

