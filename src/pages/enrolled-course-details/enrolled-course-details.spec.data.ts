export const mockRes = {
    Batch: {
        'identifier': 'SAMPLE_IDENTIFIER',
        'id': '12344',
        'createdFor': ['Sample_Creator', 'SAMPLE_CREATOR'],
        'courseAdditionalInfo': 'CourseAdditonalInfo',
        'endDate': 'SAmple_Date',
        'description': 'Sample_Description',
        'participant': 'any_participant',
        'updatedDate': 'string',
        'createdDate': 'string',
        'mentors': ['test', 'test', 'test'],
        'name': 'string',
        'enrollmentType': 'string',
        'courseId': 'string',
        'startDate': 'string',
        'hashTagId': 'string',
        'status': 1234,
        'courseCreator': 'string',
        'createdBy': 'string',
        'creatorFirstName': 'string',
        'creatorLastName': 'string',
        'enrollmentEndDate': 'string'
    },
    enrollCourseEvent:
        { 'batchId': '1234', 'identifier': 'SAMPLE_ID' },

    sampleCourse:
        { 'identifier': 'SAMPLE_ID', 'batchId': '1234', 'isAvailableLocally': true, 'contentTypesCount': '1' },

    sampleCourseNoLocal:
        { 'identifier': 'SAMPLE_ID', 'isAvailableLocally': false },

    sampleSession:
        { 'userToken': 'SAMPLE_ID' },

    popOverOnDismissResponse:
        { 'message': 'rating.success', 'rating': 3.0, 'comment': 'Nice App' },

    popOverOnDismissResponseMenu:
        'delete.success',

    popOverOnDismissUnenrollResponse:
      {
        caller: 'unenroll',
        unenroll: true
      },

    batchDetailsResponse:
    {
        'message': 'successful',
        'result': {
            'courseAdditionalInfo': {
                'courseName': 'TestOrg2', 'leafNodesCount': '5',
                'description': 'cjbejwnckewnkcew',
                'courseLogoUrl': 'samplple_urlb89c4b66c26d7dabcb378c_1476686834688.jpeg', 'tocUrl': 'sample806734438412332toc.json',
                'status': 'Live'
            }, 'courseCreator': '8e4cb485-a741-4a7f-9f8e-45e483d2bf3b', 'courseId': 'do_21252', 'createdBy': 'SAMPLE_UID',
            'createdDate': '2018-06-20 10:38:33:125+0000', 'createdFor': ['012529459943317504139', '01252944391512064091'],
            'description': 'wecewcwecececwcw', 'endDate': '2018-07-02T18:29:59.999Z', 'enrollmentType': 'open',
            'hashTagId': '0125', 'id': '0125', 'identifier': '0125', 'mentors': [],
             'name': 'Iphone x', 'startDate': '2018-06-20T18:29:59.999Z',
            'status': 2, 'updatedDate': '2018-07-03 00:00:02:102+0000'
        }, 'status': true
    },
    creatorDetails:
    {
        'webPages': [], 'education': [], 'subject': [], 'roles': ['PUBLIC'], 'channel': 'ccc',
        'language': [], 'updatedDate': '2018-06-20 10:30:59:133+0000',
        'skills': [], 'badgeAssertions': [], 'isDeleted': false,
        'organisations': [{
            'organisationId': '012529459943317504139',
            'updatedBy': '230cb747-6ce9-4e1c-91a8-1067ae291cb9',
            'roles': ['COURSE_MENTOR', 'CONTENT_REVIEWER'], 'updatedDate': '2018-06-20 10:30:59:139+0000',
            'userId': 'SAMPLE_USER_ID', 'isDeleted': false, 'id': '01252', 'orgjoindate': '2018-06-20 07:00:42:891+0000'
        }],
        'id': 'v', 'email': 'gm.com', 'rootOrg': {
            'channel': 'ccc', 'id': '01252', 'slug': 'ccc', 'identifier': '01252',
            'orgName': 'Root ORG 111', 'locationIds': [], 'isRootOrg': true, 'rootOrgId': '01252', 'contactDetail': [],
            'createdDate': '2018-06-20 05:30:16:596+0000', 'createdBy': '230cb747', 'hashTagId': '01252944391512064091', 'status': 1
        }, 'identifier': '8e4cb485b',
        'updatedBy': '230cb747', 'jobProfile': [], 'rootOrgId': '01252',
        'emailVerified': false, 'firstName': 'John', 'createdDate': '2018-06-20 07:00:42:831+0000', 'createdBy': '230cb74',
         'grade': [], 'status': 1
    },

    getChildContentAPIResponse:
    {
        'message': 'successful',
        'result': {
            'basePath': '/files/content/do_212', 'children': [{
            'children': [{'isAvailableLocally': false, 'contentData': {'identifier': 'SAMPLE_CHILD', 'size': '50723.0'}}],
             'basePath': 'files/content/do_21258', 'contentData': {
             'audience': ['Learner'],
             'contentType': 'CourseUnit', 'createdOn': '2018-09-06T16:11:16.225+0000', 'identifier': 'do_212584',
             'language': ['English'],
             'lastPublishedOn': '2018-09-06T16:24:45.664+0000', 'mimeType': 'application/vnd.ekstep.content-collection',
             'name': 'Untitled Course Unit', 'osId': 'org.ekstep.launcher', 'pkgVersion': '1.0', 'size': '50723.0',
             'status': 'Live', 'variants': { 'spine':
             { 'ecarUrl': 'sample_url/ecar_files/do_2125849622628352001386/untitled-course-unit_spine.ecar', 'size': 50723 } },
             'versionKey': '15365'}, 'contentType': 'courseunit',
             'hierarchyInfo': [{ 'contentType': 'course', 'identifier': 'do_2125849622134620161385' },
             { 'contentType': 'courseunit', 'identifier': 'do_2125849622628352001386' }], 'identifier': 'do_2125849622628352001386',
            'isAvailableLocally': true, 'isUpdateAvailable': false, 'lastUpdatedTime': 1536254864000,
            'mimeType': 'application/vnd.ekstep.content-collection', 'referenceCount': 1, 'sizeOnDevice': 62130}],
            'contentData': { 'appIcon': 'do_2125849622134620161385/1_1521559683246.thumb.png', 'audience': ['Learner'],
            'board': 'CBSE', 'channel': '012315809814749184151', 'contentDisposition': 'inline', 'contentEncoding': 'gzip',
            'contentType': 'Course', 'createdBy': '659b011a-06ec-4107-84ad-955e16b0a48a',
            'createdOn': '2018-09-06T16:11:10.197+0000', 'creator': 'CREATOR123 ', 'description': 'Untitled Collection',
            'gradeLevel': ['Class 1'], 'identifier': 'do_2125849622134620161385', 'language': ['English'],
            'lastPublishedOn': '2018-09-06T16:24:51.152+0000', 'medium': 'Hindi', 'mimeType': 'application/vnd.ekstep.content-collection',
            'name': 'telemetry course', 'osId': 'org.ekstep.quiz.app', 'pkgVersion': '1.0', 'resourceType': 'Course', 'status': 'Live',
            'subject': 'English', 'versionKey': '1536251085563' },
            'contentType': 'course', 'hierarchyInfo': [{ 'contentType': 'course', 'identifier': 'do_2125849' }],
            'identifier': 'do_2125849', 'isAvailableLocally': false, 'isUpdateAvailable': false, 'lastUpdatedTime': 1536256117000,
            'mimeType': 'application/vnd.ekstep.content-collection', 'referenceCount': 1, 'sizeOnDevice': 93234
        }, 'status': true
    },
    contentDetailsResponse: {
        'message': 'successful',
        'result': {
            'contentData': {
                'appIcon': 'sample/do_212516141114736640146589/artifact/7fd95b138e3e32dc73cc6c8ce7af59cb_1527849151139.thumb.jpeg',
                'artifactUrl': 'sample146589/mp4_877_1527849257.mp4',
                'attributions': [
                    'CC'
                ],
                'audience': [
                    'Learner'
                ],
                'me_totalRatings': '3.0',
                'board': 'CBSE',
                'contentDisposition': 'inline',
                'contentEncoding': 'identity',
                'contentType': 'Resource',
                'createdBy': '877',
                'createdOn': '2018-06-01T10:34:17.170+0000',
                'creator': 'Subrat Rath',
                'description': 'Swing around',
      'downloadUrl': 'sample.amazonaws.com/ecar_files/do_212516141114736640146589/swing_1527849415336_do_212516141114736640146589_1.0.ecar',
                'gradeLevel': [
                    'KG',
                    'Class 1'
                ],
                'identifier': 'SAMPLE_ID',
                'language': [
                    'English'
                ],
                'lastPublishedOn': '2018-06-01T10:36:55.335+0000',
                'mimeType': 'video/mp4',
                'name': 'Swing',
                'osId': 'org.ekstep.quiz.app',
                'owner': 'Joker',
                'pkgVersion': '1.0',
                'publisher': '',
                'resourceType': 'Practice',
                'size': '2120865.0',
                'status': 'Live',
                'subject': 'English',
                'variants': {
                    'spine': {
                        'ecarUrl': 'sample589_1.0_spine.ecar',
                        'size': 17434
                    }
                },
                'versionKey': '1527849415052',
                'me_totalDownloads': '24.0'
            },
            'contentType': 'resource',
            'identifier': 'do_2125161',
            'isAvailableLocally': true,
            'isUpdateAvailable': false,
            'lastUpdatedTime': 0,
            'mimeType': 'video/mp4',
            'referenceCount': 1,
            'contentFeedback': [
                {
                    'rating': 1,
                    'comments': 'Test'
                }
            ]
        },
        'status': true
    },
    draftContentDetailsResponse: {
        'message': 'successful',
        'result': {
            'contentData': {
                'appIcon': 'sample/do_212516141114736640146589/artifact/7fd95b138e3e32dc73cc6c8ce7af59cb_1527849151139.thumb.jpeg',
                'artifactUrl': 'sample146589/mp4_877_1527849257.mp4',
                'attributions': [
                    'CC'
                ],
                'audience': [
                    'Learner'
                ],
                'me_totalRatings': '3.0',
                'board': 'CBSE',
                'contentDisposition': 'inline',
                'contentEncoding': 'identity',
                'contentType': 'Resource',
                'createdBy': '877',
                'createdOn': '2018-06-01T10:34:17.170+0000',
                'creator': 'Subrat Rath',
                'description': 'Swing around',
      'downloadUrl': 'sample.amazonaws.com/ecar_files/do_212516141114736640146589/swing_1527849415336_do_212516141114736640146589_1.0.ecar',
                'gradeLevel': [
                    'KG',
                    'Class 1'
                ],
                'identifier': 'do_212516141114736640146589',
                'language': [
                    'English'
                ],
                'lastPublishedOn': '2018-06-01T10:36:55.335+0000',
                'mimeType': 'video/mp4',
                'name': 'Swing',
                'osId': 'org.ekstep.quiz.app',
                'owner': 'Joker',
                'pkgVersion': '1.0',
                'publisher': '',
                'resourceType': 'Practice',
                'size': '2120865.0',
                'status': 'Draft',
                'subject': 'English',
                'variants': {
                    'spine': {
                        'ecarUrl': 'sample589_1.0_spine.ecar',
                        'size': 17434
                    }
                },
                'versionKey': '1527849415052',
                'me_totalDownloads': '24.0'
            },
            'contentType': 'resource',
            'identifier': 'do_2125161',
            'isAvailableLocally': true,
            'isUpdateAvailable': false,
            'lastUpdatedTime': 0,
            'mimeType': 'video/mp4',
            'referenceCount': 1,
            'contentFeedback': [
                {
                    'rating': 1,
                    'comments': 'Test'
                }
            ]
        },
        'status': true
    },
    emptyContentDetailsResponse: {
        'message': 'successful',
        'result': {
            'contentType': 'resource',
            'identifier': 'do_2125161',
            'isAvailableLocally': true,
            'isUpdateAvailable': false,
            'lastUpdatedTime': 0,
            'mimeType': 'video/mp4',
            'referenceCount': 1,
            'contentFeedback': [
                {
                    'rating': 1,
                    'comments': 'Test'
                }
            ]
        },
        'status': true
    },
    locallyNotAvailableContentDetailsResponse: {
        'message': 'successful',
        'result': {
            'contentType': 'resource',
            'identifier': 'do_2125161',
            'isAvailableLocally': false,
            'isUpdateAvailable': false,
            'lastUpdatedTime': 0,
            'mimeType': 'video/mp4',
            'referenceCount': 1,
            'contentFeedback': [
                {
                    'rating': 1,
                    'comments': 'Test'
                }
            ]
        },
        'status': true
    },
    connectionErrorcontentDetialResponse:
    {'error': 'CONNECTION_ERROR'},

    serverErrorcontentDetialResponse:
    {'error': 'SERVER_ERROR'},

    noContentFoundImportContentResponse:
    {'message': 'successful', 'result': [{'identifier': 'SAMPLE_ID', 'status': 'NOT_FOUND'}]},

    enqueuedImportContentResponse:
    {'message': 'successful', 'result': [{'identifier': 'SAMPLE_ID', 'status': 'ENQUEUED_FOR_DOWNLOAD'}]},

    enqueuedOthersImportContentResponse:
    {'message': 'successful', 'result': [{'identifier': 'SAMPLE_ID', 'status': 'ENQUEUED_FOR_DOWNLOADS'}]},

    downloadProgressEventSample1:
    {'data': {'downloadId': 18788, 'downloadProgress': 10, 'identifier': 'do_sampele', 'status': 1}, 'type': 'downloadProgress'},

    downloadProgressEventSample2:
    {'data': {'downloadId': 18788, 'downloadProgress': -1, 'identifier': 'do_sampele', 'status': 1}, 'type': 'downloadProgress'},

    downloadProgressEventSample3:
    {'data': {'downloadId': 18788, 'downloadProgress': 100, 'identifier': 'do_sampele', 'status': 1}, 'type': 'downloadProgress'},

    importCompleteEventSample:
    {'data': {'identifier': 'SAMPLE_ID', 'status': 'IMPORT_COMPLETED'}, 'type': 'contentImport'},

    updateEventSample:
    {'data': {'identifier': 'SAMPLE_ID'}, 'type': 'contentUpdateAvailable'},
    courseBatchesRequest:
    {
      'message': 'successful',
      'result': {
        'content': [
          {
            'courseAdditionalInfo': {
              'courseName': 'tc_242',
              'leafNodesCount': '2',
              'description': 'Enter description for Course',
              'courseLogoUrl': 'artifact/crowd_1536735489063.thumb.jpg',
              'tocUrl': 'content/do_11264557997213286411377/artifact/do_11264557997213286411377toc.json',
              'status': 'Live'
            },
            'courseCreator': 'bf622d07-ca95-4cc1-9a49-a4518925a4d8',
            'courseId': 'do_11264557997213286411377',
            'createdBy': 'bf622d07-ca95-4cc1-9a49-a4518925a4d8',
            'createdDate': '2018-12-01 07:42:07:408+0000',
            'createdFor': [
              '012451141730410496558',
              '0124511325012951040'
            ],
            'creatorFirstName': 'JP Mentor ORg1',
            'creatorLastName': 'user',
            'description': '',
            'enrollmentType': 'open',
            'hashTagId': '01264558852132864096',
            'id': '01264558852132864096',
            'identifier': '01264558852132864096',
            'mentors': [],
            'name': 'xaddw',
            'participant': {
              '9ac4ea92-fea7-45e6-93f3-02aa3172ea58': true,
              '6773fab9-a89e-4056-885f-6226b866e8c0': true,
              '230cb747-6ce9-4e1c-91a8-1067ae291cb9': true
            },
            'startDate': '2018-12-01',
            'status': 1,
            'updatedDate': '2018-12-01 08:00:00:255+0000'
          }
        ],
        'count': 1
      },
      'status': true
    }
};
