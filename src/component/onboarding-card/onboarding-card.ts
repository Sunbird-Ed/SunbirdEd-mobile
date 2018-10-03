import {
  Slides,
  PopoverController,
  Events
} from 'ionic-angular';
import {
  Component,
  ViewChild
} from '@angular/core';
import { OnboardingService } from '../onboarding-card/onboarding.service';
import {
  OnboardingAlert,
  onBoardingSlidesCallback
} from './../onboarding-alert/onboarding-alert';
import { CommonUtilService } from '../../service/common-util.service';

@Component({
  selector: 'onboarding-card',
  templateUrl: 'onboarding-card.html'
})
export class OnboardingCardComponent {

  public static readonly USER_INFO_UPDATED = 'user-profile-changed';

  @ViewChild(Slides) mSlides: Slides;

  isOnBoardCard = true;
  loader = false;
  isDataAvailable = false;

  constructor(
    private popupCtrl: PopoverController,
    private onboardingService: OnboardingService,
    private events: Events,
    private commonUtilService: CommonUtilService
  ) {

    this.showLoader(true);

    this.onboardingService.getSyllabusDetails()
      .then((result) => {
        this.showLoader(false);

        const syllabusList = (<any[]>result);

        if (syllabusList && syllabusList !== undefined && syllabusList.length > 0) {
          this.isDataAvailable = true;
        } else {
          this.isDataAvailable = false;
          this.commonUtilService.showToast(this.commonUtilService.translateMessage('NO_DATA_FOUND'));
        }
      });

    this.initializeService();

    this.events.subscribe('is-data-available', (value) => {
      const loaderFlag = !value.show;
      this.showLoader(loaderFlag);
      this.isDataAvailable = value.show;
    });

    this.events.subscribe('slide-onboarding-card', () => {
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

  ionViewWillEnter() {
    if (!this.onboardingService.currentIndex) {
      this.mSlides.slideTo(0, 500);
    }
  }

  reinitializeCards() {
    // reset slide index to -1
    this.onboardingService.slideIndex = -1;

    this.onboardingService.initializeCard()
      .then(index => {
        setTimeout(() => {
          if (index !== 0 && index !== 5) {
            this.mSlides.slideTo(index, 500);
          }
        }, 500);
      });
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
        setTimeout(() => {
          if (index !== 0 && index !== 5) {
            this.mSlides.slideTo(index, 500);
          }
        }, 500);
      });
  }

  /**
   * This event get triggred when user tries to swipe the slide
   */
  onSlideDrag() {
    const currentIndex = this.mSlides.getActiveIndex();
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
    };
    /* istanbul ignore else */
    if (index === 0) {
      this.onboardingService.checkPrevValue(index, this.onboardingService.getListName(index), undefined, true);
    } else if (index === 1) {
      this.onboardingService.checkPrevValue(
        index, this.onboardingService.getListName(index), this.onboardingService.profile.syllabus, true);
    } else if (index === 2) {
      this.onboardingService.checkPrevValue(index, this.onboardingService.getListName(index), this.onboardingService.profile.board, true);
    } else if (index === 3) {
      this.onboardingService.checkPrevValue(index, this.onboardingService.getListName(index), this.onboardingService.profile.medium, true);
    } else if (index === 4) {
      this.onboardingService.checkPrevValue(index, this.onboardingService.getListName(index), this.onboardingService.profile.grade, true);
    }

    const popUp = this.popupCtrl.create(OnboardingAlert, { facet: selectedSlide, callback: callback, index: index }, {
      cssClass: 'onboarding-alert'
    });
    popUp.present();
  }

}
