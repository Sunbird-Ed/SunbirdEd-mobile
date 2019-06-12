export const mockRes = {
    sampleCourse:
        { 'identifier': 'SAMPLE_ID', 'batchId': '1234', 'isAvailableLocally': true, 'contentTypesCount': '1' },
    contentDetailsResponse: {
        'message': 'successful',
        'result': {'isUpdateAvailable': 'true',
            'contentData': {
                'appIcon': 'sampleb_1527849151139.thumb.jpeg',
                'artifactUrl': 'sample/assets/do_212516141114736640146589/mp4_877_1527849257.mp4',
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
                'downloadUrl': 'sampleecar_files/do_212516141114736640146589/swing_1527849415336_do_212516141114736640146589_1.0.ecar',
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
                'me_totalDownloads': '24.0'
            },
            'contentType': 'resource',
            'identifier': 'do_212516141114736640146589',
            'isAvailableLocally': true,
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

    updateEventSample:
    {'data': {'identifier': 'SAMPLE_ID'}, 'type': 'contentUpdateAvailable'},
    noContentFoundImportContentResponse:
    {'message': 'successful', 'result': [{'identifier': 'SAMPLE_ID', 'status': 'NOT_FOUND'}]},

    popOverOnDismissResponse:
        { 'message': 'rating.success', 'rating': 3.0, 'comment': 'Nice App' },
};
