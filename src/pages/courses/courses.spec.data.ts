import {ProfileType, UserSource} from 'sunbird';

export const mockRes = {
  getEnrolledCourses:
    { 'message': 'successful', 'result': { 'courses': [{ 'active': true, 'addedBy': 'abc', 'batchId': '1234',
    'contentId': 'do_123', 'courseId': 'do_123', 'courseLogoUrl': 'sampleurl', 'courseName': 'LiveCourse',
    'dateTime': '2018-04-2212: 00: 07: 304+0000', 'description': 'Sampledescription', 'enrolledDate': '2018-04-2212: 00: 07: 304+0000',
    'id': 'axyz', 'identifier': 'xyz', 'lastReadContentStatus': 0, 'leafNodesCount': 4, 'progress': 0, 'status': 0, 'userId': 'xyz' }] } },

  popularCoursesResponse:
  {
    'id': '1234',
    'name': 'Course',
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

  failurepopularCoursesResponse:
  {
    'error': 'COONECTION_ERROR'
  },
  courseConfigFilter: [{ 'name': 'Board',
         'translations': '{\"en\":\"Board\",\"hi\":\"बोर्ड\",\"te\":\"బోర్డు\",\"ta\":\"வாரியம்\",\"mr\":\"बोर्ड\"}',
         'code': 'board', 'index': 1, 'values': [] }, { 'name': 'Subject',
         'translations': '{"en":"Subject","hi":"विषय","te":"పాఠ్యాంశము","ta":"பாடம்","mr":"विषय"}', 'code': 'subject', 'index': 2,
          'values': [] }, { 'name': 'Medium', 'translations': '{"en":"Medium","hi":"माध्यम","te":"మాధ్యమం","ta":"மொழி","mr":"माध्यम"}',
           'code': 'medium', 'index': 3, 'values': [] }],

  appliedFilter: [{ 'name': 'Board', 'translations': '{"en":"Board","hi":"बोर्ड","te":"బోర్డు","ta":"வாரியம்","mr":"बोर्ड"}',
   'code': 'board', 'index': 1, 'values': ['CBSE', 'DSERT'], 'selected': ['CBSE'] }, { 'name': 'Subject',
   'translations': '{"en":"Subject","hi":"विषय","te":"పాఠ్యాంశము","ta":"பாடம்","mr":"विषय"}', 'code': 'subject', 'index': 2,
   'values': ['Accountancy'] }, { 'name': 'Medium',
   'translations': '{"en":"Medium","hi":"माध्यम","te":"మాధ్యమం","ta":"மொழி","mr":"माध्यम"}', 'code': 'medium', 'index': 3,
   'values': ['Assamese', 'Bengali'] }],

  appliedFilterCourse: {'board': ['State (Andhra Pradesh)']},

  filter: { 'board': ['CBSE'] },

  filteredCriteria: { 'name': 'Course', 'filters': { 'board': ['CBSE'] }, 'mode': 'hard' },

  searchQuery:
    '{"request":{"filters":{"contentType":["Collection"],"objectType":["Content"],"status":["Live"]},' +
    '"sort_by":{"me_averageRating":"desc"},"limit":10}}',

  mergedSearchQuery:
    '{"request":{"filters":{"contentType":["Collection"],"objectType":["Content"],"status":["Live"]},' +
    '"sort_by":{"me_averageRating":"desc"},"limit":10,"mode":"soft"}}',

  sampleProfile:
    { handle: 'sample', syllabus: ['NCF'], board: ['CBSE'], grade: ['KG'], subject: ['English'], medium: ['English'],
    profileType: ProfileType.TEACHER, source: UserSource.LOCAL },

  coursePageAssembleCriteria:
    '{"name":"Course","mode":"soft","filter":{"board":["CBSE"],"medium":["English"],"gradeLevel":["KG"],"subject":["English"]}}',

  downloadProgressEventSample1:
    '{"data":{"downloadId":18788,"downloadProgress":10,"identifier":"do_sampele","status":1},"type":"downloadProgress"}',

  downloadProgressEventSample2:
    '{"data":{"downloadId":18788,"downloadProgress":-1,"identifier":"do_sampele","status":1},"type":"downloadProgress"}',

  importCompleteEvent:
    '{"data":{"downloadId":18788,"downloadProgress":-1,"identifier":"do_sample","status":"IMPORT_COMPLETED"},"type":"contentImport"}',

  importContentResponse:
    '{"message":"successful","result":[{"identifier":"do_sample","status":"ENQUEUED_FOR_DOWNLOAD"}]}',

  importReQuest:
    '{"contentImportMap":{"0":{"isChildContent":false,"destinationFolder":"","contentId":"do_sample",' +
    '"correlationData":[]}},"contentStatusArray":[]}',

  failureimportResponse:
    '{"message":"successful","result":[{"identifier":"do_sample","status":"NOT_FOUND"}]}',

  sampleContent:
    '{"identifier":"do_sample"}',

  sampleContentDetailsResponseLocal:
    '{"message":"successful","result":{"identifier":"do_sample","isAvailableLocally":true}}',

  sampleContentDetailsResponseNonLocal:
    '{"message":"successful","result":{"identifier":"do_sample","isAvailableLocally":false}}',

  upgradeAppResponse:
    '{"upgrade":{"type":"force","title":"New version of the App available!","desc":""}}',

  onboardingCompleteResponse:
    '{"isOnBoardingCardCompleted":true}',

  courseUpdate:
    '{"update":{"type":"force","title":"New version of the App available!","desc":""}}',

  onboardingCardProgress:
    '{"cardProgress":10}',
  resumeContent:
    '{"content":{"identifier":"do_sample"}}',
  enrollCourseEvent:
    '{"batchId":"1234"}',

  languageChangeEvent:
    '{"selectedLanguage":"hi"}',



};
