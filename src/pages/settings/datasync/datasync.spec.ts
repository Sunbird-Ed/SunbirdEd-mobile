import 'jest';
import { DatasyncPage } from './datasync';
import {
    zoneMock, navCtrlMock, navParamsMock,
    telemetryServiceMock, sharedPreferencesMock, translateServiceMock, shareUtilMock,
    socialSharingMock, commonUtilServiceMock
} from '../../../__tests__/mocks';
import { DataSyncType } from './datasynctype.enum';
import { ImpressionType, PageId, Environment, InteractType, InteractSubtype } from 'sunbird';
import { doesNotThrow } from 'assert';
import { settings } from 'cluster';
describe.only('DatasyncPage', () => {
    let datasyncPage: DatasyncPage;
    beforeEach(() => {
        datasyncPage = new DatasyncPage(zoneMock as any, navCtrlMock as any, navParamsMock as any, telemetryServiceMock as any,
            sharedPreferencesMock as any, translateServiceMock as any, shareUtilMock as any, socialSharingMock as any,
            commonUtilServiceMock as any);
        jest.resetAllMocks();
    });
    it('can load instance', () => {
        expect(datasyncPage).toBeTruthy();
    });
    it('init makes expected calls when getString value is off', (done) => {
        // arrange
        spyOn(datasyncPage, 'getLastSyncTime').and.stub();

        sharedPreferencesMock.getString.mockResolvedValue('OFF');
        // act
        datasyncPage.init();
        // assert
        expect(datasyncPage.lastSyncedTimeString = 'LAST_SYNC');
        setTimeout(() => {
            expect(DataSyncType.off).toBe('OFF');
            done();
        }, 0);
    });
    it('init makes expected calls when getString value is over_wifi', (done) => {
        // arrange
        spyOn(datasyncPage, 'getLastSyncTime').and.stub();
        sharedPreferencesMock.getString.mockResolvedValue('OVER_WIFI_ONLY');
        // act
        datasyncPage.init();
        // assert
        setTimeout(() => {
            expect(DataSyncType.over_wifi).toBe('OVER_WIFI_ONLY');
            done();
        }, 0);
    });
    it('init makes expected calls when getString value is ALWAYS_ON', (done) => {
        // arrange
        spyOn(datasyncPage, 'getLastSyncTime').and.stub();
        sharedPreferencesMock.getString.mockResolvedValue('ALWAYS_ON');
        // act
        datasyncPage.init();
        // assert
        setTimeout(() => {
            expect(DataSyncType.always_on).toBe('ALWAYS_ON');
            done();
        }, 0);
    });
    it('should make expectecd calls in ionViewDidLoad', () => {
        // arrange
        spyOn(datasyncPage, 'init').and.stub();
        // act
        datasyncPage.ionViewDidLoad();
        // assert
        expect(telemetryServiceMock.impression).toHaveBeenCalledWith(
            expect.objectContaining({ type: ImpressionType.VIEW, pageId: PageId.SETTINGS_DATASYNC, env: Environment.SETTINGS })
        );
    });
    it('should check for selected DataSync type', () => {
        // arrange
        datasyncPage.dataSyncType = DataSyncType.always_on;
        // act
        datasyncPage.onSelected();
        // assert
        expect(sharedPreferencesMock.putString).toHaveBeenCalledWith('sync_config', 'ALWAYS_ON');
    });
    it('should get lastSyncTime ', (done) => {
        // arrange
        telemetryServiceMock.getTelemetryStat.mockResolvedValue('{ "result": { "lastSyncTime": 5000 } }');
        // act
        datasyncPage.getLastSyncTime();
        // assert
        setTimeout(() => {
            zoneMock.run.mock.calls[0][0].call(datasyncPage);
            expect(datasyncPage.latestSync).toBe('LAST_SYNC 1/1/1970, 5:30 am');
            done();
        }, 0);
    });
    it('should handle shareTelemetry on call', (done) => {
        // arrange
        commonUtilServiceMock.getLoader.mockReturnValue({ present: jest.fn(), dismiss: jest.fn() });
        socialSharingMock.share.mockResolvedValue('share');
        // act
        datasyncPage.shareTelemetry();
        shareUtilMock.exportTelemetry.mock.calls[0][0].call(datasyncPage, 'path');
        // assert
        setTimeout(() => {
            expect(socialSharingMock.share).toHaveBeenCalledWith('', '', 'file://path', '');
            done();
        }, 0);
    });
    it('should handle if shareTelemtry does not get path', () => {
        // arrange
        commonUtilServiceMock.getLoader.mockReturnValue({ present: jest.fn(), dismiss: jest.fn() });
        // act
        datasyncPage.shareTelemetry();
        shareUtilMock.exportTelemetry.mock.calls[0][1].call(datasyncPage, undefined);
        // assert
        expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith('SHARE_TELEMETRY_FAILED');
    });
    it('should sync on Click and show message', (done) => {
        // arrange
        commonUtilServiceMock.getLoader.mockReturnValue({ present: jest.fn(), dismiss: jest.fn() });
        spyOn(datasyncPage, 'generateInteractEvent').and.stub();
        telemetryServiceMock.sync.mockResolvedValue({ result: { syncTime: 5000, syncedFileSize: 1000 } });
        // act
        datasyncPage.onSyncClick();
        // assert
        setTimeout(() => {
            zoneMock.run.mock.calls[0][0].call(datasyncPage);
            expect(datasyncPage.generateInteractEvent).toHaveBeenCalled();
            expect(datasyncPage.latestSync).toBe('LAST_SYNC 1/1/1970, 5:30 am');
            expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith('DATA_SYNC_SUCCESSFUL');
            done();
        }, 0);
    });
    it('should handle catch part on sync click', (done) => {
        // arrange
        commonUtilServiceMock.getLoader.mockReturnValue({ present: jest.fn(), dismiss: jest.fn() });
        spyOn(datasyncPage, 'generateInteractEvent').and.stub();
        telemetryServiceMock.sync.mockRejectedValue('error');
        // act
        datasyncPage.onSyncClick();
        // assert
        setTimeout(() => {
            expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith('DATA_SYNC_FAILURE');
            done();
        });
    });
    it('should return time in 12hr format in string', () => {
        // arrange
        const date = new Date();
        spyOn(datasyncPage, 'getTimeIn12HourFormat');
        // act
        datasyncPage.getTimeIn12HourFormat(date);
        // assert
        expect(datasyncPage.getTimeIn12HourFormat).toHaveBeenCalled();
    });
    it('should generate Interact Event', () => {
        // arrange
        // act
        datasyncPage.generateInteractEvent('interactType', 'InteractSubtype', 'size');
        // assert
        expect(telemetryServiceMock.interact).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'interactType',
                subType: 'InteractSubtype',
                env: Environment.SETTINGS,
                pageId: PageId.SETTINGS_DATASYNC
            })
        );
    });
});


