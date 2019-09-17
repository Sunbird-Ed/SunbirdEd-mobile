
import { PlayerPage } from './player';
import { navCtrlMock, navParamsMock, platformMock, ionicAppMock, appGlobalServiceMock, eventsMock, alertControllerMock, commonUtilServiceMock, canvasPlayerServiceMock, screenOrientationMock, statusBarMock } from '../../__tests__/mocks';

describe('Player Page', () => {
    let playerPage: PlayerPage;
    beforeEach(() => {
        playerPage = new PlayerPage(
            navCtrlMock as any,
            navParamsMock as any,
            canvasPlayerServiceMock as any,
            platformMock as any,
            screenOrientationMock as any,
            ionicAppMock as any,
            appGlobalServiceMock as any,
            statusBarMock as any,
            eventsMock as any,
            alertControllerMock as any,
            commonUtilServiceMock as any
        );

        jest.clearAllMocks();
    });

    describe('Constructor', () => {
        it('should generate a instance of the PlayerPage', () => {
            expect(playerPage).toBeTruthy();
        });
    });

    describe('ionViewWillEnter', () => {
        it('should lock the app screen to the landscape mode', () => {
            spyOn(playerPage, 'loadIframe').and.stub();
            screenOrientationMock.ORIENTATIONS as any = { LANDSCAPE: 'landscape' };
            // screenOrientationMock.ORIENTATIONS.mockReturnValue({});
            playerPage.ionViewWillEnter();
            expect(screenOrientationMock.lock).toHaveBeenCalledWith('landscape');
        });

        it('should hide statusBar Once opened player page', () => {
            
        });
    });
});