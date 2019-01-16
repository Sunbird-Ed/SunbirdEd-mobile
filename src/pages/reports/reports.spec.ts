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

    beforeEach(() => {
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

    it('', () => {
        const loader = {
            present: jest.fn(),
            dismiss: jest.fn()
        };
        spyOn(reports, 'populateUsers').and.returnValue(new Promise(resolved => {
            return resolved;
        }));
        spyOn(reports, 'populateGroups');
        loadingControllerMock.create.mockReturnValue(loader);
        reports.ionViewDidLoad();
        expect(reports.populateUsers).toHaveBeenCalled();
        expect(reports.populateGroups).toBeCalled();
    });

    it('#populateGroups should call getAllGroup() and resolve with result', (done) => {
        const data = {
            resuly: 'test'
        };
        groupServiceMock.getAllGroup.mockResolvedValue(data);
        reports.populateGroups().then(() => {
            expect(groupServiceMock.getAllGroup).toBeCalled();
            done();
        });
    });

    it('#populateUsers should call getAllUserProfile()  and getCurrentUser()', (done) => {
        profileServiceMock.getAllUserProfile.mockResolvedValue(true);
        profileServiceMock.getCurrentUser.mockResolvedValue(true);
        spyOn(reports, 'filterOutCurrentUser').and.stub();
        reports.populateUsers().then(() => {
            expect(profileServiceMock.getAllUserProfile).toBeCalled();
            done();
        });
    });

    // it('#populateUsers should call catch() of getAllUserProfile', (done) => {
    //     profileServiceMock.getAllUserProfile.mockRejectedValue(false);
    //     // profileServiceMock.getCurrentUser.mockResolvedValue(true);
    //     // spyOn(reports, 'filterOutCurrentUser').and.stub();
    //     reports.populateUsers().then(() => {
    //         expect(profileServiceMock.getCurrentUser).not.toBeCalled();
    //         done();
    //     });
    // });

    // it('#populateUsers should call catch() of getAllUserProfile', (done) => {
    //     profileServiceMock.getAllUserProfile.mockRejectedValue(true);
    //     reports.populateUsers().then(() => {
    //         done();
    //     });
    // });

    // it('#populateUsers should call catch() of getCurrentUser', (done) => {
    //     profileServiceMock.getAllUserProfile.mockResolvedValue(true);
    //     profileServiceMock.getCurrentUser.mockRejectedValue(true);
    //     spyOn(reports, 'filterOutCurrentUser').and.stub();
    //     reports.populateUsers().then(() => {
    //         // expect(reports.filterOutCurrentUser).not.toBeCalled();
    //         done();
    //     });
    // });

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
});
