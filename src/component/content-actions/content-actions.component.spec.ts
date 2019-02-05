import {ContentActionsComponent} from '@app/component';
import {
  alertControllerMock,
  authServiceMock,
  commonUtilServiceMock,
  contentServiceMock,
  eventsMock,
  navParamsMock,
  platformMock,
  popoverCtrlMock,
  telemetryGeneratorServiceMock,
  toastControllerMock,
  translateServiceMock,
  viewControllerMock
} from '@app/__tests__/mocks';

import { mockRes } from '@app/pages/enrolled-course-details/enrolled-course-details.spec.data';
import {Observable} from 'rxjs';

describe('ContentActionPage Component', () => {
  let contentActions: ContentActionsComponent;

  beforeEach(() => {
    contentActions = new ContentActionsComponent(
      viewControllerMock as any,
      contentServiceMock as any,
      navParamsMock as any,
      toastControllerMock as any,
      popoverCtrlMock as any,
      authServiceMock as any,
      alertControllerMock as any,
      eventsMock as any,
      translateServiceMock as any,
      platformMock as any,
      commonUtilServiceMock as any,
      telemetryGeneratorServiceMock as any
    );

    jest.resetAllMocks();
  });

  it('instance exist', () => {
    expect(contentActions).toBeTruthy();
  });

  it('#getUserId should return empty string if user is not logged in', () => {
    expect(contentActions.getUserId).toBeDefined();
    contentActions.getUserId();
    authServiceMock.getSessionData.mock.calls[0][0].call(contentActions, 'null');
    expect(contentActions.userId).toEqual('');
  });

  it('#getUserId should set userId to empty string', (done) => {
    const data = JSON.stringify({});
    contentActions.pageName = 'course';
    contentActions.content = {};
    contentActions.getUserId();
    authServiceMock.getSessionData.mock.calls[0][0].call(contentActions, data);
    setTimeout(() => {
      expect(contentActions.userId).toEqual('');
      expect(contentActions.showFlagMenu).toBe(true);
      done();
    }, 0);
  });

  it('#getDeleteRequestBody should return apiParams object', () => {
    contentActions.contentId = 'sample_content_id';
    contentActions.isChild = true;
    const apiParams = {
      contentDeleteList: [{
        contentId: 'sample_content_id',
        isChildContent: true
      }]
    };
    const response = contentActions.getDeleteRequestBody();
    expect(response).toEqual(apiParams);
  });

  it('#close should call present()', () => {
    const confirm = {
      dismiss: jest.fn(),
      present: jest.fn()
    };
    alertControllerMock.create.mockReturnValue(confirm);
    contentActions.close(0);
    expect(confirm.present).toHaveBeenCalled();
  });

  it('#close should call dismiss() and reportIssue()', () => {
    const confirm = {
      dismiss: jest.fn(),
      present: jest.fn()
    };
    spyOn(contentActions, 'reportIssue');
    alertControllerMock.create.mockReturnValue(confirm);
    contentActions.close(1);
    expect(contentActions.reportIssue).toHaveBeenCalled();
    expect(viewControllerMock.dismiss).toHaveBeenCalled();
  });

  it('#deleteContent should call getMessageByConstant() with CONTENT_DELETE_FAILED', (done) => {
    const data = {
      result: {
        status: 'NOT_FOUND'
      }
    };
    contentActions.content = mockRes.enrollCourseEvent;
    contentServiceMock.deleteContent.mockResolvedValue(JSON.stringify(data));
    spyOn(contentActions, 'getMessageByConstant');
    spyOn(contentActions, 'showToaster');
    contentActions.deleteContent();
    setTimeout(() => {
      expect(contentServiceMock.deleteContent).toHaveBeenCalled();
      expect(contentActions.getMessageByConstant).toHaveBeenCalledWith('CONTENT_DELETE_FAILED');
      expect(contentActions.showToaster).toHaveBeenCalled();
      done();
    }, 200);
  });

  it('#deleteContent should call getMessageByConstant() with MSG_RESOURCE_DELETED', (done) => {
    contentActions.content = mockRes.enrollCourseEvent;
    contentServiceMock.deleteContent.mockResolvedValue(true);
    spyOn(contentActions, 'getMessageByConstant');
    spyOn(contentActions, 'showToaster');
    contentActions.deleteContent();
    setTimeout(() => {
      expect(contentServiceMock.deleteContent).toHaveBeenCalled();
      expect(contentActions.getMessageByConstant).toHaveBeenCalledWith('MSG_RESOURCE_DELETED');
      expect(contentActions.showToaster).toHaveBeenCalled();
      expect(viewControllerMock.dismiss).toHaveBeenCalled();
      expect(eventsMock.publish).toBeCalled();
      done();
    }, 200);
  });

  it('#deleteContent should go to catch block', (done) => {
    contentActions.content = mockRes.enrollCourseEvent;
    contentServiceMock.deleteContent.mockRejectedValue(true);
    spyOn(contentActions, 'getMessageByConstant');
    spyOn(contentActions, 'showToaster');
    contentActions.deleteContent();
    setTimeout(() => {
      expect(contentServiceMock.deleteContent).toHaveBeenCalled();
      expect(contentActions.getMessageByConstant).toHaveBeenCalledWith('CONTENT_DELETE_FAILED');
      expect(contentActions.showToaster).toHaveBeenCalled();
      expect(viewControllerMock.dismiss).toHaveBeenCalled();
      done();
    }, 200);
  });

  it('#reportIssue should show popover to report issue', () => {
    const popUp = {
      dismiss: jest.fn(),
      present: jest.fn()
    };
    popoverCtrlMock.create.mockReturnValue(popUp);
    contentActions.reportIssue();
    expect(popUp.present).toBeCalled();
  });

  it('#showToaster should return toast object', () => {
    const toast = {
      dismiss: jest.fn(),
      present: jest.fn()
    };
    toastControllerMock.create.mockReturnValue(toast);
    contentActions.showToaster('SAMPLE_STRING');
    expect(toastControllerMock.create).toHaveBeenCalled();
  });

  it('#getMessageByConstant should return string', () => {
    const spy = spyOn(translateServiceMock, 'get').and.callFake((arg) => {
      return Observable.of('Cancel');
    });
    contentActions.getMessageByConstant('SAMPLE_STRING');
    expect(translateServiceMock.get).toHaveBeenCalled();
    expect(contentActions.getMessageByConstant('CANCEL')).toEqual('Cancel');
    expect(spy.calls.any()).toEqual(true);
  });

  it('#unenroll should call present', () => {
    const popUp = {
      onDidDismiss: jest.fn(),
      present: jest.fn()
    };
    popoverCtrlMock.create.mockReturnValue(popUp);
    contentActions.unenroll();
    expect(popUp.present).toBeCalled();
  });

  it('#unenroll should call dismiss()', (done) => {
    const popUp = {
      onDidDismiss: jest.fn(),
      present: jest.fn()
    };
    popoverCtrlMock.create.mockReturnValue(popUp);
    contentActions.unenroll();
    popUp.onDidDismiss.mock.calls[0][0](contentActions, true);
    setTimeout(() => {
      expect(viewControllerMock.dismiss).toHaveBeenCalled();
      done();
    }, 0);
  });

});
