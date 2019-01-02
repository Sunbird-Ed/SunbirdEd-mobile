import { ViewCreditsComponent } from './view-credits';
import {
  navParamsMock,
  platformMock,
  appGlobalServiceMock,
  zoneMock,
  telemetryGeneratorServiceMock,
  viewControllerMock
} from '@app/__tests__/mocks';
import 'jest';
import { Environment, InteractType, PageId } from 'sunbird';
describe('ViewCreditsComponent', () => {
  let viewCreditsComponent: ViewCreditsComponent;
  beforeEach(() => {
    navParamsMock.get.mockImplementation((param: string) => {
      if (param === 'filter') {
        return [];
      } else {
        return 'pageId';
      }
    });

    appGlobalServiceMock.getSessionData.mockReturnValue('1278273');
    viewCreditsComponent = new ViewCreditsComponent(navParamsMock as any, viewControllerMock as any,
      platformMock as any, zoneMock as any, telemetryGeneratorServiceMock as any, appGlobalServiceMock as any);
    jest.resetAllMocks();
  });
  it('should create instance of the ConfirmAlertComponent', () => {
    expect(viewCreditsComponent).toBeTruthy();
  });
  it('#ionViewDidLoad should be called', () => {
    // arrange
    navParamsMock.get.mockImplementation((arg: string) => {
      switch (arg) {
        case 'content': {
          return {
            identifier: 'SOME_IDENTIFIER'
          };
        }
        case 'pageId': {
          return { pageId: 'SOME_PAGE_ID' };
        }
        case 'rollUp': {
          return { rollUp: 'SOME_ROLL_UP' };
        }
        case 'correlation': {
          return { correlation: 'SOME_CORRELATION' };
        }

      }
    });
    // act
    viewCreditsComponent.ionViewDidLoad();
    // assert
    expect(telemetryGeneratorServiceMock.generateInteractTelemetry).toHaveBeenCalledWith(InteractType.TOUCH,
      'credits-clicked',
      Environment.HOME,
      { 'pageId': 'SOME_PAGE_ID' },
      expect.objectContaining({
        'id': 'SOME_IDENTIFIER',
        'type': undefined,
        'version': undefined,
      }),
      undefined,
      { 'rollUp': 'SOME_ROLL_UP' },
      { 'correlation': 'SOME_CORRELATION' });
  });
  it('#getUserId should return empty string if  user is not logged in', () => {
    // arrange
    appGlobalServiceMock.getSessionData.mockResolvedValue('SOME_VALUE');
    // act
    viewCreditsComponent.getUserId();
    // assert
    expect(viewCreditsComponent.userId = 'SOME_VALUE');

  });
  it('#getUserId should return User_token string if  user is logged in', () => {
    // arrange
    appGlobalServiceMock.getSessionData.mockResolvedValue('');
    // act
    viewCreditsComponent.getUserId();
    // assert
    expect(viewCreditsComponent.userId = '');
  });
  it('should dismiss the popup on cancel()', () => {
    // arrange
    viewControllerMock.dismiss();
    // act
    viewCreditsComponent.cancel();
    // assert
    expect(viewCreditsComponent.cancel).toBeTruthy();
  });
  it('#should call backbuttonFunc to dismiss the popup', () => {
    // // arrange
    appGlobalServiceMock.getSessionData.mockReturnValue('');
    platformMock.registerBackButtonAction.mockReturnValue(jest.fn());
    viewCreditsComponent = new ViewCreditsComponent(navParamsMock as any, viewControllerMock as any,
      platformMock as any, zoneMock as any, telemetryGeneratorServiceMock as any, appGlobalServiceMock as any);

    // // act
    platformMock.registerBackButtonAction.mock.calls[0][0].call(viewCreditsComponent);

    // // assert
     expect(viewControllerMock.dismiss).toHaveBeenCalled();
     expect(viewCreditsComponent.backButtonFunc).toHaveBeenCalled();
  });

  describe('mergeProperties()', () => {
    it('shoud return firstProp if secondProp empty', () => {
      // arrange
      viewCreditsComponent.content = {
        'SAMPLE_PROP_1': 'SAMPLE_VALUE_1',
        'SAMPLE_PROP_2': 'SAMPLE_VALUE_2'
      };

      // act
      const val = viewCreditsComponent.mergeProperties('SAMPLE_PROP_1', 'INVALID_PROP');

      // assert
      expect(val).toEqual('SAMPLE_VALUE_1');
    });
    it('shoud return secondProp if firstProp empty', () => {
      // arrange
      viewCreditsComponent.content = {
        'SAMPLE_PROP_1': 'SAMPLE_VALUE_1',
        'SAMPLE_PROP_2': 'SAMPLE_VALUE_2'
      };

      // act
      const val = viewCreditsComponent.mergeProperties('INVALID_PROP', 'SAMPLE_PROP_2');

      // assert
      expect(val).toEqual('SAMPLE_VALUE_2');
    });

    it('shoud return mergedArray if firstProp and secondProp is not empty', () => {
      // arrange
      viewCreditsComponent.content = {
        'SAMPLE_PROP_1': 'SAMPLE_VALUE_1_1, SAMPLE_VALUE_1_2, SAMPLE_VALUE_1_2',
        'SAMPLE_PROP_2': 'SAMPLE_VALUE_2_1, SAMPLE_VALUE_2_2'
      };

      // act
      const val = viewCreditsComponent.mergeProperties('SAMPLE_PROP_1', 'SAMPLE_PROP_2');

      // assert
      expect(val).toEqual('SAMPLE_VALUE_2_1, SAMPLE_VALUE_2_2, SAMPLE_VALUE_1_1, SAMPLE_VALUE_1_2');
    });
  });
});
