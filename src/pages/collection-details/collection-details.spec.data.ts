export const mockRes = {
    contentDetailsResponse: {
        'message': 'successful',
        'hierarchyInfo' : 'PARENT_ID',
        'contentTypesCount' : 1,
        'result': {
            'contentData': {
                // tslint:disable-next-line:max-line-length
                'appIcon': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_212516141114736640146589/artifact/7fd95b138e3e32dc73cc6c8ce7af59cb_1527849151139.thumb.jpeg',
                // tslint:disable-next-line:max-line-length
                'artifactUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/assets/do_212516141114736640146589/mp4_877_1527849257.mp4',
                'attributions': [
                    ''
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
                // tslint:disable-next-line:max-line-length
                'downloadUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_212516141114736640146589/swing_1527849415336_do_212516141114736640146589_1.0.ecar',
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
                'status': 'Live',
                'subject': 'English',
                'variants': {
                    'spine': {
                        // tslint:disable-next-line:max-line-length
                        'ecarUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_212516141114736640146589/swing_1527849415610_do_212516141114736640146589_1.0_spine.ecar',
                        'size': 17434
                    }
                },
                'versionKey': '1527849415052',
                'me_totalDownloads': '24.0',
                'contentTypesCount': ''
            },
            'contentType': 'resource',
            'identifier': 'do_212516141114736640146589',
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

    languageConstant: {
        'ERROR_NO_INTERNET_MESSAGE': 'No internet access'
    },
    hierarchyInfo: [
        {
            identifier: 'do_123'
        }, {
            identifier: 'do_1234'
        }, {
            identifier: 'do_12345'
        }, {
            identifier: 'do_123456'
        }
    ],
    importContentResponse: {
        'message': 'successful',
        'result': [{
            'identifier': 'ecml_testbook_shape',
            'status': 'ENQUEUED_FOR_DOWNLOAD'
        }],
        'status': true
    },
    importContentDownloadProgressResponse: {
        'type': 'downloadProgress',
        'data': {
            'downloadProgress': '40'
        }
    },
    importCompleteResponse: {
        'type': 'contentImport',
        'data': {
            'status': 'IMPORT_COMPLETED'
        }
    },

    enqueuedImportContentResponse:
    {'message': 'successful', 'result': [{'identifier': 'SAMPLE_ID', 'status': 'ENQUEUED_FOR_DOWNLOAD'}]},

    noContentFoundImportContentResponse:
    {'message': 'successful', 'result': [{'identifier': 'SAMPLE_ID', 'status': 'NOT_FOUND'}]},

    enqueuedOthersImportContentResponse:
    {'message': 'successful', 'result': [{'identifier': 'SAMPLE_ID', 'status': 'ENQUEUED_FOR_DOWNLOADS'}]},
    getChildContentAPIResponse:
    {
        'message': 'successful',
        'result': {
            'basePath': '/files/content/do_212', 'children': [{
                'children' : [{'isAvailableLocally': false, 'contentData' : {'identifier': 'SAMPLE_CHILD', 'size': '50723.0'}}],
                'basePath': 'files/content/do_21258', 'contentData': {
                    'audience': ['Learner'],
                    'contentType': 'CourseUnit', 'createdOn': '2018-09-06T16:11:16.225+0000',
                     'identifier': 'do_212584', 'language': ['English'],
                    'lastPublishedOn': '2018-09-06T16:24:45.664+0000', 'mimeType': 'application/vnd.ekstep.content-collection',
                    'name': 'Untitled Course Unit', 'osId': 'org.ekstep.launcher', 'pkgVersion': '1.0', 'size': '50723.0',
                    'status': 'Live', 'variants': { 'spine': {
                        'ecarUrl': 'sample_url/ecar_files/do_2125849622628352001386/untitled-course-unit_spine.ecar',
                     'size': 50723 } },
                    'versionKey': '15365'
                }, 'contentType': 'courseunit', 'hierarchyInfo': [{ 'contentType': 'course', 'identifier': 'do_2125849622134620161385' },
                 { 'contentType': 'courseunit', 'identifier': 'do_2125849622628352001386' }],
                  'identifier': 'do_2125849622628352001386', 'isAvailableLocally': true, 'isUpdateAvailable': false,
                   'lastUpdatedTime': 1536254864000, 'mimeType': 'application/vnd.ekstep.content-collection',
                    'referenceCount': 1, 'sizeOnDevice': 62130}],
                    'contentData': { 'appIcon': 'do_2125849622134620161385/1_1521559683246.thumb.png',
                     'audience': ['Learner'], 'board': 'CBSE',
            'channel': '012315809814749184151', 'contentDisposition': 'inline', 'contentEncoding': 'gzip',
            'contentType': 'Course', 'createdBy': '659b011a-06ec-4107-84ad-955e16b0a48a',
            'createdOn': '2018-09-06T16:11:10.197+0000', 'creator': 'CREATOR123 ', 'description': 'Untitled Collection',
             'gradeLevel': ['Class 1'], 'identifier': 'do_2125849622134620161385', 'language': ['English'],
              'lastPublishedOn': '2018-09-06T16:24:51.152+0000', 'medium': 'Hindi', 'mimeType': 'application/vnd.ekstep.content-collection',
               'name': 'telemetry course', 'osId': 'org.ekstep.quiz.app', 'pkgVersion': '1.0', 'resourceType': 'Course',
               'status': 'Live', 'subject': 'English', 'versionKey': '1536251085563' },
            'contentType': 'course', 'hierarchyInfo': [{ 'contentType': 'course', 'identifier': 'do_2125849' }],
            'identifier': 'do_2125849', 'isAvailableLocally': false, 'isUpdateAvailable': false, 'lastUpdatedTime': 1536256117000,
            'mimeType': 'application/vnd.ekstep.content-collection', 'referenceCount': 1, 'sizeOnDevice': 93234
        }, 'status': true
    },

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

    updateContentDetailsResponse: {
        'message': 'successful',
        'hierarchyInfo': 'PARENT_ID',
        'contentTypesCount': 1,
        'result': {
            'contentData': {
                'identifier': 'do_212516141114736640146589',
                'status': 'Live',
                'subject': 'English',

            },
            'contentType': 'resource',
            'identifier': 'do_212516141114736640146589',
            'isAvailableLocally': true,
            'isUpdateAvailable': true,
            'lastUpdatedTime': 0,
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
        'hierarchyInfo': 'PARENT_ID',
        'contentTypesCount': 1,
        'result': {
            'contentData': {
                'identifier': 'do_212516141114736640146589',
                'status': 'Live',
                'subject': 'English',
            },
            'contentType': 'resource',
            'identifier': 'do_212516141114736640146589',
            'isAvailableLocally': false,
            'isUpdateAvailable': true,
            'lastUpdatedTime': 0,
            'contentFeedback': [
                {
                    'rating': 1,
                    'comments': 'Test'
                }
            ]
        },
        'status': true
    }
};
