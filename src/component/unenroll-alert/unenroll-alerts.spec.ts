import {UnenrollAlertComponent} from '@app/component/unenroll-alert/unenroll-alert';
import {platformMock, viewControllerMock} from '@app/__tests__/mocks';

describe('', () => {

  let unenrollAlert: any;

  beforeEach(() => {
    platformMock.registerBackButtonAction.mockReturnValue(jest.fn());
    unenrollAlert = new UnenrollAlertComponent(
      viewControllerMock as any,
      platformMock as any
    );
    platformMock.registerBackButtonAction.mock.calls[0][0]();
    jest.resetAllMocks();
  });

  it('#selectOption should call dismiss()', () => {
    unenrollAlert.selectOption(false);
    expect(viewControllerMock.dismiss).toBeCalled();
  });
});
