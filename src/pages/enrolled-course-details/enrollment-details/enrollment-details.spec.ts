import { EnrollmentDetailsPage } from "./enrollment-details";
import {
    navCtrlMock,
    navParamsMock,
    viewControllerMock,
    eventsMock,
    sharedPreferencesMock,
    authServiceMock,
    zoneMock,
    telemetryGeneratorServiceMock,
    commonUtilServiceMock,
    courseServiceMock
} from "../../../__tests__/mocks";
import { mockRes } from './enrollment-details.spec.data';
import { EnrolledCourseDetailsPage } from "../enrolled-course-details";
import { CollectionDetailsPage } from "../../collection-details/collection-details";
import { ContentDetailsPage } from "../../content-details/content-details";

describe.only('EnrollmentDetailsPage', () => {
    let enrollemtDetailsPage: EnrollmentDetailsPage;

    beforeEach(() => {
        jest.resetAllMocks();
        enrollemtDetailsPage = new EnrollmentDetailsPage(
            navCtrlMock as any,
            navParamsMock as any,
            viewControllerMock as any,
            eventsMock as any,
            sharedPreferencesMock as any,
            authServiceMock as any,
            zoneMock as any,
            telemetryGeneratorServiceMock as any,
            commonUtilServiceMock as any,
            courseServiceMock as any
        );

        jest.resetAllMocks();
    });

    it('#getUserId should call getSessionData() and isGuestUser tobe false', (done) => {
        // arrange
        const session = JSON.stringify('SessionObject');
        // act
        setTimeout(() => {
            zoneMock.run.mock.calls[0][0].call();
            expect(enrollemtDetailsPage.isGuestUser).toBe(false);
            done();
        }, 0);
        enrollemtDetailsPage.getUserId();
        authServiceMock.getSessionData.mock.calls[0][0].call(this, session);
    });

    it('#getUserId should set isGuestUser tobe true', (done) => {
        // arrange
        // act
        setTimeout(() => {
            zoneMock.run.mock.calls[0][0].call();
            expect(enrollemtDetailsPage.isGuestUser).toBe(true);
            done();
        }, 0);
        enrollemtDetailsPage.getUserId();
        authServiceMock.getSessionData.mock.calls[0][0].call();
    });

    it('should navigate to EnrolledCourseDetailsPage', () => {
        const content = mockRes.navigationContent;
        enrollemtDetailsPage.layoutInProgress = enrollemtDetailsPage.layoutName = 'InProgress';
        content.mimeType = mockRes.navigationContent.mimeType;
        spyOn(enrollemtDetailsPage, 'isResource').and.stub();
        spyOn(enrollemtDetailsPage, 'saveContentContext');
        // act
        enrollemtDetailsPage.navigateToDetailPage(content, 'InProgress');

        expect(navCtrlMock.push(EnrolledCourseDetailsPage, expect.objectContaining({
            content: content
        })));
    });

    it('should navigate to CollectionDetailsPage', () => {
        // arrange
        const content = mockRes.navigationContent2;
        enrollemtDetailsPage.layoutInProgress = enrollemtDetailsPage.layoutName = 'InProgress';
        content.mimeType = mockRes.navigationContent2.mimeType;
        spyOn(enrollemtDetailsPage, 'isResource').and.stub();
        // act
        enrollemtDetailsPage.navigateToDetailPage(content, 'InProgress');
        // assert
        expect(navCtrlMock.push(CollectionDetailsPage, expect.objectContaining({
            content: content
        })));
    });

    it('should navigate to ContentDetailsPage', () => {
        // arrange
        const content = mockRes.navigationContent3;
        enrollemtDetailsPage.layoutInProgress = enrollemtDetailsPage.layoutName = 'sample';
        spyOn(enrollemtDetailsPage, 'isResource').and.stub();
        // act
        enrollemtDetailsPage.navigateToDetailPage(content, 'InProgress');
        // assert
        expect(navCtrlMock.push(ContentDetailsPage, expect.objectContaining({
            content: content
        })));
    });

    it('should show error toast message while enrolling to a batch in case of no internet connection', (done) => {
        // arrange
        const option = {};
        (courseServiceMock.enrollCourse as any).mockReturnValue(Promise.reject(JSON.stringify(mockRes.connectionFailureResponse)));
        // act
        enrollemtDetailsPage.enrollIntoBatch(option);
        // assert
        setTimeout(() => {
            (zoneMock.run as jest.Mock).mock.calls[0][0].call(enrollemtDetailsPage, undefined);
            expect(commonUtilServiceMock.translateMessage).toHaveBeenCalledWith('ERROR_NO_INTERNET_MESSAGE');
            done();
        }, 0);
    });

    it('should show error toast message while enrolling to a batch which is already enrolled', (done) => {
        // arrange
        const option = {};
        (courseServiceMock.enrollCourse as any).mockReturnValue(Promise.reject(JSON.stringify(mockRes.alreadyRegisterredFailureResponse)));
        // act
        enrollemtDetailsPage.enrollIntoBatch(option);
        // assert
        setTimeout(() => {
            // (commonUtilServiceMock.showToast as any).and.callThrough();
            (zoneMock.run as jest.Mock).mock.calls[0][0].call(enrollemtDetailsPage, undefined);
            expect(commonUtilServiceMock.translateMessage).toHaveBeenCalledWith('ALREADY_ENROLLED_COURSE');
            done();
        }, 0);
    });

    it('should resume course', () => {
        // arrange
        const content = mockRes.resumeCourse;
        spyOn(enrollemtDetailsPage, 'saveContentContext').and.stub();
        // act
        enrollemtDetailsPage.resumeCourse(content);
        // assert
        expect(eventsMock.publish).toHaveBeenCalledWith('course:resume', expect.objectContaining({ content: content }));
    });

    it('should resume course', () => {
        // arrange
        const content = mockRes.resumeCourseFalsy;
        spyOn(enrollemtDetailsPage, 'saveContentContext').and.stub();
        // act
        enrollemtDetailsPage.resumeCourse(content);
        // assert
        expect(navCtrlMock.push).toHaveBeenCalledWith(EnrolledCourseDetailsPage, expect.objectContaining({
            content: content
        }));
    });

});
