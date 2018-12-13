import {ConfirmAlertComponent} from './confirm-alert';
import {platformMock, viewControllerMock} from '@app/__tests__/mocks';

describe('Confirm-alert.confirmAlertComponentonent', () => {
  let confirmAlertComponent: ConfirmAlertComponent;

  beforeEach(() => {
    confirmAlertComponent = new ConfirmAlertComponent(
      viewControllerMock as any,
      platformMock as any
    );

    jest.resetAllMocks();
  });

  it('should create instance of the ConfirmAlertComponent', () => {
    expect(confirmAlertComponent).toBeTruthy();
  });

  it('should dismiss view on backButton', () => {
    // arrange
    platformMock.registerBackButtonAction.mockReturnValue(jest.fn());

    confirmAlertComponent = new ConfirmAlertComponent(
      viewControllerMock as any,
      platformMock as any
    );

    // act
    platformMock.registerBackButtonAction.mock.calls[0][0].call(confirmAlertComponent);

    // assert
    expect(viewControllerMock.dismiss).toHaveBeenCalled();
    expect(confirmAlertComponent.backButtonFunc).toHaveBeenCalled();
  });

  it('should dismiss this popup and it should pass argument as false by default', () => {
    expect(confirmAlertComponent.selectOption).toBeDefined();

    // act
    confirmAlertComponent.selectOption();

    // assert
    expect(viewControllerMock.dismiss).toHaveBeenCalled();
    expect(viewControllerMock.dismiss).toHaveBeenCalledWith(false);
  });
});
