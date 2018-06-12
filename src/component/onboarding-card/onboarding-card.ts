import { NavController, Slides, PopoverController, Events, Platform, ToastController } from 'ionic-angular';
import { Component, ViewChild, NgZone } from '@angular/core';
import * as _ from 'lodash';
import { OnboardingService } from '../onboarding-card/onboarding.service';
import { OnboardingAlert, onBoardingSlidesCallback } from './../onboarding-alert/onboarding-alert';
import { TranslateService } from '@ngx-translate/core';

/* Interface for the Toast Object */
export interface toastOptions {
  message: string,
  duration: number,
  position: string
};

@Component({
  selector: 'onboarding-card',
  templateUrl: 'onboarding-card.html'
})
export class OnboardingCardComponent {

  public static readonly USER_INFO_UPDATED = 'user-profile-changed';


  @ViewChild(Slides) mSlides: Slides;
  isOnBoardCard: boolean = true;
  loader: boolean = false;
  isSyllabusDataAvailable = false;

  options: toastOptions = {
    message: '',
    duration: 3000,
    position: 'bottom'
  };

  constructor(
    public navCtrl: NavController,
    private popupCtrl: PopoverController,
    private onboardingService: OnboardingService,
    private events: Events,
    private zone: NgZone,
    private toastCtrl: ToastController,
    private translate: TranslateService
  ) {

    this.showLoader(true);

    this.onboardingService.getSyllabusDetails()
      .then((result) => {
        this.showLoader(false)

        if (result && result !== undefined) {
          this.isSyllabusDataAvailable = true;
        } else {
          this.isSyllabusDataAvailable = false;
          this.getToast(this.translateMessage('NO_DATA_FOUND')).present();
        }
      });

    this.initializeService();

    this.events.subscribe(OnboardingCardComponent.USER_INFO_UPDATED, () => {
      this.reinitializeCards();
    });

    this.events.subscribe('refresh:onboardingcard', () => {
      this.reinitializeCards();
    });
  }

  reinitializeCards() {
    this.onboardingService.initializeCard()
      .then(index => {
        console.log("reinitializeCards -  index = " + index);

        setTimeout(() => {
          if (index !== 0 && index !== 5) {
            this.mSlides.slideTo(index, 500);
          }
        }, 500);
      })
      .catch(error => {

      });
  }


  /**
   * Used to Translate message to current Language
   * @param {string} messageConst - Message Constant to be translated
   * @returns {string} translatedMsg - Translated Message
   */
  translateMessage(messageConst: string): string {
    let translatedMsg = '';
    this.translate.get(messageConst).subscribe(
      (value: any) => {
        translatedMsg = value;
      }
    );
    return translatedMsg;
  }


  /**
   * To start and stop loader
   */
  showLoader(flag: boolean) {
    this.loader = flag;
  }

  initializeService() {
    if (!this.onboardingService.categories.length) {
      this.onboardingService.initializeCard()
        .then(index => {
          console.log("initializeService -  index = " + index);
          setTimeout(() => {
            if (index !== 0 && index !== 5) this.mSlides.slideTo(index, 500);
          }, 500);
        })
        .catch(error => {

        });
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

    for (let i = index; i < 5; i++) {
      this.onboardingService.onBoardingSlides[i].selectedCode = [];
      this.onboardingService.onBoardingSlides[i].selectedOptions = '';
    }

    if (index === 0) {
      this.onboardingService.profile.board = [];
      this.onboardingService.profile.grade = [];
      this.onboardingService.profile.subject = [];
      this.onboardingService.profile.medium = [];
    } else if (index === 1) {
      this.onboardingService.profile.grade = [];
      this.onboardingService.profile.subject = [];
      this.onboardingService.profile.medium = [];
    } else if (index === 2) {
      this.onboardingService.profile.grade = [];
      this.onboardingService.profile.subject = [];
    } else if (index === 3) {
      this.onboardingService.profile.subject = [];
    }

    selectedSlide.options.forEach(options => {
      if (options.checked) {
        this.onboardingService.onBoardingSlides[index].selectedCode.push(options.value);
      }
    });

    let displayValues = [];
    this.onboardingService.onBoardingSlides[index].options.forEach(element => {
      if (_.includes(this.onboardingService.onBoardingSlides[index].selectedCode, element.value)) {
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
    if (index === 1) this.onboardingService.checkPrevValue(index, this.onboardingService.getListName(index), this.onboardingService.profile.syllabus);
    if (index === 2) this.onboardingService.checkPrevValue(index, this.onboardingService.getListName(index), this.onboardingService.profile.board);
    if (index === 3) this.onboardingService.checkPrevValue(index, this.onboardingService.getListName(index), this.onboardingService.profile.medium);
    if (index === 4) this.onboardingService.checkPrevValue(index, this.onboardingService.getListName(index), this.onboardingService.profile.grade);

    let popUp = this.popupCtrl.create(OnboardingAlert, { facet: selectedSlide, callback: callback, index: index }, {
      cssClass: 'onboarding-alert'
    });
    popUp.present();
  }

  ionViewWillEnter() {
    if (!this.onboardingService.currentIndex) {
      this.mSlides.slideTo(0, 500);
    }
  }

  /** It will returns Toast Object
   * @param {message} string - Message for the Toast to show
   * @returns {object} - toast Object
   */
  getToast(message: string = ''): any {
    this.options.message = message;
    if (message.length) return this.toastCtrl.create(this.options);
  }


}
