import { setTimeout } from 'timers';
import { GroupReportListPage } from './group-report-list';

import { mockres } from './group.report.list.spec.data';
import {
    navParamsMock,
    loadingControllerMock,
    zoneMock,
    transferMock,
    reportServiceMock,
    translateServiceMock,
    telemetryGeneratorServiceMock,
    appGlobalServiceMock,
    fileMock,
    datePipeMock,
    deviceInfoServiceMock,
    navCtrlMock,
    commonUtilServiceMock
} from '../../../__tests__/mocks';
import { UserReportPage } from '../user-report/user-report';

describe.only('GroupReportListPage Component', () => {
    let groupReportList: GroupReportListPage;

    beforeEach(() => {
    deviceInfoServiceMock.getDownloadDirectoryPath.mockResolvedValue( 'SOME_PATH' );
    fileMock.dataDirectory.mockReturnValue('SOME_DIR');
    translateServiceMock.get.mockReturnValue( { subscribe: jest.fn() } );
      groupReportList = new GroupReportListPage(navParamsMock as any, loadingControllerMock as any,
        zoneMock as any, transferMock as any, reportServiceMock as any, translateServiceMock as any,
        telemetryGeneratorServiceMock as any, appGlobalServiceMock as any, fileMock as any
        , datePipeMock as any, deviceInfoServiceMock as any, navCtrlMock as any
        , commonUtilServiceMock as any);

      jest.resetAllMocks();
    });

    it('can load instance the instance of userReportPage', () => {
        expect(groupReportList).toBeTruthy();
      });
    it('ionViewWillEnter should call fetchAssessment with static args ', () => {
        const data = {
                        'contentId': 'domain_4083',
                        'correctAnswers': 4,
                        'hierarchyData': '',
                        'noOfQuestions': 5,
                        'totalMaxScore': 8,
                        'totalScore': 4,
                        'totalTimespent': 24,
                        'uid': 'ed0a5346-6d68-4860-a2d3-566642fb7438',
                        'name': 'कुत्ता और रोटी',
                        'lastUsedTime': 1539153195484
                    };
         navParamsMock.get.mockReturnValue({'report': data });
         loadingControllerMock.create.mockReturnValue( { present: jest.fn() } );
         loadingControllerMock.create.mockReturnValue({
           present: () => {
           },
           dismiss: () => Promise.resolve()
         });
         reportServiceMock.getReportsByUser.mockResolvedValue(mockres.getReportsByUser);
         spyOn(groupReportList, 'fetchAssessment');
        groupReportList.ionViewWillEnter();
        expect(groupReportList.fetchAssessment).toHaveBeenCalledWith('users', false);
    });

    it('fetchAssessment if block should be called and invoke getReportsByUser', (done) => {
      const data = {
        'contentId': 'domain_4083',
        'correctAnswers': 4,
        'hierarchyData': '',
        'noOfQuestions': 5,
        'totalMaxScore': 8,
        'totalScore': 4,
        'totalTimespent': 24,
        'uid': 'ed0a5346-6d68-4860-a2d3-566642fb7438',
        'name': 'कुत्ता और रोटी',
        'lastUsedTime': 1539153195484
    };
    navParamsMock.get.mockReturnValue({'report': data });
    loadingControllerMock.create.mockReturnValue( { present: jest.fn() } );
    loadingControllerMock.create.mockReturnValue({
    present: () => {
    },
    dismiss: () => Promise.resolve()
    });
    reportServiceMock.getReportsByUser.mockResolvedValue(JSON.stringify(mockres.getReportsByUser));

    reportServiceMock.getDetailReport.mockReturnValue( { then: jest.fn(() => ({ catch: jest.fn() })) } );

    // act
    groupReportList.fetchAssessment('users', false);

    setTimeout(() => {
          zoneMock.run.mock.calls[0][0].call(groupReportList);
          expect(reportServiceMock.getReportsByUser).toHaveBeenCalled();
          expect(groupReportList.fromUserAssessment).toBeTruthy();
          done();
      }, 500);
     });
     it('fetchAssessment if block loader should dismiss on error response', (done) => {
      const data = {
        'contentId': 'domain_4083',
        'correctAnswers': 4,
        'hierarchyData': '',
        'noOfQuestions': 5,
        'totalMaxScore': 8,
        'totalScore': 4,
        'totalTimespent': 24,
        'uid': 'ed0a5346-6d68-4860-a2d3-566642fb7438',
        'name': 'कुत्ता और रोटी',
        'lastUsedTime': 1539153195484
    };
    navParamsMock.get.mockReturnValue({'report': data });
    loadingControllerMock.create.mockReturnValue( { present: jest.fn() } );

    const errorObj = { 'error': 'test case error'};
    reportServiceMock.getReportsByUser.mockRejectedValue(JSON.stringify(errorObj));

    const loadingMock = { dismiss: jest.fn(), present: jest.fn() };
          loadingControllerMock.create.mockReturnValue( loadingMock );
    // act
    groupReportList.fetchAssessment('users', false);

    setTimeout(() => {
      expect(loadingMock.dismiss).toHaveBeenCalled();
          done();
      }, 500);
     });
     it('#fetchAssessment called with questions event and false args, else block should be invoked', (done) => {
      const data = {
        'contentId': 'domain_4083',
        'correctAnswers': 4,
        'hierarchyData': '',
        'noOfQuestions': 5,
        'totalMaxScore': 8,
        'totalScore': 4,
        'totalTimespent': 24,
        'uid': 'ed0a5346-6d68-4860-a2d3-566642fb7438',
        'name': 'कुत्ता और रोटी',
        'lastUsedTime': 1539153195484
    };
    navParamsMock.get.mockReturnValue({'report': data });
    loadingControllerMock.create.mockReturnValue( { present: jest.fn() } );
    loadingControllerMock.create.mockReturnValue({
    present: () => {
    },
    dismiss: () => Promise.resolve()
    });
    reportServiceMock.getReportsByQuestion.mockResolvedValue(JSON.stringify(mockres.getReportsByQuestion));
    groupReportList.fetchAssessment('questions', false);


            setTimeout(() => {
                zoneMock.run.mock.calls[0][0].call(groupReportList);
                expect(reportServiceMock.getReportsByQuestion).toHaveBeenCalled();
                expect(groupReportList.fromQuestionAssessment).toBeTruthy();
                done();
            }, 0);

     });

     it('#fetchAssessment else block loader should dismiss on error response', (done) => {
      const data = {
        'contentId': 'domain_4083',
        'correctAnswers': 4,
        'hierarchyData': '',
        'noOfQuestions': 5,
        'totalMaxScore': 8,
        'totalScore': 4,
        'totalTimespent': 24,
        'uid': 'ed0a5346-6d68-4860-a2d3-566642fb7438',
        'name': 'कुत्ता और रोटी',
        'lastUsedTime': 1539153195484
    };
    navParamsMock.get.mockReturnValue({'report': data });
    loadingControllerMock.create.mockReturnValue( { present: jest.fn() } );
    loadingControllerMock.create.mockReturnValue({
    present: () => {
    },
    dismiss: () => Promise.resolve()
    });
    const errorObj = { 'error': 'test case error'};
    reportServiceMock.getReportsByQuestion.mockRejectedValue(JSON.stringify(errorObj));
    const loadingMock = { dismiss: jest.fn(), present: jest.fn() };
          loadingControllerMock.create.mockReturnValue( loadingMock );
    groupReportList.fetchAssessment('questions', false);

            setTimeout(() => {
              expect(loadingMock.dismiss).toHaveBeenCalled();
                done();
            }, 0);

     });

     it('#formatTime should give time in desired format', () => {
              const test = groupReportList.formatTime(61);
              expect(test).toBe('01:01');
          });

      it('#showQuestionFromUser should invoke fetchAssessment', () => {
                spyOn(groupReportList, 'fetchAssessment');
                groupReportList.showQuestionFromUser();
                expect(groupReportList.fetchAssessment).toHaveBeenCalled();
            });

      it('#goToReportList should push UserReportPage', () => {
          // TODO call to  goToReportList mock navpush to UserReportPage
          const data = {
              'contentId': 'domain_4083',
              'correctAnswers': 4,
              'hierarchyData': '',
              'noOfQuestions': 5,
              'totalMaxScore': 8,
              'totalScore': 4,
              'totalTimespent': 24,
              'uid': 'ed0a5346-6d68-4860-a2d3-566642fb7438',
              'name': 'कुत्ता और रोटी',
              'lastUsedTime': 1539153195484
          };
          navParamsMock.get.mockReturnValue(data);
          spyOn(navCtrlMock, 'push');
          groupReportList.goToReportList();
          expect(navCtrlMock.push).toHaveBeenCalledWith(UserReportPage, { 'report': data });
      });
      it('translateMessage should give desired desired translated message', (done) => {
        translateServiceMock.get.mockReturnValue( { subscribe: jest.fn() } );
        groupReportList.translateMessage('TIME', 'en');
        setTimeout( () => {
            expect(translateServiceMock.get).toHaveBeenCalledWith('TIME', { '%s': 'en' });
            done();
        }, 0 );
      });

    it('importcsv should make expected calls', () => {
      groupReportList.response = [{uid : '30c6de21-d184-446a-b9d8-edfedff910ef', contentId: 'domain_4083'}];
      groupReportList.deviceId = '96360f6fb9f309691ce1ea41dcfa12ab40b61af3';
      groupReportList.groupinfo = {gid: 'testing_id'};
      groupReportList.reportSummary = {uid: '30c6de21-d184-446a-b9d8-edfedff910ef',
      contentId: 'test',
      name: 'test',
      lastUsedTime: 10,
      noOfQuestions: 20,
      correctAnswers: 4,
      totalTimespent: 5,
      hierarchyData: 'test',
      totalMaxScore: 5,
      totalScore: 4};
      fileMock.writeFile.mockResolvedValue('test val');
      spyOn(groupReportList, 'convertToCSV').and.returnValue(mockres.csvdata);
      groupReportList.importcsv();
      expect(groupReportList.convertToCSV).toHaveBeenCalled();
    });
    it('convertToCSV should give csv', () => {
      groupReportList.groupinfo = [{uid : '30c6de21-d184-446a-b9d8-edfedff910ef', handle: 'domain_4083'}];
      groupReportList.reportSummary = {uid: '30c6de21-d184-446a-b9d8-edfedff910ef',
        contentId: 'test',
        name: 'test',
        lastUsedTime: 10,
        noOfQuestions: 20,
        correctAnswers: 4,
        totalTimespent: 5,
        hierarchyData: 'test',
        totalMaxScore: 5,
        totalScore: 4};
      groupReportList.response = mockres.csvdata;
      groupReportList.responseByUser = mockres.getReportsByUser;
      groupReportList.groupReport = mockres.getReportsByUser;
      const csv = groupReportList.convertToCSV();
      datePipeMock.transform.mockReturnValue('');
      expect(csv).toBeTruthy();
    });

});

