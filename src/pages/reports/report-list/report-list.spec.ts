import { ReportListPage } from './report-list';
import {
    navCtrlMock,
    navParamsMock,
    zoneMock,
    contentServiceMock,
    loadingControllerMock,
    reportServiceMock,
    telemetryGeneratorServiceMock
} from '../../../__tests__/mocks';
import { UserReportPage } from '../user-report/user-report';
import { GroupReportListPage } from '../group-report-list/group-report-list';

describe.only('CourseBatchesPage', () => {
    let reportListPage: ReportListPage;

    beforeAll(() => {

    });

    beforeEach(() => {
        reportListPage = new ReportListPage(
            navCtrlMock as any,
            navParamsMock as any,
            loadingControllerMock as any,
            reportServiceMock as any,
            zoneMock as any,
            contentServiceMock as any,
            telemetryGeneratorServiceMock as any
        );

        jest.resetAllMocks();
    });

    it('can load instance', () => {
        expect(reportListPage).toBeTruthy();
    });

    it('date formate check', () => {
        expect(reportListPage.formatTime(1543918834812)).toMatch(/^[0-9]*:[0-9]{2}$/);
    });


    it('isFromGroups true, check push call', () => {
        reportListPage.isFromGroups = true;
        spyOn(navCtrlMock, 'push');
        reportListPage.goToGroupReportsList({ contentId: 'ID1231231' } as any);
        expect(navCtrlMock.push).toBeCalledWith(GroupReportListPage, {
            report: { contentId: 'ID1231231' } as any
        });
    });

    it('isFromGroups true, check push call', () => {
        reportListPage.isFromUsers = true;
        spyOn(navCtrlMock, 'push');
        reportListPage.goToGroupReportsList({ contentId: 'ID1231231' } as any);
        expect(navCtrlMock.push).toBeCalledWith(UserReportPage, {
            report: { contentId: 'ID1231231' } as any
        });
    });

    it('isFromGroups isFromGroups false, check push not tobe call', () => {
        spyOn(navCtrlMock, 'push');
        reportListPage.goToGroupReportsList({ contentId: 'ID1231231' } as any);
        expect(navCtrlMock.push).not.toBeCalled();
    });

    it('loader should be presented', () => {
        loadingControllerMock.create.mockReturnValue(
            {
                present: () => { },
                dismiss: () => { }
            });
        contentServiceMock.getLocalContents.mockResolvedValue(true);
        spyOn(loadingControllerMock.create(), 'present');
        reportListPage.ionViewDidLoad();
        expect(loadingControllerMock.create().present).toBeCalled();
    });

    it('loader should dismiss', (done) => {
        loadingControllerMock.create.mockReturnValue(
            {
                present: () => { },
                dismiss: () => { }
            });
        contentServiceMock.getLocalContents.mockResolvedValue((Math.random() < 0.5));
        reportServiceMock.getListOfReports.mockResolvedValue((Math.random() < 0.5));
        spyOn(loadingControllerMock.create(), 'dismiss');

        setTimeout(() => {
            zoneMock.run.mock.calls[0][0].call(reportListPage);
            expect(loadingControllerMock.create().dismiss).toBeCalled();
            done();
        }, 0);
        reportListPage.ionViewDidLoad();
    });

});
