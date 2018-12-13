import {navCtrlMock, popoverCtrlMock, telemetryGeneratorServiceMock} from '@app/__tests__/mocks';
import {AssessmentDetailsComponent} from './assessment-details';
import {Environment, InteractSubtype, InteractType, ObjectType, PageId} from 'sunbird';

describe.only('AssessmentDetailsComponent', () => {
  let assessmentDetailsComponent: AssessmentDetailsComponent;

  beforeEach(() => {
    assessmentDetailsComponent = new AssessmentDetailsComponent(
      popoverCtrlMock as any,
      telemetryGeneratorServiceMock as any,
      navCtrlMock as any
    );

    jest.resetAllMocks();
  });

  it('can load instance', () => {
    expect(assessmentDetailsComponent).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should show Assessment-details if received asssessment data', () => {
      // arrange
      assessmentDetailsComponent.assessmentData = {
        showResult: true
      };

      // act
      assessmentDetailsComponent.ngOnInit();

      // assert
      expect(assessmentDetailsComponent.showResult).toBe(true);
    });
  });

  it('should log telemetry on click of row, id should be same as provided ', () => {
    // arrange
    popoverCtrlMock.create.mockReturnValue({present: jest.fn()});
    assessmentDetailsComponent.assessmentData = {
      showResult: true,
      fromUser: true
    };
    const event = {
      row: {
        qid: 'sample_qustion_id'
      }
    };

    // act
    assessmentDetailsComponent.onActivate(event, {}, {});

    // assert
    expect(telemetryGeneratorServiceMock.generateInteractTelemetry).toHaveBeenCalledWith(
      InteractType.TOUCH,
      InteractSubtype.QUESTION_CLICKED,
      Environment.USER,
      PageId.REPORTS_USER_ASSESMENT_DETAILS,
      {id: 'sample_qustion_id', type: ObjectType.QUESTION}
    );
  });

  it('should log telemetry on click of row, id should be empty if not provided', () => {
    // arrange
    popoverCtrlMock.create.mockReturnValue({present: jest.fn()});
    assessmentDetailsComponent.assessmentData = {
      showResult: true,
      fromUser: true
    };
    const event = {
      row: {}
    };

    // act
    assessmentDetailsComponent.onActivate(event, {}, {});

    // assert
    expect(telemetryGeneratorServiceMock.generateInteractTelemetry).toHaveBeenCalledWith(
      InteractType.TOUCH,
      InteractSubtype.QUESTION_CLICKED,
      Environment.USER,
      PageId.REPORTS_USER_ASSESMENT_DETAILS,
      {id: '', type: ObjectType.QUESTION}
    );
  });

  it('should log telemetry on click of row for group, id should be same as provided, if username is given',
    () => {
      // arrange
      popoverCtrlMock.create.mockReturnValue({present: jest.fn()});
      assessmentDetailsComponent.assessmentData = {
        showResult: true,
        fromUser: true
      };
      const event = {
        row: {}
      };

      // act
      assessmentDetailsComponent.onActivate(event, {}, {});
    });

  it('should log telemetry on click of row for group, id should be empty, if username is given', () => {
    // arrange
    popoverCtrlMock.create.mockReturnValue({present: jest.fn()});
    assessmentDetailsComponent.assessmentData = {
      showResult: true,
      fromGroup: true
    };
    const event = {
      row: {
        userName: 'SOME_USERNAME',
        name: 'SOME_NAME',
        uid: 'SOME_UID',
        contentId: 'SOME_CONTENT_ID'
      }
    };

    // act
    assessmentDetailsComponent.onActivate(event, {}, {});

    // assert
    expect(navCtrlMock.push).toHaveBeenCalledWith(
      expect.anything(),
      {'report': {name: 'SOME_NAME', uid: 'SOME_UID', contentId: 'SOME_CONTENT_ID'}}
    );
  });

  it('should log telemetry on click of row for group, uid should be same as provided, if username is not given',
    () => {
      // arrange
      popoverCtrlMock.create.mockReturnValue({present: jest.fn()});
      assessmentDetailsComponent.assessmentData = {
        showResult: true,
        fromGroup: true
      };
      const event = {
        row: {
          qid: 'sample_question_id',
          uid: 'sample_user_id'
        }
      };

      // act
      assessmentDetailsComponent.onActivate(event, {}, {});

      // assert
      expect(telemetryGeneratorServiceMock.generateInteractTelemetry).toHaveBeenCalledWith(
        InteractType.TOUCH,
        InteractSubtype.QUESTION_CLICKED,
        Environment.USER,
        PageId.REPORTS_GROUP_ASSESMENT_DETAILS,
        {id: 'sample_user_id', type: ObjectType.QUESTION}
      );
    });

  it('should log telemetry on click of row for group, uid should be empty, if username is not given', () => {
    popoverCtrlMock.create.mockReturnValue({present: jest.fn()});
    assessmentDetailsComponent.assessmentData = {
      showResult: true,
      fromGroup: true
    };
    const event = {
      row: {
        qid: 'sample_question_id',
        uid: ''
      }
    };
    spyOn(assessmentDetailsComponent, 'onActivate').and.callThrough();
    assessmentDetailsComponent.onActivate(event, {}, {});
    expect(assessmentDetailsComponent.onActivate).toHaveBeenCalled();
  });

  it('should emit event showQuestionFromUser if, received showpopup and callback', () => {
    popoverCtrlMock.create.mockReturnValue({present: jest.fn()});
    spyOn(assessmentDetailsComponent.showQuestionFromUser, 'emit');

    // act
    assessmentDetailsComponent.onActivate({}, null, null);

    // assert
    expect(assessmentDetailsComponent.showQuestionFromUser.emit).toHaveBeenCalled();
  });
});
