import { ReportsPage } from './reports';
import { zoneMock,
    loadingControllerMock,
    navParamsMock,
    telemetryGeneratorServiceMock,
    profileServiceMock,
    navCtrlMock,
    groupServiceMock,
    reportServiceMock
} from '../../__tests__/mocks';
import { doesNotThrow } from 'assert';
import { ReportListPage } from './report-list/report-list';

describe('ReportsPage test cases!', () => {
    let reports: ReportsPage;
    const profileData: any = {
        id: '8123891738'
    };

    beforeEach(() => {
        navParamsMock.get.mockReturnValue(profileData);

        reports = new ReportsPage(
            navCtrlMock as any,
            profileServiceMock as any,
            groupServiceMock as any,
            zoneMock as any,
            loadingControllerMock as any,
            navParamsMock as any,
            telemetryGeneratorServiceMock as any
        );

        jest.resetAllMocks();
    });

    it('#ionViewDidLoad should call populateGroups() and dismiss()', (done) => {
        const loader = {
            present: jest.fn(),
            dismiss: jest.fn()
        };
        spyOn(reports, 'populateGroups').and.returnValue(Promise.resolve({}));
        spyOn(reports, 'populateUsers').and.returnValue(Promise.resolve([]));
        loadingControllerMock.create.mockReturnValue(loader);
        reports.ionViewDidLoad();
        expect(reports.populateUsers).toHaveBeenCalled();
        setTimeout(() => {
            expect(reports.populateGroups).toBeCalled();
            zoneMock.run.mock.calls[0][0].call();
            expect(loader.dismiss).toBeCalled();
            done();
        }, 0);
    });

    it('#ionViewDidLoad should go to catch and call dismiss()', (done) => {
        const loader = {
            present: jest.fn(),
            dismiss: jest.fn()
        };
        spyOn(reports, 'populateUsers').and.returnValue(Promise.reject([]));
        loadingControllerMock.create.mockReturnValue(loader);
        reports.ionViewDidLoad();
        setTimeout(() => {
            expect(loader.dismiss).toBeCalled();
            done();
        }, 0);
    });

    it('#populateGroups should call getAllGroup() and resolve with result', (done) => {
        const data = {};
        groupServiceMock.getAllGroup.mockResolvedValue(data);
        reports.populateGroups().then(() => {
            expect(groupServiceMock.getAllGroup).toBeCalled();
            done();
        });
    });

    it('#populateGroups should call getAllGroup() and group.result should be defined', (done) => {
        const data = {
            result: 'test'
        };
        groupServiceMock.getAllGroup.mockResolvedValue(data);
        reports.populateGroups().then(() => {
            expect(groupServiceMock.getAllGroup).toBeCalled();
            expect(data.result).toBeDefined();
            done();
        });
    });

    it('#populateUsers should call getAllUserProfile()  and getCurrentUser()', (done) => {
        profileServiceMock.getAllUserProfile.mockResolvedValue(true);
        profileServiceMock.getCurrentUser.mockResolvedValue(JSON.stringify({
            uid: '8123891738'
        }));
        spyOn(reports, 'filterOutCurrentUser').and.stub();
        reports.populateUsers().then(() => {
            expect(profileServiceMock.getAllUserProfile).toBeCalled();
            expect(reports.filterOutCurrentUser).toBeCalled();
            done();
        });
    });

    it('#populateUsers should call catch() of getAllUserProfile', (done) => {
        profileServiceMock.getAllUserProfile.mockRejectedValue(false);
        reports.populateUsers().catch(() => {
            expect(profileServiceMock.getCurrentUser).not.toBeCalled();
            done();
        });
    });

    it('#populateUsers should call catch() of getCurrentUser', (done) => {
        profileServiceMock.getAllUserProfile.mockResolvedValue(true);
        profileServiceMock.getCurrentUser.mockRejectedValue(true);
        spyOn(reports, 'filterOutCurrentUser').and.stub();
        reports.populateUsers().catch(() => {
            expect(reports.filterOutCurrentUser).not.toBeCalled();
            done();
        });
    });

    it('#goToUserReportList should call push()', () => {
        reports.goToUserReportList('uid', 'handle');
        expect(navCtrlMock.push).toBeCalledWith(ReportListPage, {
            isFromUsers: true,
            uids: ['uid'],
            handle: 'handle'
        });
    });

    it('#goToGroupUserReportList should call getAllUserProfile() and push() ', (done) => {
        const data = JSON.stringify([ 1, 2, 3, 4, 5]);
        profileServiceMock.getAllUserProfile.mockResolvedValue(data);
        reports.goToGroupUserReportList({});
        expect(profileServiceMock.getAllUserProfile).toHaveBeenCalled();
        setTimeout(() => {
            expect(navCtrlMock.push).toHaveBeenCalled();
            done();
        }, 100);
    });

    it('#onSegmentChange should call telemetryGeneratorServiceMock methods', () => {
        reports.onSegmentChange({});
        expect(telemetryGeneratorServiceMock.generateInteractTelemetry).toHaveBeenCalled();
        expect(telemetryGeneratorServiceMock.generateImpressionTelemetry).toHaveBeenCalled();
    });

    it('#filterOutCurrentUser should return a function', () => {
        const returnValue = reports.filterOutCurrentUser([ 'Sam', 'Daisy'], { uid: '8123891738'});
        expect(returnValue).toBeDefined();
    });
});
