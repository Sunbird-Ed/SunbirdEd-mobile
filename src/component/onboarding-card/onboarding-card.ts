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
  isOnBoardCard: boolean = true;

  constructor(
    public navCtrl: NavController,
    private popupCtrl: PopoverController,
    private popCtrl: PopoverController,
    private onboardingService: OnboardingService,
    private events: Events
  ) {
    this.initializeService();

    this.events.subscribe('refresh:onboardingcard', () => {
      this.mSlides.slideTo(0, 500);
      this.onboardingService.currentIndex = 0;
      this.onboardingService.initializeCard();
    });
  }

  initializeService() {
    if (!this.onboardingService.categories.length) {
      this.onboardingService.initializeCard();
    }
    /* if (this.onboardingService.isOnBoardingCardCompleted) {
      this.onboardingService.events.publish('onboarding-card:completed', { isOnBoardingCardCompleted: true });
    } */
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

    for (let i = index; i < 4; i++) {
      this.onboardingService.onBoardingSlides[i].selectedCode = [];
      this.onboardingService.onBoardingSlides[i].selectedOptions = '';
    }

    if (index === 0) {
      this.onboardingService.profile.grade = [];
      this.onboardingService.profile.subject = [];
      this.onboardingService.profile.medium = [];
    } else if (index === 1) {
      this.onboardingService.profile.subject = [];
      this.onboardingService.profile.medium = [];
    } else if (index === 2) {
      this.onboardingService.profile.medium = [];
    }

    selectedSlide.options.forEach(options => {
      if (options.checked) {
        this.onboardingService.onBoardingSlides[index].selectedCode.push(options.value);
      }
    });

    /* if(index === 0) {
      let boardDisplayValues = [];
      this.onboardingService.onBoardingSlides[index].options.forEach(element => {
        if(_.includes(this.onboardingService.onBoardingSlides[index].selectedCode, element.value)) {
          boardDisplayValues.push(element.text);
        }
      });
      this.onboardingService.onBoardingSlides[index].selectedOptions = boardDisplayValues;
    } else if(index === 1) {
      let gradeDisplayValues = [];
      this.onboardingService.onBoardingSlides[index].options.forEach(element => {
        if(_.includes(this.onboardingService.onBoardingSlides[index].selectedCode, element.value)) {
          gradeDisplayValues.push(element.text);
        }
      });
      this.onboardingService.onBoardingSlides[index].selectedOptions = gradeDisplayValues;
    } else {
      this.onboardingService.onBoardingSlides[index].selectedOptions = this.onboardingService.onBoardingSlides[index].selectedCode.join(", ");
    } */

    let displayValues = [];
    this.onboardingService.onBoardingSlides[index].options.forEach(element => {
      if(_.includes(this.onboardingService.onBoardingSlides[index].selectedCode, element.value)) {
        displayValues.push(element.text);
      }
    });
    this.onboardingService.onBoardingSlides[index].selectedOptions = this.onboardingService.arrayToString(displayValues);

    // If user Selected Something from the list then only move the slide to next slide
    if (this.onboardingService.onBoardingSlides[index].selectedOptions != '') {
      this.mSlides.lockSwipes(false);
      this.mSlides.slideNext(500);
    }
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

    if (index === 0) this.onboardingService.checkPrevValue(index, this.onboardingService.getListName(index));
    if (index === 1) this.onboardingService.checkPrevValue(index, this.onboardingService.getListName(index), this.onboardingService.profile.board);
    if (index === 2) this.onboardingService.checkPrevValue(index, this.onboardingService.getListName(index), this.onboardingService.profile.grade);
    if (index === 3) this.onboardingService.checkPrevValue(index, this.onboardingService.getListName(index), this.onboardingService.profile.subject);

    let popUp = this.popupCtrl.create(OnboardingAlert, { facet: selectedSlide, callback: callback, index: index }, {
      cssClass: 'onboarding-alert'
    });
    popUp.present();
  }
}
