import { CreateGroupPage } from './create-group';
import { mockCreateorremoveGroupRes } from './create-group.spec.data';
import {
    navCtrlMock, formBuilderMock, formAndFrameworkUtilServiceMock, translateServiceMock, loadingControllerMock,
    navParamsMock, commonUtilServiceMock, groupServiceMock, telemetryGeneratorServiceMock, appGlobalServiceMock, sharedPreferencesMock
} from '../../../__tests__/mocks';
import { FormGroup, FormControl } from '@angular/forms';
// import { GroupMembersPage } from '../group-members/group-members';
const GuestEditProfilePage = {} as any;
const GroupMembersPage = {} as any;
describe('CreateGroupPage', () => {
    let createGroupPage: CreateGroupPage;
    beforeEach(() => {

        navParamsMock.get.mockImplementation((arg: string) => {
            if (arg === 'groupInfo') {
                return {
                    name: 'group_name'
                };
            } else {
                return;
            }
        });
        appGlobalServiceMock.isUserLoggedIn.mockResolvedValue(true);
        sharedPreferencesMock.getString.mockResolvedValue('SAMPLE');
        commonUtilServiceMock.translateMessage.mockReturnValue('CLASS_SAMPLE');
        loadingControllerMock.create.mockReturnValue({ present: jest.fn(), dismiss: jest.fn() });
        commonUtilServiceMock.getLoader.mockReturnValue({ present: jest.fn(), dismiss: jest.fn() });
        formAndFrameworkUtilServiceMock.getSupportingBoardList.mockResolvedValue([]);

        createGroupPage = new CreateGroupPage(
            navCtrlMock as any,
            formBuilderMock as any,
            formAndFrameworkUtilServiceMock as any,
            translateServiceMock as any,
            navParamsMock as any,
            commonUtilServiceMock as any,
            groupServiceMock as any,
            telemetryGeneratorServiceMock as any
        );

        jest.resetAllMocks();
    });
    it('can load instance', () => {
        expect(createGroupPage).toBeTruthy();
        spyOn(createGroupPage, 'getSyllabusDetails').and.stub();
    });

    it('to get syallubusdetails() for create group page ', (done) => {
        // arrange

        commonUtilServiceMock.getLoader.mockReturnValue({
            present: () => {
            },
            dismiss: () => Promise.resolve()
        });
        formAndFrameworkUtilServiceMock.getSupportingBoardList.mockResolvedValue(
            mockCreateorremoveGroupRes.syllabusListMock);

        // act
        createGroupPage.getSyllabusDetails();
        // assert
        setTimeout(() => {

            expect(formAndFrameworkUtilServiceMock.getSupportingBoardList).toHaveBeenCalled();
            done();
        }, 0);
    });
    it('to naviagate to the guest edit page ', () => {
        // arrange
        // act
        createGroupPage.goToGuestEdit();
        // assert
        expect(navCtrlMock.push).toHaveBeenCalledWith(GuestEditProfilePage);
    });

    it('to naviagate to the userlist that when form is invalid ', () => {
        // arrange
        createGroupPage.isFormValid = false;
        commonUtilServiceMock.translateMessage.mockReturnValue('GROUP_MEMBER_ADD_SUCCESS');
        // act
        createGroupPage.navigateToUsersList();
        // assert
        expect(commonUtilServiceMock.showToast).toBeCalledWith('GROUP_MEMBER_ADD_SUCCESS');
    });

    it('submitting a form values to a group to create a group', () => {
        // arrange
        createGroupPage.classList = [{ name: '2nd class', code: '2nd class' }];
        createGroupPage.isFormValid = false;
        createGroupPage.group = { name: 'Amaravathi' } as any;
        createGroupPage.group = { syllabus: 'State (Andhra Pradesh)' } as any;
        createGroupPage.group = { class: '2nd class' } as any;
        // act
        createGroupPage.navigateToUsersList();
        // assert
        expect(createGroupPage.group).toBeTruthy();
    });

    it('submitting a form values with GroupEditForm values groupMembers page', () => {
        // arrange
        createGroupPage.groupEditForm = new FormGroup({
            'name': new FormControl('Amarvati'),
            'syllabus': new FormControl('sda'),
            'class': new FormControl('asd')
            // 'gradeValueMap': new FormControl([])
        });
        // act
        createGroupPage.navigateToUsersList();

        // assert
        expect(createGroupPage.group.name).toBe('Amarvati');
    });

    it('submitting a form values with empty values should show toast warning', () => {
        createGroupPage.isFormValid = true;
        createGroupPage.groupEditForm = new FormGroup({
            'syllabus': new FormControl('sda'),
            'class': new FormControl('asd')
        });
        commonUtilServiceMock.translateMessage.mockReturnValue('NEED_INTERNET_TO_CHANGE');
        // act
        createGroupPage.navigateToUsersList();
        // assert
        expect(commonUtilServiceMock.showToast).toBeCalledWith('NEED_INTERNET_TO_CHANGE');
    });

    it('its calls form is Invalid show toast message', () => {
        createGroupPage.isFormValid = false;

        commonUtilServiceMock.translateMessage.mockReturnValue('ENTER_GROUP_NAME');
        // act
        createGroupPage.updateGroup();

        // assert

        expect(commonUtilServiceMock.showToast).toBeCalledWith('ENTER_GROUP_NAME');
    });
     it('calls Update group API if form is valid', (done) => {
        createGroupPage.groupEditForm = new FormGroup({
            'name': new FormControl('Amarvati'),
            'syllabus': new FormControl(['sda']),
            'class': new FormControl(['asd'])
        });
        groupServiceMock.updateGroup.mockResolvedValue(createGroupPage.groupEditForm);
        commonUtilServiceMock.getLoader.mockReturnValue({
            present: () => {
            },
            dismiss: () => Promise.resolve()
          });
            // act
        createGroupPage.updateGroup();
      // assert
        setTimeout(() => {
            expect(navCtrlMock.popTo((-2)));
            done();
        });
    }, 0);
    it('calls Update group API if form is invalid and show toast message', (done) => {
    // arrange
        createGroupPage.groupEditForm = new FormGroup({
            'syllabus': new FormControl(['sda']),
            'class': new FormControl(['asd'])
        });
        groupServiceMock.updateGroup.mockResolvedValue(createGroupPage.groupEditForm);
         commonUtilServiceMock.translateMessage.mockReturnValue('ENTER_GROUP_NAME');
        commonUtilServiceMock.getLoader.mockReturnValue({
            present: () => {
            },
            dismiss: () => Promise.resolve()
          });
            // act
        createGroupPage.updateGroup();
      // assert
        setTimeout(() => {
            expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith('ENTER_GROUP_NAME');
            done();
        });
    }, 0);

    it('to get the getclasslist()', (done) => {
        // arrange
        spyOn(formAndFrameworkUtilServiceMock, 'getCategoryData').and.stub();
            createGroupPage.isFormValid = true;
        createGroupPage.groupEditForm = new FormGroup({
            'name': new FormControl('Amarvati'),
            'syllabus': new FormControl('sda'),
            'class': new FormControl(['asd'])
        });
        const data = ['sampleCategory'];

            commonUtilServiceMock.getLoader.mockReturnValue({
                present: () => {
                },
                dismiss: () => Promise.resolve()
              });
             formAndFrameworkUtilServiceMock.getFrameworkDetails.mockResolvedValue(data);
                // act
            createGroupPage.getClassList('abcd', true);
          // assert
            setTimeout(() => {
                expect(formAndFrameworkUtilServiceMock.getFrameworkDetails).toHaveBeenCalled();
                done();
            });
        }, 0);

        it('to get the getclasslist() when form is invalid or error cause', (done) => {
            // arrange
                createGroupPage.isFormValid = false;
            createGroupPage.groupEditForm = new FormGroup({
                'name': new FormControl('Amarvati'),
                'syllabus': new FormControl('sda'),
                'class': new FormControl(['asd'])
            });
            const data = ['sampleCategory'];
         commonUtilServiceMock.getLoader.mockReturnValue({
                    present: () => {
                    },
                    dismiss: () => Promise.resolve()
                  });
                 formAndFrameworkUtilServiceMock.getFrameworkDetails.mockRejectedValue(data);
                 commonUtilServiceMock.translateMessage.mockReturnValue('NEED_INTERNET_TO_CHANGE');
                 // act
                createGroupPage.getClassList('abcd', true);
              // assert
                setTimeout(() => {
                    expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith('NEED_INTERNET_TO_CHANGE');
                    done();
                });
            }, 0);

            
    });
