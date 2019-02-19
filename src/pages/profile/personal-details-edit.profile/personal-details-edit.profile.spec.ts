import { PersonalDetailsEditPage } from './personal-details-edit.profile';
import { mockProfileRes } from './personal-details-edit-profile-spec-data';
import { FormGroup, FormControl } from '@angular/forms';
// import { Profile } from 'sunbird';

import {
    navCtrlMock, loadingControllerMock, navParamsMock, commonUtilServiceMock,
    formAndFrameworkUtilServiceMock, formBuilderMock, translateServiceMock,
    appGlobalServiceMock, userProfileServiceMock, eventsMock, containerServiceMock,
    frameworkServiceMock,
    formGroupMock
} from '../../../__tests__/mocks';

describe('PersonalDetailsEditPage', () => {
    let personalDetailsEditPage: PersonalDetailsEditPage;
    beforeEach(() => {
        navParamsMock.get.mockImplementation((arg: string) => {
            if (arg === 'profile') {
                return mockProfileRes.profile;
            }
        });
        commonUtilServiceMock.translateMessage.mockReturnValue('STATE');
        commonUtilServiceMock.translateMessage.mockReturnValue('DISTRICT');
        formBuilderMock.group.mockReturnValue(new FormGroup({
            'name': new FormControl('', []),
            'states': new FormControl('', []),
            'districts': new FormControl('', []),
        }));
        // personalDetailsEditPage.profile = mockProfileRes.profile;
        personalDetailsEditPage = new PersonalDetailsEditPage(
            navCtrlMock as any,
            loadingControllerMock as any,
            navParamsMock as any,
            commonUtilServiceMock as any,
            formAndFrameworkUtilServiceMock as any,
            formBuilderMock as any,
            translateServiceMock as any,
            appGlobalServiceMock as any,
            userProfileServiceMock as any,
            eventsMock as any,
            containerServiceMock as any,
            frameworkServiceMock as any
        );
        personalDetailsEditPage.profile = mockProfileRes.profile;
        jest.resetAllMocks();
        //  personalDetailsEditPage.profile.name = mockProfileRes.profile;
    });

    it('can load instance', () => {
        expect(personalDetailsEditPage).toBeTruthy();
    });
    it('can load ionViewWillEnter', () => {
        // arrange

        spyOn(personalDetailsEditPage, 'getStates').and.stub();
        formBuilderMock.group.mockReturnValue(new FormGroup({
            'name': new FormControl('', [])
        }));
        // act
        personalDetailsEditPage.ionViewWillEnter();

        // assert
        expect(navParamsMock.get).toHaveBeenCalled();

    });

    it('It should Initializes form with default values or empty values', () => {
        // arrange
        spyOn(personalDetailsEditPage, 'enableSubmitButton').and.stub();

        navParamsMock.get.mockImplementation((arg: string) => {
            if (arg === 'profile') {
                return mockProfileRes.profile;
            }

        });
        // act
        personalDetailsEditPage.initializeForm();

        // assert
        expect(personalDetailsEditPage.enableSubmitButton).toHaveBeenCalled();
    });

    it('It should state values', (done) => {
        // arrange
        const loader = { present: jest.fn() };
        loadingControllerMock.create.mockReturnValue(loader);
        const response = {
            result: {
                locationList: '[{"code":"03","name":"Punjab","id":"ec32efed-16bd-4b2a-93dc-7426a25b5779","type":"state"}]'
            }
        };
        userProfileServiceMock.searchLocation.mockResolvedValue(JSON.stringify(response));
        // act
        personalDetailsEditPage.getStates();

        // assert
        setTimeout(() => {
            expect(userProfileServiceMock.searchLocation).toHaveBeenCalled();
            done();
        }, 0);
    });
    it('It should state values for error scenario', (done) => {
        // arrange
        loadingControllerMock.create.mockReturnValue({
            present: () => {
            },
            dismiss: () => {
            }
        });
        const response = {
            result: {
                locationList: '[]',
            }
        };
        userProfileServiceMock.searchLocation.mockResolvedValue(JSON.stringify(response));
        commonUtilServiceMock.translateMessage.mockReturnValue('NO_DATA_FOUND');
        // act
        personalDetailsEditPage.getStates();

        // assert
        setTimeout(() => {

            expect(commonUtilServiceMock.showToast).toBeCalledWith('NO_DATA_FOUND');
            done();
        }, 0);
    });
    it('It should fetch district values', (done) => {
        // arrange
        const loader = { present: jest.fn() };
        loadingControllerMock.create.mockReturnValue(loader);
        const response = {
            result: {
                locationList: '[{"code":"03","name":"Punjab","id":"ec32efed-16bd-4b2a-93dc-7426a25b5779","type":"state"}]'
            }
        };
        userProfileServiceMock.searchLocation.mockResolvedValue(JSON.stringify(response));
        // act
        personalDetailsEditPage.getDistrict('SOME_ID');

        // assert
        setTimeout(() => {
            expect(userProfileServiceMock.searchLocation).toHaveBeenCalled();
            done();
        }, 0);
    });
    it('It should District values for error scenario', (done) => {
        // arrange
        loadingControllerMock.create.mockReturnValue({
            present: () => {
            },
            dismiss: () => {
            }
        });
        const response = {
            result: {
                locationList: '[]',
            }
        };
        userProfileServiceMock.searchLocation.mockResolvedValue(JSON.stringify(response));
        commonUtilServiceMock.translateMessage.mockReturnValue('NO_DATA_FOUND');
        // act
        personalDetailsEditPage.getDistrict('SOME_ID');

        // assert
        setTimeout(() => {

            expect(commonUtilServiceMock.showToast).toBeCalledWith('NO_DATA_FOUND');
            done();
        }, 0);
    });
    it('It changes the color of the enableSubmitButton button on change of class', () => {
        // arrange
        personalDetailsEditPage.profileEditForm.controls['name'].setValue('Rajesh');
        // act
        personalDetailsEditPage.enableSubmitButton();

        // assert
        expect(personalDetailsEditPage.btnColor).toBe('#006DE5');
    });
    it('to enable submit button', () => {
        // arrange
        personalDetailsEditPage.profileEditForm.controls['name'].setValue('ytrdyt');
        spyOn(personalDetailsEditPage, 'submitForm').and.stub();
        // act

        personalDetailsEditPage.onSubmit();

        // assert

        expect(personalDetailsEditPage.submitForm).toHaveBeenCalled();
    });
    it('hows Toast Message with `red` color', () => {
        // arrange
        commonUtilServiceMock.translateMessage.mockReturnValue('NAME_HINT');
        // act

        personalDetailsEditPage.showErrorToastMessage('FIELD_NAME');

        // assert

        expect(commonUtilServiceMock.showToast).toBeCalledWith('NAME_HINT', false, 'redErrorToast');
    });
    it(' It makes an update API call for submit value', () => {
        // arrange
        const loader = {
            present: jest.fn(),
            dismiss: jest.fn()
        };
        const response = {
            result: {
                locationList: '[{"code":"03","name":"Punjab","id":"ec32efed-16bd-4b2a-93dc-7426a25b5779","type":"state"}]'
            }
        };
        personalDetailsEditPage.stateList = [{ id: 'SOME_STATE' }];
        personalDetailsEditPage.districtList = [{ id: 'SOME_DISTRICT' }];
        personalDetailsEditPage.loader = loader;
        personalDetailsEditPage.profileEditForm.controls['name'].setValue('SOME_NAME');
        personalDetailsEditPage.profileEditForm.controls['states'].setValue('SOME_STATE');
        personalDetailsEditPage.profileEditForm.controls['districts'].setValue('SOME_DISTRICT');
        userProfileServiceMock.searchLocation.mockResolvedValue(JSON.stringify(response));
        userProfileServiceMock.updateUserInfo.mockResolvedValue(personalDetailsEditPage.profileEditForm);
        commonUtilServiceMock.translateMessage.mockReturnValue('PROFILE_UPDATE_SUCCESS');
        // act

        personalDetailsEditPage.submitForm();

        // assert
        expect(userProfileServiceMock.updateUserInfo).toHaveBeenCalled();

    });


    it(' It makes an update API call for error scenario value', () => {
        // arrange
        const loader = {
            present: jest.fn(),
            dismiss: jest.fn()
        };
        const response = {
            result: {
                locationList: '[{"code":"03","name":"Punjab","id":"ec32efed-16bd-4b2a-93dc-7426a25b5779","type":"state"}]'
            }
        };
        personalDetailsEditPage.stateList = [{ id: 'SOME_STATE' }];
        personalDetailsEditPage.districtList = [{ id: 'SOME_DISTRICT' }];
        personalDetailsEditPage.loader = loader;
        personalDetailsEditPage.profileEditForm.controls['name'].setValue('SOME_NAME');
        personalDetailsEditPage.profileEditForm.controls['states'].setValue('SOME_STATE');
        personalDetailsEditPage.profileEditForm.controls['districts'].setValue('SOME_DISTRICT');
        userProfileServiceMock.searchLocation.mockResolvedValue(JSON.stringify(response));
        userProfileServiceMock.updateUserInfo.mockRejectedValue([]);
        commonUtilServiceMock.translateMessage.mockReturnValue('PROFILE_UPDATE_FAILED');
        // act

        personalDetailsEditPage.submitForm();

        // assert
        expect(userProfileServiceMock.updateUserInfo).toHaveBeenCalled();
    });
});
