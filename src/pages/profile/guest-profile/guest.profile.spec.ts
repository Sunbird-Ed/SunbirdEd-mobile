import { generateImpressionTelemetry } from './../../../app/telemetryutil';
import { ProfileType } from 'sunbird';
import { appGlobalServiceMock,
     navCtrlMock,
    popoverCtrlMock,
    profileServiceMock,
    eventsMock,
    sharedPreferencesMock,
    commonUtilServiceMock,
    formAndFrameworkUtilServiceMock,
    telemetryGeneratorServiceMock,
    frameworkServiceMock,
    translateServiceMock } from './../../../__tests__/mocks';
import {GuestProfilePage} from './guest-profile';

describe('GuestProfilePage component', () => {
    let guestProfilePage: GuestProfilePage;
    let data;
    beforeEach(() => {
        commonUtilServiceMock.getLoader.mockReturnValue({
            present: () => {},
            dismiss: () => {}
          });
          data = [{ name: 'sampleName', frameworkId: 'sampleSyllabus'}];
        frameworkServiceMock.getSuggestedFrameworkList.mockResolvedValue(data);
        profileServiceMock.getCurrentUser.mockResolvedValue(JSON.stringify({
                        syllabus: ['sampleSyllabus']
                    }));
        sharedPreferencesMock.getString.mockResolvedValue('En');
        appGlobalServiceMock.getCurrentUser.mockReturnValue({ syllabus: 'sample' });
        appGlobalServiceMock.getGuestUserType.mockReturnValue('TEACHER');
        (appGlobalServiceMock as any).DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_TEACHER =  true;
        guestProfilePage = new GuestProfilePage(navCtrlMock as any,
            popoverCtrlMock as any,
            profileServiceMock as any,
            eventsMock as any,
            sharedPreferencesMock as any,
            commonUtilServiceMock as any,
            appGlobalServiceMock as any,
            formAndFrameworkUtilServiceMock as any,
            telemetryGeneratorServiceMock as any,
            frameworkServiceMock as any,
            translateServiceMock as any);

    });

    it('should ctreate a valid instance of PageFilter', () => {
        expect(guestProfilePage).toBeTruthy();
    });

    it('should set showSignInCard to \'true\'', () => {
        expect(guestProfilePage.showSignInCard).toBe(true);
    });

    it('should set showSignInCard to \'true\'', () => {
        appGlobalServiceMock.getGuestUserType.mockReturnValue('STUDENT');
        (appGlobalServiceMock as any).DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_STUDENT =  true;
        expect(guestProfilePage.showSignInCard).toBe(true);
    });

it('ionViewDidLoad makes expected calls', () => {
    guestProfilePage.ionViewDidLoad();
    expect(telemetryGeneratorServiceMock.generateImpressionTelemetry).toHaveBeenCalled();
    expect(appGlobalServiceMock.generateConfigInteractEvent).toHaveBeenCalled();
});





    it('imageUri defaults to: assets/imgs/ic_profile_default.png', () => {
        expect(guestProfilePage.imageUri).toBe('assets/imgs/ic_profile_default.png');
        expect(guestProfilePage.imageUri).not.toBe('');
        expect(typeof guestProfilePage.imageUri).toBe('string');
        expect(typeof guestProfilePage.imageUri).not.toBe('object');
    });

    it('showSignInCard defaults to: false and type should be boolean', () => {
        (appGlobalServiceMock as any).DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_TEACHER =  false;
        const newguestProfilePage = new GuestProfilePage(navCtrlMock as any,
            popoverCtrlMock as any,
            profileServiceMock as any,
            eventsMock as any,
            sharedPreferencesMock as any,
            commonUtilServiceMock as any,
            appGlobalServiceMock as any,
            formAndFrameworkUtilServiceMock as any,
            telemetryGeneratorServiceMock as any,
            frameworkServiceMock as any,
            translateServiceMock as any);
        expect(newguestProfilePage.showSignInCard).toBe(false);
        expect(newguestProfilePage.showSignInCard).not.toBe(true);
        expect(typeof newguestProfilePage.showSignInCard).toBe('boolean');
        expect(typeof newguestProfilePage.showSignInCard).not.toBe('object');
    });

    it('showWarning defaults to: false and type should be boolean', () => {
        expect(guestProfilePage.showWarning).toBe(false);
        expect(guestProfilePage.showWarning).not.toBe(true);
        expect(typeof guestProfilePage.showWarning).toBe('boolean');
        expect(typeof guestProfilePage.showWarning).not.toBe('object');
    });

    it('boards defaults to: ""', () => {
        expect(guestProfilePage.boards).toBe('');
        expect(guestProfilePage.boards.length).toBe(0);
        expect(typeof guestProfilePage.boards).toBe('string');
        expect(typeof guestProfilePage.boards).not.toBe('object');
    });

    it('grade defaults to: ""', () => {
        expect(guestProfilePage.grade).toBe('');
        expect(guestProfilePage.grade.length).toBe(0);
        expect(typeof guestProfilePage.grade).toBe('string');
        expect(typeof guestProfilePage.grade).not.toBe('object');
    });

    it('medium defaults to: ""', () => {
        expect(guestProfilePage.medium).toBe('');
        expect(guestProfilePage.medium.length).toBe(0);
        expect(typeof guestProfilePage.medium).toBe('string');
        expect(typeof guestProfilePage.medium).not.toBe('object');
    });

    it('subjects defaults to: ""', () => {
        expect(guestProfilePage.subjects).toBe('');
        expect(guestProfilePage.subjects.length).toBe(0);
        expect(typeof guestProfilePage.subjects).toBe('string');
        expect(typeof guestProfilePage.subjects).not.toBe('object');
    });

    it('syllabus defaults to: ""', () => {
        expect(guestProfilePage.syllabus).toBe('');
        expect(guestProfilePage.syllabus.length).toBe(0);
        expect(typeof guestProfilePage.syllabus).toBe('string');
        expect(typeof guestProfilePage.syllabus).not.toBe('object');
    });

    it('categories defaults should be: empty array', () => {
        expect(guestProfilePage.categories).toEqual([]);
        expect(typeof guestProfilePage.categories).toEqual('object');
    });

    it('profile defaults should be: empty Object', () => {
        const newguestProfilePage = new GuestProfilePage(navCtrlMock as any,
            popoverCtrlMock as any,
            profileServiceMock as any,
            eventsMock as any,
            sharedPreferencesMock as any,
            commonUtilServiceMock as any,
            appGlobalServiceMock as any,
            formAndFrameworkUtilServiceMock as any,
            telemetryGeneratorServiceMock as any,
            frameworkServiceMock as any,
            translateServiceMock as any);
        expect(newguestProfilePage.profile).toEqual({});
        expect(typeof newguestProfilePage.profile).toEqual('object');
    });

    describe('Constructor', () => {
        it('should call getString to fetch selected_language_code', () => {
                expect(sharedPreferencesMock.getString).toHaveBeenCalled();
            });
        });

    it('refreshProfileData should make expected calls', (done) => {
        spyOn(guestProfilePage, 'getSyllabusDetails');
        guestProfilePage.refreshProfileData(false, true);
        expect(guestProfilePage.profile).toEqual({
            syllabus: ['sampleSyllabus']
        });
        setTimeout(() => {
        expect(guestProfilePage.getSyllabusDetails).toHaveBeenCalled();
        done();

        }, 10);
    });

    it('editGuestProfile should call GuestEditProfile page', () => {
        guestProfilePage.editGuestProfile();
        expect(guestProfilePage.editGuestProfile).toBeDefined();
        expect(navCtrlMock.push).toHaveBeenCalled();
    });

    it('showNetworkWarning should set showWarning to true', (done) => {
        guestProfilePage.showNetworkWarning();
        expect(guestProfilePage.showWarning).toBe(true);
        setTimeout(() => {
            expect(guestProfilePage.showWarning).toBe(false);
            done();
        }, 3500);
    });

    it('should handle success scenario for getSyllabusDetails', (done) => {
        jest.resetAllMocks();
        commonUtilServiceMock.getLoader.mockReturnValue({
            present: () => {},
            dismiss: () => {}
          });
        data = [{ name: 'sampleName', identifier: 'sampleSyllabus'}];
        frameworkServiceMock.getSuggestedFrameworkList.mockResolvedValue(data);
        profileServiceMock.getCurrentUser.mockResolvedValue(JSON.stringify({
                        syllabus: ['sampleSyllabus']
                    }));
        sharedPreferencesMock.getString.mockResolvedValue('En');
        appGlobalServiceMock.getCurrentUser.mockReturnValue({ syllabus: 'sample' });
        appGlobalServiceMock.getGuestUserType.mockReturnValue('TEACHER');
        (appGlobalServiceMock as any).DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_TEACHER =  true;
        const newguestProfilePage = new GuestProfilePage(navCtrlMock as any,
            popoverCtrlMock as any,
            profileServiceMock as any,
            eventsMock as any,
            sharedPreferencesMock as any,
            commonUtilServiceMock as any,
            appGlobalServiceMock as any,
            formAndFrameworkUtilServiceMock as any,
            telemetryGeneratorServiceMock as any,
            frameworkServiceMock as any,
            translateServiceMock as any);

            newguestProfilePage.getSyllabusDetails();
            formAndFrameworkUtilServiceMock.getFrameworkDetails.mockResolvedValue('');
        expect(frameworkServiceMock.getSuggestedFrameworkList).toHaveBeenCalled();
        setTimeout(() => {
            expect(newguestProfilePage.syllabus).toBeDefined();
            expect(formAndFrameworkUtilServiceMock.getFrameworkDetails).toHaveBeenCalledWith('sampleSyllabus');
            done();
        }, 10);
    });

    it('should handle success scenario for getFrameworkDetails', (done) => {
        const newguestProfilePage = new GuestProfilePage(navCtrlMock as any,
            popoverCtrlMock as any,
            profileServiceMock as any,
            eventsMock as any,
            sharedPreferencesMock as any,
            commonUtilServiceMock as any,
            appGlobalServiceMock as any,
            formAndFrameworkUtilServiceMock as any,
            telemetryGeneratorServiceMock as any,
            frameworkServiceMock as any,
            translateServiceMock as any);
        // getLoader();
        const mydata = ['sampleCategory'];
        newguestProfilePage.profile = {
            board: ['sampleBoard'],
            medium: ['sampleMedium'],
            grade: ['sampleGrade'],
            subject: ['sampleSubject']
        };
        // const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
        // spyOn(formAndFrameworkUtilServiceStub, 'getFrameworkDetails').and.returnValue(Promise.resolve(data));
        formAndFrameworkUtilServiceMock.getFrameworkDetails.mockResolvedValue(mydata);
        spyOn(newguestProfilePage, 'getFieldDisplayValues');
        newguestProfilePage.getFrameworkDetails('string');
        setTimeout(() => {
            expect(newguestProfilePage.categories).toEqual(mydata);
            done();
        }, 10);

    });

    it('getFieldDisplayValues should call arrayToString', () => {
        const mydata = ['sampleTerms'];
        guestProfilePage.categories = [{ terms: ['sampleTerms'] }];
        guestProfilePage.getFieldDisplayValues(data, 0);
        expect(commonUtilServiceMock.arrayToString).toHaveBeenCalled();
    });

    // it("arrayToString", () =>)

    it('goToRoles should make expected calls', () => {
        guestProfilePage.goToRoles();
        expect(navCtrlMock.push).toHaveBeenCalled();
    });

    describe('goToRoles', () => {
        it('should call goToRoles page', () => {
            spyOn(guestProfilePage, 'goToRoles');
            guestProfilePage.goToRoles();
            expect(guestProfilePage.goToRoles).toBeDefined();
            expect(guestProfilePage.goToRoles).toHaveBeenCalled();
        });
    });

    it('should call showNetworkWarning method', () => {
        spyOn(guestProfilePage, 'showNetworkWarning');
        guestProfilePage.buttonClick();
        expect(guestProfilePage.buttonClick).toBeDefined();
        expect(guestProfilePage.showNetworkWarning).toHaveBeenCalled();
    });
});
