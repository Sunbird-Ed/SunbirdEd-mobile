export const mockRes = {
  searchCriteriaResponse:
    { 'age': 0, 'contentTypes': ['TextBook'], 'impliedFilters': [{ 'name': 'contentType',
    'values': [{ 'apply': true, 'count': 0, 'name': 'TextBook' }] }, { 'name': 'objectType', 'values':
    [{ 'apply': true, 'count': 0, 'name': 'Content' }] }, { 'name': 'status', 'values': [{ 'apply': true,
    'count': 0, 'name': 'Live' }] }], 'limit': 100, 'mode': 'soft', 'offlineSearch': false, 'offset': 0,
    'query': '', 'searchType': 'FILTER', 'sortCriteria': [{ 'sortAttribute': 'me_averageRating', 'sortOrder': 'DESC' }] },

  searchResponse:
  {
    'message': 'successful',
    'result': {
      'contentDataList': [
        {
          'appIcon': 'sample/1411988.large_1518948673728.jpg',
          'audience': [
            'Learner'
          ],
          'board': 'MSCERT',
          'channel': '0123',
          'contentDisposition': 'inline',
          'contentEncoding': 'gzip',
          'contentType': 'TextBook',
          'contentTypesCount': '{   "TextBookUnit":1,"Resource":7,"Collection":2}',
          'createdBy': '659',
          'createdOn': '2018-04-03T07:02:54.162+0000',
          'creator': 'Creator User',
          'description': 'jdeaiend',
          'downloadUrl': 'sample_spine.ecar',
          'gradeLevel': [
            'Grade 3',
            'Grade 4'
          ],
          'identifier': 'do_2124742776763432961210',
          'language': [
            'English'
          ],
          'lastPublishedOn': '2018-05-22T12:22:29.973+0000',
          'medium': 'English',
          'mimeType': 'application/vnd.ekstep.content-collection',
          'name': 'Book123',
          'osId': 'org.ekstep.quiz.app',
          'pkgVersion': '2.0',
          'publisher': 'wqed',
          'resourceType': 'Book',
          'size': '908198.0',
          'status': 'Live',
          'subject': 'Civics and Administration',
          'variants': {
            'spine': {
              'ecarUrl': 'sample961210_2.0_spine.ecar',
              'size': 908198.0
            }
          },
          'versionKey': '1526991749015'
        },
        {
          'audience': [
            'Learner'
          ],
          'board': 'CBSE',
          'channel': '012',
          'contentDisposition': 'inline',
          'contentEncoding': 'gzip',
          'contentType': 'TextBook',
          'contentTypesCount': '{"TextBookUnit":5,"Resource":5}',
          'createdBy': '646',
          'createdOn': '2018-04-09T10:03:01.731+0000',
          'creator': 'Demo User',
          'description': 'videoTest',
          'downloadUrl': 'sample7.0_spine.ecar',
          'gradeLevel': [
            'Class 1'
          ],
          'identifier': 'do_2124785826104033281635',
          'language': [
            'English'
          ],
          'lastPublishedOn': '2018-05-22T12:22:40.154+0000',
          'medium': 'Hindi',
          'mimeType': 'application/vnd.ekstep.content-collection',
          'name': 'VideoTestBook',
          'osId': 'org.ekstep.quiz.app',
          'pkgVersion': '7.0',
          'resourceType': 'Book',
          'size': '2375.0',
          'status': 'Live',
          'subject': 'English',
          'variants': {
            'spine': {
              'ecarUrl': 'sample.0_spine.ecar',
              'size': 2375.0
            }
          },
          'versionKey': '1526991759168'
        }
      ]
    }
  },
  getEnrolledCourses:
    { 'message': 'successful', 'result': { 'courses': [{ 'active': true, 'addedBy': 'abc', 'batchId': '1234',
    'contentId': 'do_123', 'courseId': 'do_123', 'courseLogoUrl': 'sampleurl', 'courseName': 'LiveCourse',
    'dateTime': '2018-04-2212: 00: 07: 304+0000', 'description': 'Sampledescription', 'enrolledDate': '2018-04-2212: 00: 07: 304+0000',
    'id': 'axyz', 'identifier': 'xyz', 'lastReadContentStatus': 0, 'leafNodesCount': 4, 'progress': 0, 'status': 0, 'userId': 'xyz' }] } },

  getAllLocalContentsResponse:
    [
      {
        'basePath': '/s/org.sunbird.app/files/content/do_2123349069973585921335',
        'contentData': {
          'appIcon': 'do_2123399347878.png',
          'artifactUrl': 'do_5921335.zip',
          'audience': [
            'Learner'
          ],
          'board': 'State (Andhra Pradesh)',
          'channel': '8668ff9]33f0a8e',
          'contentDisposition': 'inline',
          'contentEncoding': 'gzip',
          'contentType': 'Resource',
          'createdBy': 'c1714d18635',
          'createdOn': '2017-09-18T09:12:31.826+0000',
          'creator': 'Mentor1User',
          'description': 'By KS',
          'downloadUrl': 'do__do_2123349069973585921335.zip',
          'gradeLevel': [
            'Class 1'
          ],
          'identifier': 'do_212334',
          'language': [
            'English'
          ],
          'lastPublishedOn': '2018-05-31T12:07:42.955+0000',
          'mimeType': 'application/vnd.ekstep.ecml-archive',
          'name': 'Sample1',
          'osId': 'org.ekstep.quiz.app',
          'pkgVersion': '5.0',
          'resourceType': 'Test',
          'size': '31685.0',
          'status': 'Live',
          'subject': 'English',
          'versionKey': '1527768462513'
        },
        'contentType': 'resource',
        'identifier': 'do_21',
        'isAvailableLocally': true,
        'isUpdateAvailable': false,
        'lastUpdatedTime': 1531834041000,
        'mimeType': 'application/vnd.ekstep.ecml-archive',
        'referenceCount': 1,
        'sizeOnDevice': 56043
      }
    ],

  enqueuedImportContentResponse:
    { 'message': 'successful', 'result': [{ 'identifier': 'SAMPLE_ID', 'status': 'ENQUEUED_FOR_DOWNLOAD' }] },

  enqueuedOthersImportContentResponse:
    { 'message': 'successful', 'result': [{ 'identifier': 'SAMPLE_ID', 'status': 'ENQUEUED_FOR_DOWNLOADS' }] },

  importContentResponse:
    '{"message":"successful","result":[{"identifier":"do_sample","status":"ENQUEUED_FOR_DOWNLOAD"}]}',

  importCompleteEvent:
    '{"data":{"downloadId":18788,"downloadProgress":-1,"identifier":"do_sample","status":"IMPORT_COMPLETED"},"type":"contentImport"}',

  downloadProgressEventSample1:
    '{"data":{"downloadId":18788,"downloadProgress":10,"identifier":"do_sampele","status":1},"type":"downloadProgress"}',

  downloadProgressEventSample2:
    '{"data":{"downloadId":18788,"downloadProgress":-1,"identifier":"do_sampele","status":1},"type":"downloadProgress"}',

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
};
