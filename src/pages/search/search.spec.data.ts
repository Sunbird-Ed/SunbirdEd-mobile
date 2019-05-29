import { ProfileType, UserSource } from 'sunbird';

export const mockRes = {
  dialResultMockResponse: [
    {

    }
  ],

  searchResultResponse:
  {
    'message': 'successful',
    'result': {
      'contentDataList': [{
        'appIcon': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2124142282168238081379/' +
          'artifact/36a1038acc70e0fc9cdfcc637e9a2f31_1513661725312.thumb.jpeg',
        'artifactUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2124142282168238081379/' +
        'artifact/1515482989311_do_2124142282168238081379.zip',
        'attributions': [''], 'audience': ['Learner'], 'board': 'CBSE', 'channel': 'in.ekstep',
        'contentDisposition': 'inline', 'contentEncoding': 'gzip', 'contentType': 'Resource',
        'createdBy': '821', 'createdOn': '2018-01-08T10:51:57.874+0000', 'creator': 'Iphone Qualitrix', 'description': 'desc',
        'downloadUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2124142282168238081379/' +
        'multiplication-horizontal_1527769064640_do_2124142282168238081379_4.0.ecar',
        'gradeLevel': ['Other', 'KG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6',
          'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
        'identifier': 'do_2124142282168238081379', 'language': ['English'],
        'lastPublishedOn': '2018-05-31T12:17:44.640+0000', 'mimeType': 'application/vnd.ekstep.ecml-archive',
        'name': 'Multiplication horizontal', 'osId': 'org.ekstep.quiz.app', 'owner': 'iphone',
        'pkgVersion': '4.0', 'publisher': '', 'resourceType': 'Read', 'size': '256146.0', 'status': 'Live',
        'subject': 'English', 'variants': {
          'spine': {
            'ecarUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2124142282168238081379/' +
            'multiplication-horizontal_1527769064831_do_2124142282168238081379_4.0_spine.ecar',
            'size': 50673.0
          }
        }, 'versionKey': '1527769064440'
      }], 'filterCriteria': {
        'age': 0,
        'contentTypes': ['Story', 'Worksheet', 'Game', 'Resource', 'Collection', 'TextBook', 'LessonPlan'],
        'facetFilters': [{
          'name': 'gradeLevel', 'values': [{ 'apply': false, 'count': 1, 'name': 'other' },
          { 'apply': false, 'count': 1, 'name': 'class 10' }, { 'apply': false, 'count': 1, 'name': 'class 1' },
          { 'apply': false, 'count': 1, 'name': 'class 3' }, { 'apply': false, 'count': 1, 'name': 'class 2' },
          { 'apply': false, 'count': 1, 'name': 'class 11' }, { 'apply': false, 'count': 1, 'name': 'class 5' },
          { 'apply': false, 'count': 1, 'name': 'class 12' }, { 'apply': false, 'count': 1, 'name': 'class 4' },
          { 'apply': false, 'count': 1, 'name': 'class 7' }, { 'apply': false, 'count': 1, 'name': 'class 6' },
          { 'apply': false, 'count': 1, 'name': 'class 9' }, { 'apply': false, 'count': 1, 'name': 'class 8' },
          { 'apply': false, 'count': 1, 'name': 'kg' }]
        }, {
          'name': 'subject', 'values': [{
            'apply': false,
            'count': 1, 'name': 'english'
          }]
        }, { 'name': 'medium', 'values': [] }, {
          'name': 'contentType',
          'values': [{ 'apply': false, 'count': 1, 'name': 'resource' }]
        },
        { 'name': 'board', 'values': [{ 'apply': false, 'count': 1, 'name': 'cbse' }] }],
        'facets': ['board', 'gradeLevel', 'subject', 'medium', 'contentType'],
        'impliedFilters': [{
          'name': 'audience', 'values': [{ 'apply': true, 'count': 0, 'name': 'instructor' },
          { 'apply': true, 'count': 0, 'name': 'learner' }]
        },
        { 'name': 'status', 'values': [{ 'apply': true, 'count': 0, 'name': 'Live' }] },
        { 'name': 'objectType', 'values': [{ 'apply': true, 'count': 0, 'name': 'Content' }] }],
        'limit': 100, 'mode': 'soft', 'offlineSearch': false, 'offset': 0, 'query': 'Multiplication horizontal',
        'searchType': 'FILTER', 'sortCriteria': []
      }, 'id': 'api.v1.search',
      'request': {
        'mode': 'soft', 'offset': 0, 'query': 'Multiplication horizontal', 'limit': 100,
        'filters': {
          'audience': ['instructor', 'learner'], 'compatibilityLevel': { 'min': 1, 'max': 4 },
          'status': ['Live'], 'objectType': ['Content']
        }, 'facets': ['board', 'gradeLevel', 'subject', 'medium', 'contentType']
      },
      'responseMessageId': '831b5030-a2d1-11e8-bf54-d5ada8edb61b'
    }, 'status': true
  },

  importCompleteEvent:
    '{\'data\':{\'downloadId\':18788,\'downloadProgress\':-1,\'identifier\':\'SAMPLE_ID\',\'status\':\'IMPORT_COMPLETED\'},' +
    '\'type\':\'contentImport\'}',

  downloadProgressEventSample1:
    '{\'data\':{\'downloadId\':18788,\'downloadProgress\':10,\'identifier\':\'do_sampele\',\'status\':1},\'type\':\'downloadProgress\'}',

  downloadProgressEventSample2:
    '{\'data\':{\'downloadId\':18788,\'downloadProgress\':100,\'identifier\':\'SAMPLE_ID\',\'status\':1},\'type\':\'downloadProgress\'}',

  noContentFoundImportContentResponse:
    { 'message': 'successful', 'result': [{ 'identifier': 'SAMPLE_ID', 'status': 'NOT_FOUND' }] },

  enqueuedImportContentResponse:
    { 'message': 'successful', 'result': [{ 'identifier': 'SAMPLE_ID', 'status': 'ENQUEUED_FOR_DOWNLOAD' }] },

  enqueuedOthersImportContentResponse:
    { 'message': 'successful', 'result': [{ 'identifier': 'SAMPLE_ID', 'status': 'ENQUEUED_FOR_DOWNLOADS' }] },


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

  sampleProfile:
  {
    handle: 'sample', syllabus: ['NCF'], board: ['CBSE'], grade: ['KG'], subject: ['English'],
    medium: ['English'], profileType: ProfileType.TEACHER, source: UserSource.LOCAL
  },

  searchResponse:
  {
    'status': 'successful',
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
          'contentTypesCount': '{   \'TextBookUnit\':1,\'Resource\':7,\'Collection\':2}',
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
          'contentTypesCount': '{\'TextBookUnit\':5,\'Resource\':5}',
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

  dialCodeSections:
  {
    'sections': '[{"display":"{\\"name\\":{\\"en\\":\\"Popular Books\\"}}","count":53.0,"index":1.0,"sectionDataType":"content",' +
    '"resmsgId":"1238","contents":[{"subject":"Tamil","channel":"1234","downloadUrl":"sampleurl","language":["Tamil"],' +
    '"mimeType":"application/vnd.ekstep.content-collection","variants":{"spine":{"ecarUrl":"sample.ecar","size":596405.0}},' +
    '"objectType":"Content","gradeLevel":["Class 5","Class 6"],"appIcon":"sample.thumb.jpg","children":["do_2123610485389475841501"],' +
    '"appId":"sunbird_portal","me_totalRatings":0.0,"contentEncoding":"gzip",' +
    '"mimeTypesCount":"{\\"application/vnd.ekstep.content-collection\\":1,\\"video/x-youtube\\":1}","contentType":"TextBook",' +
    '"identifier":"do_1234","lastUpdatedBy":"sasa","audience":["Learner"],"visibility":"Default","toc_url":"sampletoc.json",' +
    '"contentTypesCount":"{\\"Resource\\":1,\\"Collection\\":1}","consumerId":"1234","author":"bhv","childNodes":["do_1234","do_231"],' +
    '"mediaType":"content","osId":"org.ekstep.quiz.app","graph_id":"domain","nodeType":"DATA_NODE",' +
    '"lastPublishedBy":"68777b59-b28b-4aee-88d6-50d46e4c3509","prevState":"Live","concepts":["123","123"],"size":596405.0,' +
    '"lastPublishedOn":"2018-05-22T12:20:04.607+0000","IL_FUNC_OBJECT_TYPE":"Content","name":"m1","status":"Live","code":"do_21as",' +
    '"description":"jbh","medium":"English","idealScreenSize":"normal","posterImage":"sasmpleimage",' +
    '"createdOn":"2017-11-02T06:01:56.040+0000","me_totalSideloads":0.0,"me_totalComments":0.0,"contentDisposition":"inline",' +
    '"lastUpdatedOn":"2018-05-22T12:20:04.465+0000","SYS_INTERNAL_LAST_UPDATED_ON":"2018-05-22T12:20:05.171+0000",' +
    '"me_totalDownloads":2.0,"creator":"CreatoUse","createdFor":["01232002070124134414","012315809814749184151"],' +
    '"IL_SYS_NODE_TYPE":"DATA_NODE","os":["All"],"pkgVersion":2.0,"versionKey":"112","idealScreenDensity":"hdpi",' +
    '"s3Key":"ecar_files/dsammplspine_spine.ecar","lastSubmittedOn":"2017-11-02T06:04:17.268+0000","me_averageRating":0.0,' +
    '"createdBy":"qw-ab","compatibilityLevel":1.0,"leafNodesCount":1.0,"IL_UNIQUE_ID":"do_12","board":"State (Uttar Pradesh)",' +
    '"resourceType":"Book","node_id":0.0}],"searchQuery":"{\\"request\\":{\\"filters\\":{\\"contentType\\":[\\"TextBook\\"],\\' +
    '"objectType\\":[\\"Content\\"],\\"status\\":[\\"Live\\"]},\\"sort_by\\":{\\"me_averageRating\\":\\"desc\\"},\\"limit\\":10}}",' +
    '"name":"Popular Books","id":"1234","apiId":"api.content.search","group":1.0}]'
  },

  dialCodesearchResultResponse:
  {
    'message': 'successful',
    'result': {
      'collectionDataList': [{
        'identifier': 'do_212', 'childNodes': ['do_212'], 'size': 637311,
        'name': 'book', 'mimeType': 'application/vnd.ekstep.content-collection', 'contentType': 'TextBook',
        'objectType': 'Content'
      }], 'count': 3, 'contentDataList': [{
        'code': 'do_212', 'keywords': ['test'],
        'mimeType': 'application/vnd.ekstep.content-collection', 'idealScreenSize': 'normal',
        'createdOn': '2018-07-06T11:07:31.001+0000', 'conceptData': '(3) concepts selected', 'objectType': 'Content',
        'collections': ['do_212'], 'contentDisposition': 'inline', 'contentEncoding': 'gzip',
         'lastUpdatedOn': '2018-07-06T11:08:13.918+0000',
        'SYS_INTERNAL_LAST_UPDATED_ON': '2018-07-06T11:10:10.614+0000', 'contentType': 'TextBookUnit', 'identifier': 'do_212',
        'audience': ['Learner'], 'os': ['All'], 'visibility': 'Parent', 'mediaType': 'content', 'osId': 'org.ekstep.launcher',
        'graph_id': 'domain', 'nodeType': 'DATA_NODE', 'pkgVersion': 1, 'versionKey': '1530875251001', 'idealScreenDensity': 'hdpi',
        'dialcodes': ['646X5X'], 'lastPublishedOn': '2018-07-06T11:10:10.213+0000', 'size': 359155, 'compatibilityLevel': 1,
        'name': 'book', 'status': 'Live', 'node_id': 386064
      }], 'facets': [{ 'values': [], 'name': 'gradeLevel' },
      { 'values': [], 'name': 'subject' }, { 'values': [], 'name': 'medium' }, {
        'values': [{ 'name': 'textbookunit', 'count': 1 }],
        'name': 'contentType'
      }, { 'values': [], 'name': 'board' }], 'collectionsCount': 1
    }, 'status': true
  },

  dialCodesearchResultResponse2:
  {
    'message': 'successful',
    'result': {
      'collectionDataList': [], 'contentDataList': [{
        'audience': ['Learner'], 'channel': '0123',
        'contentDisposition': 'inline', 'contentEncoding': 'gzip', 'contentType': 'TextBookUnit',
        'createdOn': '2018-04-12T07:29:21.120+0000',
        'description': 'cdfghjk', 'dialcodes': ['UWELJP'], 'downloadUrl': 'sample_01159_1.0_spine.ecar', 'identifier': 'do_212',
        'language': ['English'], 'lastPublishedOn': '2018-04-12T07:31:50.114+0000', 'mimeType': 'application/vnd.ekstep.content-collection',
        'name': 'kk', 'osId': 'org.ekstep.launcher', 'pkgVersion': '1.0', 'size': '636854.0', 'status': 'Live', 'versionKey': '1523'
      }],
      'filterCriteria': {
        'age': 0, 'contentTypes': ['TextBook', 'TextBookUnit'], 'facetFilters': [{ 'name': 'gradeLevel', 'values': [] },
        { 'name': 'subject', 'values': [] }, { 'name': 'medium', 'values': [{ 'apply': true, 'count': 1, 'name': 'english' }] },
        { 'name': 'contentType', 'values': [{ 'apply': true, 'count': 1, 'name': 'textbookunit' }] }, { 'name': 'board', 'values': [] }],
        'facets': ['board', 'gradeLevel', 'subject', 'medium', 'contentType'], 'impliedFilters': [{
          'name': 'dialcodes',
          'values': [{ 'apply': true, 'count': 0, 'name': 'UWELJP' }]
        }, {
          'name': 'status',
          'values': [{ 'apply': true, 'count': 0, 'name': 'Live' }]
        }, {
          'name': 'objectType',
          'values': [{ 'apply': true, 'count': 0, 'name': 'Content' }]
        }], 'limit': 100, 'offlineSearch': false,
        'offset': 0, 'query': '', 'searchType': 'FILTER', 'sortCriteria': []
      }, 'id': 'api.v1.search',
      'request': {
        'mode': 'collection', 'offset': 0, 'query': '', 'limit': 100, 'filters': {
          'dialcodes': ['UWELJP'],
          'compatibilityLevel': { 'min': 1, 'max': 4 }, 'status': ['Live'], 'objectType': ['Content']
        },
        'facets': ['board', 'gradeLevel', 'subject', 'medium', 'contentType']
      },
      'responseMessageId': '18ff4450-ba81-11e8-a5da-b973240ce558'
    },
    'status': true
  },

  dialCodesearchResultResponse3:
  {
    'message': 'successful',
    'result': {
      'collectionDataList': [{
        'childNodes': ['do_2125409300562001921307'], 'contentType': 'TextBook',
        'identifier': 'do_2125409291287838721305', 'mimeType': 'application/vnd.ekstep.content-collection',
        'name': 'book', 'size': '637311.0'
      }, {
        'childNodes': ['do_2124791820965806081846'], 'contentType': 'TextBook',
        'identifier': 'do_2124791816024883201843', 'mimeType': 'application/vnd.ekstep.content-collection',
        'name': 'Dial Code link', 'size': '593666.0'
      }, {
        'childNodes': ['do_21250324701456793616459'], 'contentType': 'TextBook',
        'identifier': 'do_21250324682831462416458', 'mimeType': 'application/vnd.ekstep.content-collection', 'name': 'Dial_Code_JP_Book',
        'size': '4.4713607E7'
      }], 'contentDataList': [{
        'audience': ['Learner'], 'contentDisposition': 'inline', 'contentEncoding': 'gzip',
        'contentType': 'TextBookUnit', 'createdOn': '2018-07-06T11:07:31.001+0000',
        'description': 'ge ew oiuwef oiqjwd oiueoqe qwdg ftrqw tqwfd', 'dialcodes': ['646X5X'],
        'downloadUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2125409300562001921307/' +
        'book_1530875410232_do_2125409300562001921307_1.0_spine.ecar',
        'identifier': 'do_2125409300562001921307', 'language': ['English'], 'lastPublishedOn': '2018-07-06T11:10:10.213+0000',
        'mimeType': 'application/vnd.ekstep.content-collection', 'name': 'book', 'osId': 'org.ekstep.launcher', 'pkgVersion': '1.0',
        'size': '359155.0', 'status': 'Live', 'variants': {
          'spine':
          {
            'ecarUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2125409300562001921307/' +
            'book_1530875410232_do_2125409300562001921307_1.0_spine.ecar',
            'size': 359155.0
          }
        }, 'versionKey': '1530875251001'
      }, {
        'audience': ['Learner'], 'contentDisposition': 'inline',
        'contentEncoding': 'gzip', 'contentType': 'TextBookUnit', 'createdOn': '2018-05-14T05:21:10.333+0000', 'dialcodes': ['646X5X'],
        // tslint:disable-next-line:max-line-length
        'downloadUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_21250324701456793616459/jp-1_1526992263235_do_21250324701456793616459_2.0_spine.ecar',
        'identifier': 'do_21250324701456793616459', 'language': ['English'], 'lastPublishedOn': '2018-05-22T12:31:02.037+0000',
        'mimeType': 'application/vnd.ekstep.content-collection', 'name': 'JP 1', 'osId': 'org.ekstep.launcher', 'pkgVersion': '2.0',
        'size': '4.470704E7', 'status': 'Live', 'variants': {
          'spine':
            { 'ecarUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_21250324701456793616459/' +
            'jp-1_1526992263235_do_21250324701456793616459_2.0_spine.ecar', 'size': 4.470704E7 }
        },
        'versionKey': '1526275270333'
      }, {
        'audience': ['Learner'], 'channel': '012315809814749184151', 'contentDisposition': 'inline',
        'contentEncoding': 'gzip', 'contentType': 'TextBookUnit', 'createdOn': '2018-04-10T05:20:58.274+0000', 'dialcodes': ['646X5X'],
        'downloadUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2124791820965806081846/' +
        'unit-1_1523337900939_do_2124791820965806081846_1.0_spine.ecar',
        'identifier': 'do_2124791820965806081846', 'language': ['English'], 'lastPublishedOn': '2018-04-10T05:25:00.921+0000',
        'mimeType': 'application/vnd.ekstep.content-collection', 'name': 'Unit 1', 'osId': 'org.ekstep.launcher', 'pkgVersion': '1.0',
        'size': '589598.0', 'status': 'Live', 'variants': {
          'spine':
            { 'ecarUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2124791820965806081846/' +
            'unit-1_1523337900939_do_2124791820965806081846_1.0_spine.ecar', 'size': 589598.0 }
        },
        'versionKey': '1523337658274'
      }], 'filterCriteria': {
        'age': 0, 'contentTypes': ['TextBook', 'TextBookUnit'],
        'facetFilters': [{ 'name': 'gradeLevel', 'values': [] }, { 'name': 'subject', 'values': [] }, {
          'name': 'medium',
          'values': []
        }, { 'name': 'contentType', 'values': [{ 'apply': false, 'count': 3, 'name': 'textbookunit' }] },
        { 'name': 'board', 'values': [] }], 'facets': ['board', 'gradeLevel', 'subject', 'medium', 'contentType'],
        'impliedFilters': [{ 'name': 'dialcodes', 'values': [{ 'apply': true, 'count': 0, 'name': '646X5X' }] },
        { 'name': 'status', 'values': [{ 'apply': true, 'count': 0, 'name': 'Live' }] }, {
          'name': 'objectType',
          'values': [{ 'apply': true, 'count': 0, 'name': 'Content' }]
        }], 'limit': 100, 'offlineSearch': false, 'offset': 0, 'query': '',
        'searchType': 'FILTER', 'sortCriteria': []
      }, 'id': 'api.v1.search', 'request': {
        'mode': 'collection', 'offset': 0, 'query': '',
        'limit': 100, 'filters': {
          'dialcodes': ['646X5X'], 'compatibilityLevel': { 'min': 1, 'max': 4 }, 'status': ['Live'],
          'objectType': ['Content']
        }, 'facets': ['board', 'gradeLevel', 'subject', 'medium', 'contentType']
      },
      'responseMessageId': '98de2310-ba8d-11e8-9001-81918790455e'
    }, 'status': true
  },

  dialCodesearchResultResponse4:
  {
    'message': 'successful',
    'result': {
      'collectionDataList': [{
        'identifier': 'do_212', 'childNodes': ['do_212456'], 'size': 637311, 'name': 'book',
        'mimeType': 'application/vnd.ekstep.content-collection', 'contentType': 'TextBook', 'objectType': 'Content'
      }], 'count': 3,
      'contentDataList': [{
        'code': 'do_212', 'keywords': ['test'], 'mimeType': 'application/vnd.ekstep.content-collection',
        'idealScreenSize': 'normal', 'createdOn': '2018-07-06T11:07:31.001+0000', 'conceptData': '(3) concepts selected',
        'objectType': 'Content', 'collections': ['do_212'], 'contentDisposition': 'inline', 'contentEncoding': 'gzip',
        'lastUpdatedOn': '2018-07-06T11:08:13.918+0000', 'SYS_INTERNAL_LAST_UPDATED_ON': '2018-07-06T11:10:10.614+0000',
        'contentType': 'TextBookUnit', 'identifier': 'do_212', 'audience': ['Learner'], 'os': ['All'], 'visibility': 'Parent',
        'mediaType': 'content', 'osId': 'org.ekstep.launcher', 'graph_id': 'domain', 'nodeType': 'DATA_NODE', 'pkgVersion': 1,
        'versionKey': '1530875251001', 'idealScreenDensity': 'hdpi', 'dialcodes': ['646X5X'],
        'lastPublishedOn': '2018-07-06T11:10:10.213+0000', 'size': 359155, 'compatibilityLevel': 1, 'name': 'book', 'status': 'Live',
        'node_id': 386064
      }, {
        'code': 'do_212', 'keywords': ['test'], 'mimeType': 'application/vnd.ekstep.content-collection',
        'idealScreenSize': 'normal', 'createdOn': '2018-07-06T11:07:31.001+0000', 'conceptData': '(3) concepts selected',
        'objectType': 'Content', 'collections': ['do_212'], 'contentDisposition': 'inline', 'contentEncoding': 'gzip',
        'lastUpdatedOn': '2018-07-06T11:08:13.918+0000', 'SYS_INTERNAL_LAST_UPDATED_ON': '2018-07-06T11:10:10.614+0000',
        'contentType': 'TextBookUnit', 'identifier': 'do_212456', 'audience': ['Learner'], 'os': ['All'], 'visibility': 'Parent',
        'mediaType': 'content', 'osId': 'org.ekstep.launcher', 'graph_id': 'domain', 'nodeType': 'DATA_NODE', 'pkgVersion': 1,
        'versionKey': '1530875251001', 'idealScreenDensity': 'hdpi', 'dialcodes': ['646X5X'],
        'lastPublishedOn': '2018-07-06T11:10:10.213+0000', 'size': 359155, 'compatibilityLevel': 1, 'name': 'book', 'status': 'Live',
        'node_id': 386064
      }], 'facets': [{ 'values': [], 'name': 'gradeLevel' }, { 'values': [], 'name': 'subject' },
      { 'values': [], 'name': 'medium' }, { 'values': [{ 'name': 'textbookunit', 'count': 1 }], 'name': 'contentType' },
      { 'values': [], 'name': 'board' }, ], 'collectionsCount': 1
    }, 'status': true
  },

  courseConfigFilter: [{
    'name': 'Board',
    'translations': '{\'en\':\'Board\',\'hi\':\'बोर्ड\',\'te\':\'బోర్డు\',\'ta\':\'வாரியம்\',\'mr\':\'बोर्ड\'}',
    'code': 'board', 'index': 1, 'values': []
  },
  {
    'name': 'Subject', 'translations': '{\'en\':\'Subject\',\'hi\':\'विषय\',\'te\':\'పాఠ్యాంశము\',\'ta\':\'பாடம்\',\'mr\':\'विषय\'}',
    'code': 'subject', 'index': 2, 'values': []
  },
  {
    'name': 'Medium', 'translations': '{\'en\':\'Medium\',\'hi\':\'माध्यम\',\'te\':\'మాధ్యమం\',\'ta\':\'மொழி\',\'mr\':\'माध्यम\'}',
    'code': 'medium', 'index': 3, 'values': []
  }],

  emptyDialCodeResponse:
  {
    'message': 'successful',
    'result': {
      'contentDataList': [], 'id': 'api.v1.search', 'request': {
        'mode': 'collection', 'offset': 0, 'query': '', 'limit': 100,
        'filters': {
          'dialcodes': ['646X5XX'], 'compatibilityLevel': { 'min': 1, 'max': 4 }, 'contentType': ['TextBook', 'TextBookUnit'],
          'status': ['Live'], 'objectType': ['Content']
        }, 'facets': ['board', 'gradeLevel', 'subject', 'medium', 'contentType']
      },
      'responseMessageId': '66171360-ba92-11e8-9001-81918790455e'
    }, 'status': true
  },

  // https://staging.open-sunbird.org/dial/UWELJP
  dialCodeSearchResultWithSingleContent: {
    'collectionDataList': [],
    'contentDataList': [
      {
        'audience': [
          'Learner'
        ],
        'channel': '012315809814749184151',
        'contentDisposition': 'inline',
        'contentEncoding': 'gzip',
        'contentType': 'TextBookUnit',
        'createdOn': '2018-04-12T07:29:21.120+0000',
        'description': 'cdfghjk',
        'dialcodes': [
          'UWELJP'
        ],
        'downloadUrl': `https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2124806607758950401159/
        kk_1523518310120_do_2124806607758950401159_1.0_spine.ecar`,
        'identifier': 'do_2124806607758950401159',
        'language': [
          'English'
        ],
        'lastPublishedOn': '2018-04-12T07:31:50.114+0000',
        'mimeType': 'application/vnd.ekstep.content-collection',
        'name': 'kk',
        'osId': 'org.ekstep.launcher',
        'pkgVersion': '1.0',
        'size': '636854.0',
        'status': 'Live',
        'variants': {
          'spine': {
            'ecarUrl': `https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2124806607758950401159/
            kk_1523518310120_do_2124806607758950401159_1.0_spine.ecar`,
            'size': 636854
          }
        },
        'versionKey': '1523518161120'
      }
    ],
    'filterCriteria': {
      'age': 0,
      'contentTypes': [
        'TextBook',
        'TextBookUnit'
      ],
      'facetFilters': [
        {
          'name': 'gradeLevel',
          'values': []
        },
        {
          'name': 'subject',
          'values': []
        },
        {
          'name': 'medium',
          'values': []
        },
        {
          'name': 'contentType',
          'values': [
            {
              'apply': false,
              'count': 1,
              'name': 'textbookunit'
            }
          ]
        },
        {
          'name': 'board',
          'values': []
        }
      ],
      'facets': [
        'board',
        'gradeLevel',
        'subject',
        'medium',
        'contentType'
      ],
      'impliedFilters': [
        {
          'name': 'dialcodes',
          'values': [
            {
              'apply': true,
              'count': 0,
              'name': 'UWELJP'
            }
          ]
        },
        {
          'name': 'objectType',
          'values': [
            {
              'apply': true,
              'count': 0,
              'name': 'Content'
            }
          ]
        },
        {
          'name': 'status',
          'values': [
            {
              'apply': true,
              'count': 0,
              'name': 'Live'
            }
          ]
        }
      ],
      'limit': 100,
      'offlineSearch': false,
      'offset': 0,
      'query': '',
      'searchType': 'FILTER',
      'sortCriteria': []
    },
    'id': 'api.v1.search',
    'request': {
      'facets': [
        'board',
        'gradeLevel',
        'subject',
        'medium',
        'contentType'
      ],
      'filters': {
        'dialcodes': [
          'UWELJP'
        ],
        'objectType': [
          'Content'
        ],
        'status': [
          'Live'
        ],
        'compatibilityLevel': {
          'max': 4,
          'min': 1
        }
      },
      'mode': 'collection',
      'query': '',
      'limit': 100,
      'offset': 0
    },
    'responseMessageId': '1b1d8150-d2a7-11e8-af34-97ead167c40e'
  },
  // https://staging.open-sunbird.org/dial/7V5Q3B
  dialCodeSearchResultWithMultipleContents: {
    'collectionDataList': [],
    'contentDataList': [
      {
        'appIcon': `https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/
        do_2124899901836247041294/artifact/0306022-1.jpg_1524657005308.jpg`,
        'audience': [
          'Learner'
        ],
        'board': 'CBSE',
        'channel': '012315809814749184151',
        'childNodes': [
          'do_21261300684343705611310',
          'do_21261300496072704011306',
          'do_21261300432935321611305',
          'do_21261300684343705611311'
        ],
        'contentDisposition': 'inline',
        'contentEncoding': 'gzip',
        'contentType': 'TextBook',
        'contentTypesCount': '{"TextBookUnit":2,"Resource":2}',
        'createdBy': '6de50989-0990-4bd5-b77d-f05a371f622c',
        'createdOn': '2018-10-16T07:07:04.539+0000',
        'creator': 'S P',
        'description': 'Untitled Collection',
        'dialcodes': [
          '7V5Q3B'
        ],
        'downloadUrl': `https://sunbirdstaging.blob.core.windows.net/sunbird-content-staging/ecar_files/
        do_21261300633223168011308/oct-16-dial_1539673894505_do_21261300633223168011308_1.0_spine.ecar`,
        'framework': 'NCF',
        'gradeLevel': [
          'Class 1'
        ],
        'identifier': 'do_21261300633223168011308',
        'language': [
          'English'
        ],
        'lastPublishedOn': '2018-10-16T07:11:34.488+0000',
        'medium': 'Marathi',
        'mimeType': 'application/vnd.ekstep.content-collection',
        'name': 'Oct-16-dial',
        'osId': 'org.ekstep.quiz.app',
        'owner': 'S P',
        'pkgVersion': '1.0',
        'resourceType': 'Book',
        'size': '845158.0',
        'status': 'Live',
        'subject': 'English',
        'variants': {
          'spine': {
            'ecarUrl': `https://sunbirdstaging.blob.core.windows.net/sunbird-content-staging/ecar_files/do_21261300633223168011308/
            oct-16-dial_1539673894505_do_21261300633223168011308_1.0_spine.ecar`,
            'size': 845158
          }
        },
        'versionKey': '1539673893579'
      },
      {
        'appIcon': `https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2124899901836247041294/
        artifact/0306022-1.jpg_1524657005308.jpg`,
        'audience': [
          'Learner'
        ],
        'board': 'State (Tamil Nadu)',
        'channel': '012315809814749184151',
        'childNodes': [
          'domain_4048',
          'domain_4058',
          'domain_4083',
          'do_21261328649459302411397',
          'domain_3915',
          'do_21261328649459302411398'
        ],
        'contentDisposition': 'inline',
        'contentEncoding': 'gzip',
        'contentType': 'TextBook',
        'contentTypesCount': '{"TextBookUnit":2,"Resource":4}',
        'createdBy': '6de50989-0990-4bd5-b77d-f05a371f622c',
        'createdOn': '2018-10-16T16:33:48.658+0000',
        'creator': 'S P',
        'description': 'Untitled Collection',
        'dialcodes': [
          '7V5Q3B'
        ],
        'downloadUrl': `https://sunbirdstaging.blob.core.windows.net/sunbird-content-staging/ecar_files/
        do_21261328489396633611396/oct-17-dialcode_1539707939959_do_21261328489396633611396_1.0_spine.ecar`,
        'framework': 'NCF',
        'gradeLevel': [
          'Class 5'
        ],
        'identifier': 'do_21261328489396633611396',
        'language': [
          'English'
        ],
        'lastPublishedOn': '2018-10-16T16:38:59.834+0000',
        'medium': 'Odia',
        'mimeType': 'application/vnd.ekstep.content-collection',
        'name': 'oct-17-dialcode',
        'osId': 'org.ekstep.quiz.app',
        'owner': 'S P',
        'pkgVersion': '1.0',
        'resourceType': 'Book',
        'size': '1092418.0',
        'status': 'Live',
        'subject': 'English',
        'variants': {
          'spine': {
            'ecarUrl': `https://sunbirdstaging.blob.core.windows.net/sunbird-content-staging/ecar_files/do_21261328489396633611396/
            oct-17-dialcode_1539707939959_do_21261328489396633611396_1.0_spine.ecar`,
            'size': 1092418
          }
        },
        'versionKey': '1539707938192'
      }
    ],
    'filterCriteria': {
      'age': 0,
      'contentTypes': [
        'TextBook',
        'TextBookUnit'
      ],
      'facetFilters': [
        {
          'name': 'gradeLevel',
          'values': [
            {
              'apply': false,
              'count': 1,
              'name': 'class 1'
            },
            {
              'apply': false,
              'count': 1,
              'name': 'class 5'
            }
          ]
        },
        {
          'name': 'subject',
          'values': [
            {
              'apply': false,
              'count': 2,
              'name': 'english'
            }
          ]
        },
        {
          'name': 'medium',
          'values': [
            {
              'apply': false,
              'count': 1,
              'name': 'marathi'
            },
            {
              'apply': false,
              'count': 1,
              'name': 'odia'
            }
          ]
        },
        {
          'name': 'contentType',
          'values': [
            {
              'apply': false,
              'count': 2,
              'name': 'textbook'
            }
          ]
        },
        {
          'name': 'board',
          'values': [
            {
              'apply': false,
              'count': 1,
              'name': 'cbse'
            },
            {
              'apply': false,
              'count': 1,
              'name': 'state (tamil nadu)'
            }
          ]
        }
      ],
      'facets': [
        'board',
        'gradeLevel',
        'subject',
        'medium',
        'contentType'
      ],
      'impliedFilters': [
        {
          'name': 'dialcodes',
          'values': [
            {
              'apply': true,
              'count': 0,
              'name': '7V5Q3B'
            }
          ]
        },
        {
          'name': 'objectType',
          'values': [
            {
              'apply': true,
              'count': 0,
              'name': 'Content'
            }
          ]
        },
        {
          'name': 'status',
          'values': [
            {
              'apply': true,
              'count': 0,
              'name': 'Live'
            }
          ]
        }
      ],
      'limit': 100,
      'offlineSearch': false,
      'offset': 0,
      'query': '',
      'searchType': 'FILTER',
      'sortCriteria': []
    },
    'id': 'api.v1.search',
    'request': {
      'facets': [
        'board',
        'gradeLevel',
        'subject',
        'medium',
        'contentType'
      ],
      'filters': {
        'dialcodes': [
          '7V5Q3B'
        ],
        'objectType': [
          'Content'
        ],
        'status': [
          'Live'
        ],
        'compatibilityLevel': {
          'max': 4,
          'min': 1
        }
      },
      'mode': 'collection',
      'query': '',
      'limit': 100,
      'offset': 0
    },
    'responseMessageId': 'cbbcce80-d2a7-11e8-8a94-859f0a619c07'
  },

  // https://staging.open-sunbird.org/dial/646X5X
  dialCodeSearchResultWithMultipleCollections: {
    'collectionDataList': [
      {
        'childNodes': [
          'do_2125409300562001921307'
        ],
        'contentType': 'TextBook',
        'identifier': 'do_2125409291287838721305',
        'mimeType': 'application/vnd.ekstep.content-collection',
        'name': 'book',
        'size': '637311.0',
        'content': [
          {
            'audience': [
              'Learner'
            ],
            'contentDisposition': 'inline',
            'contentEncoding': 'gzip',
            'contentType': 'TextBookUnit',
            'createdOn': '2018-07-06T11:07:31.001+0000',
            'description': 'ge ew oiuwef oiqjwd oiueoqe qwdg ftrqw tqwfd',
            'dialcodes': [
              '646X5X'
            ],
            'downloadUrl': `https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/
            do_2125409300562001921307/book_1530875410232_do_2125409300562001921307_1.0_spine.ecar`,
            'identifier': 'do_2125409300562001921307',
            'language': [
              'English'
            ],
            'lastPublishedOn': '2018-07-06T11:10:10.213+0000',
            'mimeType': 'application/vnd.ekstep.content-collection',
            'name': 'book',
            'osId': 'org.ekstep.launcher',
            'pkgVersion': '1.0',
            'size': '359155.0',
            'status': 'Live',
            'variants': {
              'spine': {
                'ecarUrl': `https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/
                do_2125409300562001921307/book_1530875410232_do_2125409300562001921307_1.0_spine.ecar`,
                'size': 359155
              }
            },
            'versionKey': '1530875251001'
          }
        ]
      },
      {
        'childNodes': [
          'do_2124791820965806081846'
        ],
        'contentType': 'TextBook',
        'identifier': 'do_2124791816024883201843',
        'mimeType': 'application/vnd.ekstep.content-collection',
        'name': 'Dial Code link',
        'size': '593666.0',
        'content': [
          {
            'audience': [
              'Learner'
            ],
            'channel': '012315809814749184151',
            'contentDisposition': 'inline',
            'contentEncoding': 'gzip',
            'contentType': 'TextBookUnit',
            'createdOn': '2018-04-10T05:20:58.274+0000',
            'dialcodes': [
              '646X5X'
            ],
            'downloadUrl': `https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/
            do_2124791820965806081846/unit-1_1523337900939_do_2124791820965806081846_1.0_spine.ecar`,
            'identifier': 'do_2124791820965806081846',
            'language': [
              'English'
            ],
            'lastPublishedOn': '2018-04-10T05:25:00.921+0000',
            'mimeType': 'application/vnd.ekstep.content-collection',
            'name': 'Unit 1',
            'osId': 'org.ekstep.launcher',
            'pkgVersion': '1.0',
            'size': '589598.0',
            'status': 'Live',
            'variants': {
              'spine': {
                'ecarUrl': `https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/
                ecar_files/do_2124791820965806081846/unit-1_1523337900939_do_2124791820965806081846_1.0_spine.ecar`,
                'size': 589598
              }
            },
            'versionKey': '1523337658274'
          }
        ]
      },
      {
        'childNodes': [
          'do_21250324701456793616459'
        ],
        'contentType': 'TextBook',
        'identifier': 'do_21250324682831462416458',
        'mimeType': 'application/vnd.ekstep.content-collection',
        'name': 'Dial_Code_JP_Book',
        'size': '4.4713607E7',
        'content': [
          {
            'audience': [
              'Learner'
            ],
            'contentDisposition': 'inline',
            'contentEncoding': 'gzip',
            'contentType': 'TextBookUnit',
            'createdOn': '2018-05-14T05:21:10.333+0000',
            'dialcodes': [
              '646X5X'
            ],
            'downloadUrl': `https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/
            do_21250324701456793616459/jp-1_1526992263235_do_21250324701456793616459_2.0_spine.ecar`,
            'identifier': 'do_21250324701456793616459',
            'language': [
              'English'
            ],
            'lastPublishedOn': '2018-05-22T12:31:02.037+0000',
            'mimeType': 'application/vnd.ekstep.content-collection',
            'name': 'JP 1',
            'osId': 'org.ekstep.launcher',
            'pkgVersion': '2.0',
            'size': '4.470704E7',
            'status': 'Live',
            'variants': {
              'spine': {
                'ecarUrl': `https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/
                do_21250324701456793616459/jp-1_1526992263235_do_21250324701456793616459_2.0_spine.ecar`,
                'size': 44707040
              }
            },
            'versionKey': '1526275270333'
          }
        ]
      }
    ],
    'contentDataList': [
      {
        'audience': [
          'Learner'
        ],
        'contentDisposition': 'inline',
        'contentEncoding': 'gzip',
        'contentType': 'TextBookUnit',
        'createdOn': '2018-07-06T11:07:31.001+0000',
        'description': 'ge ew oiuwef oiqjwd oiueoqe qwdg ftrqw tqwfd',
        'dialcodes': [
          '646X5X'
        ],
        'downloadUrl': `https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/
        do_2125409300562001921307/book_1530875410232_do_2125409300562001921307_1.0_spine.ecar`,
        'identifier': 'do_2125409300562001921307',
        'language': [
          'English'
        ],
        'lastPublishedOn': '2018-07-06T11:10:10.213+0000',
        'mimeType': 'application/vnd.ekstep.content-collection',
        'name': 'book',
        'osId': 'org.ekstep.launcher',
        'pkgVersion': '1.0',
        'size': '359155.0',
        'status': 'Live',
        'variants': {
          'spine': {
            'ecarUrl': `https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/
            do_2125409300562001921307/book_1530875410232_do_2125409300562001921307_1.0_spine.ecar`,
            'size': 359155
          }
        },
        'versionKey': '1530875251001'
      },
      {
        'audience': [
          'Learner'
        ],
        'contentDisposition': 'inline',
        'contentEncoding': 'gzip',
        'contentType': 'TextBookUnit',
        'createdOn': '2018-05-14T05:21:10.333+0000',
        'dialcodes': [
          '646X5X'
        ],
        'downloadUrl': `https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/
        do_21250324701456793616459/jp-1_1526992263235_do_21250324701456793616459_2.0_spine.ecar`,
        'identifier': 'do_21250324701456793616459',
        'language': [
          'English'
        ],
        'lastPublishedOn': '2018-05-22T12:31:02.037+0000',
        'mimeType': 'application/vnd.ekstep.content-collection',
        'name': 'JP 1',
        'osId': 'org.ekstep.launcher',
        'pkgVersion': '2.0',
        'size': '4.470704E7',
        'status': 'Live',
        'variants': {
          'spine': {
            'ecarUrl': `https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/
            do_21250324701456793616459/jp-1_1526992263235_do_21250324701456793616459_2.0_spine.ecar`,
            'size': 44707040
          }
        },
        'versionKey': '1526275270333'
      },
      {
        'audience': [
          'Learner'
        ],
        'channel': '012315809814749184151',
        'contentDisposition': 'inline',
        'contentEncoding': 'gzip',
        'contentType': 'TextBookUnit',
        'createdOn': '2018-04-10T05:20:58.274+0000',
        'dialcodes': [
          '646X5X'
        ],
        'downloadUrl': `https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2124791820965806081846/
        unit-1_1523337900939_do_2124791820965806081846_1.0_spine.ecar`,
        'identifier': 'do_2124791820965806081846',
        'language': [
          'English'
        ],
        'lastPublishedOn': '2018-04-10T05:25:00.921+0000',
        'mimeType': 'application/vnd.ekstep.content-collection',
        'name': 'Unit 1',
        'osId': 'org.ekstep.launcher',
        'pkgVersion': '1.0',
        'size': '589598.0',
        'status': 'Live',
        'variants': {
          'spine': {
            'ecarUrl': `https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/
            do_2124791820965806081846/unit-1_1523337900939_do_2124791820965806081846_1.0_spine.ecar`,
            'size': 589598
          }
        },
        'versionKey': '1523337658274'
      }
    ],
    'filterCriteria': {
      'age': 0,
      'contentTypes': [
        'TextBook',
        'TextBookUnit'
      ],
      'facetFilters': [
        {
          'name': 'gradeLevel',
          'values': []
        },
        {
          'name': 'subject',
          'values': []
        },
        {
          'name': 'medium',
          'values': []
        },
        {
          'name': 'contentType',
          'values': [
            {
              'apply': false,
              'count': 3,
              'name': 'textbookunit'
            }
          ]
        },
        {
          'name': 'board',
          'values': []
        }
      ],
      'facets': [
        'board',
        'gradeLevel',
        'subject',
        'medium',
        'contentType'
      ],
      'impliedFilters': [
        {
          'name': 'dialcodes',
          'values': [
            {
              'apply': true,
              'count': 0,
              'name': '646X5X'
            }
          ]
        },
        {
          'name': 'objectType',
          'values': [
            {
              'apply': true,
              'count': 0,
              'name': 'Content'
            }
          ]
        },
        {
          'name': 'status',
          'values': [
            {
              'apply': true,
              'count': 0,
              'name': 'Live'
            }
          ]
        }
      ],
      'limit': 100,
      'offlineSearch': false,
      'offset': 0,
      'query': '',
      'searchType': 'FILTER',
      'sortCriteria': []
    },
    'id': 'api.v1.search',
    'request': {
      'facets': [
        'board',
        'gradeLevel',
        'subject',
        'medium',
        'contentType'
      ],
      'filters': {
        'dialcodes': [
          '646X5X'
        ],
        'objectType': [
          'Content'
        ],
        'status': [
          'Live'
        ],
        'compatibilityLevel': {
          'max': 4,
          'min': 1
        }
      },
      'mode': 'collection',
      'query': '',
      'limit': 100,
      'offset': 0
    },
    'responseMessageId': '58bde9e0-d2a8-11e8-8a94-859f0a619c07'
  },
  // https://staging.open-sunbird.org/dial/CWLUPW
  dialCodeSearchResultWithoutAnyContentAndCollection: {
    'contentDataList': [],
    'id': 'api.v1.search',
    'request': {
      'facets': [
        'board',
        'gradeLevel',
        'subject',
        'medium',
        'contentType'
      ],
      'filters': {
        'dialcodes': [
          'CWLUPW'
        ],
        'contentType': [
          'TextBook',
          'TextBookUnit'
        ],
        'objectType': [
          'Content'
        ],
        'status': [
          'Live'
        ],
        'compatibilityLevel': {
          'max': 4,
          'min': 1
        }
      },
      'mode': 'collection',
      'query': '',
      'limit': 100,
      'offset': 0
    },
    'responseMessageId': 'f6109260-d2a8-11e8-8a94-859f0a619c07'
  },
  contentMock1: {
    identifier: 'do_20868712689121'
  },
  enrolledCourses: [
      {
          contentId: 'do_230868712689121',
          cProgress: 100,
          batch: {
              status: 1
          }
      },
      {
          contentId: 'do_20868712689121',
          cProgress: 90,
          batch: {
              status: 2
          }
      }
  ],
  retiredCourses:  [
        {
            contentId: 'do_20868712689121',
            cProgress: 90,
            batch: {
                status: 2
            }
        }
    ],
    openUpcomingBatchesResponse: {
        result: {
            content: [
                {
                    contentId: 'do_20868712689123123',
                    cProgress: 0,
                    batch: {
                        status: 0
                    },
                }
            ]
        }
    },
    noOpenUpcomingBatchesResponse: {
        result: {
            content: []
        }
    }
};
