import { NavController, Slides, PopoverController, Events, Platform, ToastController } from 'ionic-angular';
import { Component, ViewChild, NgZone } from '@angular/core';
import { OnboardingAlert, onBoardingSlidesCallback } from './../onboarding-alert/onboarding-alert';
import { FormAndFrameworkUtilService } from '../../pages/profile/formandframeworkutil.service';
import { CategoryRequest, ProfileService, Profile } from 'sunbird';

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
  loader: boolean = false;
  isOnBoardingCardCompleted: boolean = false;
  currentProgress: number = 0;
  onBoardingSlides: Array<any>;

  options: toastOptions = {
    message: '',
    duration: 3000,
    position: 'bottom'
  };
  profile: any;

  syllabusSlide = {
    'id': 'syllabusList',
    'title': 'SYLLABUS_QUESTION',
    'desc': 'SYLLABUS_OPTION_TEXT',
    'options': [],
    'selectedOptions': '',
    'selectedCode': []
  };
  boardSlide = {
    'id': 'boardList',
    'title': 'BOARD_QUESTION',
    'desc': 'BOARD_OPTION_TEXT',
    'options': [],
    'selectedOptions': '',
    'selectedCode': []
  };
  mediumSlide = {
    'id': 'mediumList',
    'title': 'MEDIUM_QUESTION',
    'desc': 'MEDIUM_OPTION_TEXT',
    'options': [],
    'selectedOptions': '',
    'selectedCode': []
  };
  gradeSlide = {
    'id': 'gradeList',
    'title': 'GRADE_QUESTION',
    'desc': 'GRADE_OPTION_TEXT',
    'options': [],
    'selectedOptions': '',
    'selectedCode': []
  };
  subjectSlide = {
    'id': 'subjectList',
    'title': 'SUBJECT_QUESTION',
    'desc': 'SUBJECT_OPTION_TEXT',
    'options': [],
    'selectedOptions': '',
    'selectedCode': []
  };

  constructor(
    public navCtrl: NavController,
    private popupCtrl: PopoverController,
    private formAndFrameworkUtilService: FormAndFrameworkUtilService,
    private profileService: ProfileService,
    private events: Events,
    private zone: NgZone,
  ) {
    this.onBoardingSlides = [];
  }

  ionViewDidEnter() {
    this.onBoardingSlides = [
      this.syllabusSlide,
      this.boardSlide,
      this.mediumSlide,
      this.gradeSlide,
      this.subjectSlide
    ];
    //show loader by default at first
    this.currentProgress = 0;
    let that = this;
    this.profileService.getCurrentUser((res: any) => {
      that.profile = JSON.parse(res);

      that.isOnBoardingCardCompleted =
        (that.profile.syllabus && that.profile.syllabus.length > 0) &&
        (that.profile.board && that.profile.syllabus.length > 0) &&
        (that.profile.medium && that.profile.syllabus.length > 0) &&
        (that.profile.grade && that.profile.syllabus.length > 0) &&
        (that.profile.subject && that.profile.syllabus.length > 0);

      if (!that.isOnBoardingCardCompleted) {
        that.loader = true;
        that.init()
          .then(result => {

            that.zone.run(() => {
              that.syllabusSlide.options = that.mapSyllabi(result.syllabi);
              that.boardSlide.options = that.mapBoards(result.boards);
              that.mediumSlide.options = that.mapMediums(result.mediums);
              that.gradeSlide.options = that.mapGrades(result.grades);
              that.subjectSlide.options = that.mapSubjects(result.subjects);
              that.onBoardingSlides = [
                that.syllabusSlide,
                that.boardSlide,
                that.mediumSlide,
                that.gradeSlide,
                that.subjectSlide
              ];
              that.loader = false;
              let slideNumber = 0;
              if (that.profile.syllabus && that.profile.syllabus.length > 0) {
                ++slideNumber;
                that.onBoardingSlides[0].selectedCode = that.profile.syllabus;
                that.onBoardingSlides[0].selectedOptions = that.syllabusSlide.options.reduce(
                  (accumulator, currentValue) => {
                    if (currentValue.checked) {
                      return accumulator.concat(currentValue.text);
                    } else {
                      return accumulator;
                    }
                  }, ""
                );
                if (that.profile.board && that.profile.board.length > 0) {
                  ++slideNumber;
                  that.onBoardingSlides[1].selectedCode = that.profile.board;
                  that.onBoardingSlides[1].selectedOptions = that.boardSlide.options.reduce(
                    (accumulator, currentValue) => {
                      if (currentValue.checked) {
                        return accumulator.concat(currentValue.text);
                      } else {
                        return accumulator;
                      }
                    }, ""
                  );
                  if (that.profile.medium && that.profile.medium.length > 0) {
                    ++slideNumber;
                    that.onBoardingSlides[2].selectedCode = that.profile.medium;
                    that.onBoardingSlides[2].selectedOptions = that.mediumSlide.options.reduce(
                      (accumulator, currentValue) => {
                        if (currentValue.checked) {
                          return accumulator.concat(currentValue.text.concat(','));
                        } else {
                          return accumulator;
                        }
                      }, ""
                    );
                    if (that.profile.grade && that.profile.grade.length > 0) {
                      ++slideNumber;
                      that.onBoardingSlides[3].selectedCode = that.profile.grade;
                      that.onBoardingSlides[3].selectedOptions = that.gradeSlide.options.reduce(
                        (accumulator, currentValue) => {
                          if (currentValue.checked) {
                            return accumulator.concat(currentValue.text.concat(','));
                          } else {
                            return accumulator;
                          }
                        }, ""
                      );
                    }
                  }
                }
              }
              if (slideNumber > 0) {
                that.currentProgress = slideNumber * 20;
                setTimeout(() => {
                  that.mSlides.slideTo(slideNumber);
                }, 500);
              }
            });

          })
          .catch(err => {
            that.loader = false;
          })
      }
    }, error => {
      this.loader = false;
    });

  }

  private mapSyllabi(syllabi) {
    let that = this;
    return syllabi.map(element => {
      return {
        'text': element.name,
        'value': element.frameworkId,
        'checked': (that.profile.syllabus
          && that.profile.syllabus.indexOf(element.frameworkId) > -1) ? true : false
      }
    }).sort((a, b) => {
      if (a.text < b.text) {
        return -1;
      } else if (a.text > b.text) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  private mapBoards(boards) {
    let that = this;
    return boards.map(element => {
      return {
        'text': element.name,
        'value': element.code,
        'checked': (that.profile.board
          && that.profile.board.indexOf(element.code) > -1) ? true : false
      }
    }).sort((a, b) => {
      if (a.text < b.text) {
        return -1;
      } else if (a.text > b.text) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  private mapMediums(mediums) {
    let that = this;
    return mediums.map(element => {
      return {
        'text': element.name,
        'value': element.code,
        'checked': (that.profile.medium
          && that.profile.medium.indexOf(element.code) > -1) ? true : false
      }
    }).sort((a, b) => {
      if (a.text < b.text) {
        return -1;
      } else if (a.text > b.text) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  private mapGrades(grades) {
    let that = this;
    return grades.map(element => {
      return {
        'text': element.name,
        'value': element.code,
        'checked': (that.profile.grade
          && that.profile.grade.indexOf(element.code) > -1) ? true : false
      }
    });
  }

  private mapSubjects(subjects) {
    let that = this;
    return subjects.map(element => {
      return {
        'text': element.name,
        'value': element.code,
        'checked': (that.profile.subject
          && that.profile.subject.indexOf(element.code) > -1) ? true : false
      }
    }).sort((a, b) => {
      if (a.text < b.text) {
        return -1;
      } else if (a.text > b.text) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  private async init() {
    let boards = [], mediums = [], grades = [], subjects = [], localSyllabi = [];

    try {
      localSyllabi = await this.getSyllabusList();
      let frameworkId = (this.profile.syllabus && this.profile.syllabus.length > 0)
        ? this.profile.syllabus[0] : undefined;
      if (frameworkId) {
        boards = await this.getBoardList(frameworkId);
        let selectedBoards = (this.profile.board && this.profile.board.length > 0)
          ? this.profile.board : undefined;
        if (selectedBoards) {
          mediums = await this.getMediumList(frameworkId, selectedBoards);
          let selectedMediums = (this.profile.medium && this.profile.medium.length > 0)
            ? this.profile.medium : undefined;
          if (selectedMediums) {
            grades = await this.getGradeList(frameworkId, selectedMediums);
            let selectedGrades = (this.profile.grade && this.profile.grade.length > 0)
              ? this.profile.grade : undefined;
            if (selectedGrades) {
              subjects = await this.getSubjectList(frameworkId, selectedGrades);
            }
          }
        }
      }

      return await {
        syllabi: localSyllabi,
        boards: boards,
        mediums: mediums,
        grades: grades,
        subjects: subjects
      }
    } catch (error) {
      console.log(error);
    }
  }

  private async getSyllabusList() {
    return await this.formAndFrameworkUtilService.getSyllabusList();
  }

  private async getBoardList(frameworkId) {
    let that = this;
    let categoryRequest = new CategoryRequest();
    categoryRequest.frameworkId = frameworkId;
    categoryRequest.currentCategory = "board";
    return await this.formAndFrameworkUtilService.fetchNextCategory(categoryRequest);
  }

  private async getMediumList(frameworkId: string, selectedBoards: Array<any>) {
    let that = this;
    let categoryRequest = new CategoryRequest();
    categoryRequest.frameworkId = frameworkId;
    categoryRequest.currentCategory = "medium";
    categoryRequest.prevCategory = "board";
    categoryRequest.selectedCode = selectedBoards;
    return await this.formAndFrameworkUtilService.fetchNextCategory(categoryRequest);
  }

  private async getGradeList(frameworkId: string, selectedMediums: Array<any>) {
    let that = this;
    let categoryRequest = new CategoryRequest();
    categoryRequest.frameworkId = frameworkId;
    categoryRequest.currentCategory = "gradeLevel";
    categoryRequest.prevCategory = "medium";
    categoryRequest.selectedCode = selectedMediums;
    return await this.formAndFrameworkUtilService.fetchNextCategory(categoryRequest);
  }

  private async getSubjectList(frameworkId: string, selectedGrades: Array<any>) {
    let that = this;
    let categoryRequest = new CategoryRequest();
    categoryRequest.frameworkId = frameworkId;
    categoryRequest.currentCategory = "subject";
    categoryRequest.prevCategory = "gradeLevel";
    categoryRequest.selectedCode = selectedGrades;
    return await this.formAndFrameworkUtilService.fetchNextCategory(categoryRequest);
  }


  /**
   * This event get triggred when user tries to swipe the slide
   */
  onSlideDrag() {
    let currentIndex = this.mSlides.getActiveIndex();
    this.mSlides.lockSwipeToNext(
      this.onBoardingSlides[currentIndex].selectedCode == undefined ||
      this.onBoardingSlides[currentIndex].selectedCode.length == 0
    );
  }

  private saveAndGoToNext(index: number) {
    let that = this;
    that.saveDetails()
      .then(() => {
        switch (index) {
          case 0:
            that.getBoardList(that.profile.syllabus[0])
              .then(result => {
                that.zone.run(() => {
                  that.boardSlide.options = that.mapBoards(result);
                  that.onBoardingSlides[1] = that.boardSlide;
                  that.mSlides.slideNext(500);
                  that.currentProgress = ((index + 1) * 20);
                  that.autoSelectAndProceed(index);
                });
              })
              .catch(error => {

              });
            break;

          case 1:
            that.getMediumList(that.profile.syllabus[0], that.profile.board)
              .then(result => {
                that.zone.run(() => {
                  that.mediumSlide.options = that.mapMediums(result);
                  that.onBoardingSlides[2] = that.mediumSlide;
                  that.mSlides.slideNext(500);
                  that.currentProgress = ((index + 1) * 20);
                  that.autoSelectAndProceed(index);
                });
              })
              .catch(error => {

              });
            break;

          case 2:
            that.getGradeList(that.profile.syllabus[0], that.profile.medium)
              .then(result => {
                that.zone.run(() => {
                  that.gradeSlide.options = that.mapGrades(result);
                  that.onBoardingSlides[3] = that.gradeSlide;
                  that.mSlides.slideNext(500);
                  that.currentProgress = ((index + 1) * 20);
                  that.autoSelectAndProceed(index);
                });
              })
              .catch(error => {

              });
            break;

          case 3:
            that.getSubjectList(that.profile.syllabus[0], that.profile.grade)
              .then(result => {
                that.zone.run(() => {
                  that.subjectSlide.options = that.mapSubjects(result);
                  that.onBoardingSlides[4] = that.subjectSlide;
                  that.mSlides.slideNext(500);
                  that.currentProgress = ((index + 1) * 20);
                  that.autoSelectAndProceed(index);
                });
              })
              .catch(error => {

              });
            break;
          case 4:
            that.isOnBoardingCardCompleted = true;
            break;
        }
      })
      .catch(() => {

      });
  }

  private autoSelectAndProceed(index: number) {
    let nextIndex = index + 1;
    if (nextIndex < this.onBoardingSlides.length - 1
      && this.onBoardingSlides[nextIndex].options.length == 1) {
      this.onBoardingSlides[nextIndex].selectedCode =
        [this.onBoardingSlides[nextIndex].options[0].value];
      this.onBoardingSlides[nextIndex].selectedOptions =
        [this.onBoardingSlides[nextIndex].options[0].text];
      this.saveAndGoToNext(nextIndex);
    }
  }

  /**
   * This gets called when user clicks on the select box it will internally call an popover and receives a callback from that same page.
   * @param {object} selectedSlide object of Options
   * @param {number} index Slide index
   */
  openFilterOptions(selectedSlide: any, index: number) {
    const that = this;
    const callback: onBoardingSlidesCallback = {
      save(updatedSlide) {
        if (updatedSlide.selectedCode &&
          updatedSlide.selectedCode.length > 0) {
          that.onBoardingSlides[index] = updatedSlide;
          that.saveAndGoToNext(index);
        }
      }
    }

    let popUp = this.popupCtrl.create(OnboardingAlert,
      { facet: selectedSlide, callback: callback, index: index }, {
        cssClass: 'onboarding-alert'
      });
    popUp.present();
  }

  private saveDetails(): Promise<any> {
    let that = this;
    let req: Profile = {
      syllabus: that.onBoardingSlides[0].selectedCode,
      board: that.onBoardingSlides[1].selectedCode,
      class: that.onBoardingSlides[3].selectedCode,
      subject: that.onBoardingSlides[4].selectedCode,
      medium: that.onBoardingSlides[2].selectedCode,
      uid: this.profile.uid,
      name: this.profile.name,
      createdAt: this.profile.createdAt,
      profileType: this.profile.profileType
    }

    return new Promise((resolve, reject) => {
      this.profileService.updateProfile(req,
        (res: any) => {
          that.events.publish('refresh:profile');
          that.profileService.getCurrentUser((res: any) => {
            that.profile = JSON.parse(res);
            resolve();
          }, err => {
            reject();
          });
          that.events.publish('refresh:profile');
        },
        (err: any) => {
          console.log("Err", err);
          reject();
        });
    });

  }

}
