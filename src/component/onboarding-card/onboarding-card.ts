import {
  NavController,
  Slides,
  PopoverController,
  Events,
  ToastController
} from 'ionic-angular';
import {
  Component,
  ViewChild,
  NgZone
} from '@angular/core';
import { OnboardingService } from '../onboarding-card/onboarding.service';
import {
  OnboardingAlert,
  onBoardingSlidesCallback
} from './../onboarding-alert/onboarding-alert';
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
  isDataAvailable = false;

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

        let syllabusList = (<any[]>result)

        if (syllabusList && syllabusList !== undefined && syllabusList.length > 0) {
          this.isDataAvailable = true;
        } else {
          this.isDataAvailable = false;
          this.getToast(this.translateMessage('NO_DATA_FOUND')).present();
        }
      });

    this.initializeService();


    this.events.subscribe('is-data-available', (value) => {
      let index = value.index;
      let loaderFlag = !value.show;
      this.showLoader(loaderFlag)
      this.isDataAvailable = value.show;
    });

    this.events.subscribe('slide-onboarding-card', (value) => {
      console.log("Index value - " + value.slideIndex);
      this.mSlides.lockSwipes(false);
      this.mSlides.slideNext(500);
    });

    this.events.subscribe(OnboardingCardComponent.USER_INFO_UPDATED, () => {
      this.reinitializeCards();
    });

    this.events.subscribe('refresh:onboardingcard', () => {
      this.reinitializeCards();
    });
  }

  reinitializeCards() {
    //reset slide index to -1
    this.onboardingService.slideIndex = -1;

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

  /**
   * This event get triggred when user tries to swipe the slide
   */
  onSlideDrag() {
    let currentIndex = this.mSlides.getActiveIndex();
    this.mSlides.lockSwipeToNext(!(this.onboardingService.onBoardingSlides[currentIndex].selectedOptions.length));
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
        that.onboardingService.selectedCheckboxValue(selectedSlide, index);
      }
    }

    if (index === 0) this.onboardingService.checkPrevValue(index, this.onboardingService.getListName(index), undefined, true);
    if (index === 1) this.onboardingService.checkPrevValue(index, this.onboardingService.getListName(index), this.onboardingService.profile.syllabus, true);
    if (index === 2) this.onboardingService.checkPrevValue(index, this.onboardingService.getListName(index), this.onboardingService.profile.board, true);
    if (index === 3) this.onboardingService.checkPrevValue(index, this.onboardingService.getListName(index), this.onboardingService.profile.medium, true);
    if (index === 4) this.onboardingService.checkPrevValue(index, this.onboardingService.getListName(index), this.onboardingService.profile.grade, true);

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