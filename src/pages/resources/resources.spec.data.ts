import { ProfileType, ProfileSource } from 'sunbird-sdk';

export const mockRes = {
  pageAPIResponse:
  {
    'id': '0122838911932661768',
    'name': 'Resource',
    'sections': '[{"display":"{\\"name\\":{\\"en\\":\\"Popular Books\\"}}","count":53.0,"index":1.0,"sectionDataType":"content",' +
    '"resmsgId":"dd4ace40-89a0-11e8-874f-41af3bfb0b28","contents":[{"subject":"Tamil","channel":"012315809814749184151",' +
    '"downloadUrl":"https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123666638113996801182/' +
    'm1_1526991604639_do_2123666638113996801182_2.0_spine.ecar","language":["Tamil"],"mimeType":"application/' +
    'vnd.ekstep.content-collection","variants":{"spine":{"ecarUrl":"https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/' +
    'ecar_files/do_2123666638113996801182/m1_1526991604639_do_2123666638113996801182_2.0_spine.ecar","size":596405.0}},' +
    '"objectType":"Content","gradeLevel":["Class 5","Class 6"],"appIcon":"https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/' +
    'content/do_2123666638113996801182/artifact/bingwallpaper-2017-10-24_1508999948075.thumb.jpg",' +
    '"children":["do_2123610485389475841501"],"appId":"sunbird_portal","me_totalRatings":0.0,"contentEncoding":"gzip",' +
    '"mimeTypesCount":"{\\"application/vnd.ekstep.content-collection\\":1,\\"video/x-youtube\\":1}","contentType":"TextBook",' +
    '"identifier":"do_2123666638113996801182","lastUpdatedBy":"68777b59-b28b-4aee-88d6-50d46e4c3509","audience":["Learner"],' +
    '"visibility":"Default","toc_url":"https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123666638113996801182/' +
    'artifact/do_2123666638113996801182toc.json","contentTypesCount":"{\\"Resource\\":1,\\"Collection\\":1}",' +
    '"consumerId":"fa271a76-c15a-4aa1-adff-31dd04682a1f","author":"bhv","childNodes":["do_2123610485389475841501",' +
    '"do_212305836974661632137"],"mediaType":"content","osId":"org.ekstep.quiz.app","graph_id":"domain","nodeType":"DATA_NODE",' +
    '"lastPublishedBy":"68777b59-b28b-4aee-88d6-50d46e4c3509","prevState":"Live","concepts":["BIO10100","SC10"],"size":596405.0,' +
    '"lastPublishedOn":"2018-05-22T12:20:04.607+0000","IL_FUNC_OBJECT_TYPE":"Content","name":"m1","status":"Live",' +
    '"code":"do_2123666638113996801182","description":"jbh","medium":"English","idealScreenSize":"normal",' +
    '"posterImage":"https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123617275696988161213/artifact/' +
    'bingwallpaper-2017-10-24_1508999948075.jpg","createdOn":"2017-11-02T06:01:56.040+0000","me_totalSideloads":0.0,' +
    '"me_totalComments":0.0,"contentDisposition":"inline","lastUpdatedOn":"2018-05-22T12:20:04.465+0000","SYS_INTERNAL_LAST_UPDATED_ON":' +
    '"2018-05-22T12:20:05.171+0000","me_totalDownloads":2.0,"creator":"CreatoUse",' +
    '"createdFor":["01232002070124134414","012315809814749184151"],"IL_SYS_NODE_TYPE":"DATA_NODE","os":["All"],"pkgVersion":2.0,' +
    '"versionKey":"1526991604465","idealScreenDensity":"hdpi","s3Key":"ecar_files/do_2123666638113996801182/' +
    'm1_1526991604639_do_2123666638113996801182_2.0_spine.ecar","lastSubmittedOn":"2017-11-02T06:04:17.268+0000","me_averageRating":0.0,' +
    '"createdBy":"2aade7d9-6abf-433b-9a05-3b02cd2eb664","compatibilityLevel":1.0,"leafNodesCount":1.0,' +
    '"IL_UNIQUE_ID":"do_2123666638113996801182","board":"State (Uttar Pradesh)","resourceType":"Book","node_id":0.0}],"searchQuery":' +
    '"{\\"request\\":{\\"filters\\":{\\"contentType\\":[\\"TextBook\\"],\\"objectType\\":[\\"Content\\"],\\"status\\":[\\"Live\\"]},' +
    '\\"sort_by\\":{\\"me_averageRating\\":\\"desc\\"},\\"limit\\":10}}","name":"Popular Books","id":"01250645302690611294",' +
    '"apiId":"api.content.search","group":1.0}]'
  },

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
    ]
    ,
  successResponse: {
    'message': 'successful',
    'result': [],
    'status': true
  },
  tabchange: {
    'type': 'tab.change',
    'data': 'LIBRARY'
  },
  updateLocalContents:
    '{"update":"UpdateLocalContents"}',
  languageChangeEvent:
    '{"selectedLanguage":"hi"}',
  onboardingCompleteResponse:
    '{"isOnBoardingCardCompleted":true}',
  upgradeAppResponse:
    '{"upgrade":{"type":"force","title":"New version of the App available!","desc":""}}',

    sampleProfile: {
      handle: 'sample',
      syllabus: ['NCF'],
      board: ['CBSE'],
      grade: ['KG'],
      subject: ['English'],
      medium: ['English'],
      profileType: ProfileType.TEACHER,
      source: ProfileSource.LOCAL,
      uid: '86d38a0a-fd00-4076-861d-b4c634a4d353',
  },

  libraryConfigFilter: [{ 'name': 'Board', 'translations': '{"en":"Board","hi":"बोर्ड","te":"బోర్డు","ta":"வாரியம்",' +
  '"mr":"बोर्ड"}', 'code': 'board', 'index': 1, 'values': [] }, { 'name': 'Subject', 'translations': '{"en":"Subject",' +
  '"hi":"विषय","te":"పాఠ్యాంశము","ta":"பாடம்","mr":"विषय"}', 'code': 'subject', 'index': 2, 'values': [] },
  { 'name': 'Medium', 'translations': '{"en":"Medium","hi":"माध्यम","te":"మాధ్యమం","ta":"மொழி","mr":"माध्यम"}',
  'code': 'medium', 'index': 3, 'values': [] }],

  appliedFilter: [{ 'name': 'Board', 'translations': '{"en":"Board","hi":"बोर्ड","te":"బోర్డు","ta":"வாரியம்","mr":"बोर्ड"}',
  'code': 'board', 'index': 1, 'values': ['CBSE', 'DSERT'], 'selected': ['CBSE'] }, { 'name': 'Subject',
  'translations': '{"en":"Subject","hi":"विषय","te":"పాఠ్యాంశము","ta":"பாடம்","mr":"विषय"}', 'code': 'subject',
  'index': 2, 'values': ['Accountancy'] }, { 'name': 'Medium',
  'translations': '{"en":"Medium","hi":"माध्यम","te":"మాధ్యమం","ta":"மொழி","mr":"माध्यम"}', 'code': 'medium',
  'index': 3, 'values': ['Assamese', 'Bengali'] }],

  appliedFilterLibrary: { 'board': ['State (Andhra Pradesh)'] },

  filter: { 'board': ['CBSE'] },

  filteredCriteria: { 'name': 'Course', 'filters': { 'board': ['CBSE'] }, 'mode': 'hard' },

  queryParams: { 'request': { 'filters': { 'contentType': ['TextBook'], 'objectType': ['Content'],
  'status': ['Live'], 'board': ['State (Andhra Pradesh)'], 'medium': ['English'], 'gradeLevel': ['Class 6'] },
  'sort_by': { 'me_averageRating': 'desc' }, 'limit': 10, 'mode': 'soft' } },

  queryParamsAfterFilter: { 'request': { 'filters': { 'contentType': ['TextBook'], 'objectType': ['Content'],
  'status': ['Live'], 'board': ['State (Andhra Pradesh)'], 'medium': ['English'], 'gradeLevel': ['Class 6'] },
  'sort_by': { 'me_averageRating': 'desc' }, 'limit': 10 , 'mode': 'soft'} },

  profile: {
    'uid': '86d38a0a-fd00-4076-861d-b4c634a4d353',
    'handle': 'Vivek',
    'createdAt': 1560864266,
    'medium': ['english'],
    'board': ['stateandhrapradesh'],
    'subject': ['english'],
    'profileType': ProfileType.TEACHER,
    'grade': ['class6'],
    'syllabus': ['ap_k-12_13'],
    'source': ProfileSource.LOCAL,
    'gradeValue': {
        'class6': 'Class 6'
    },
},

appliedFilterBooks: {
  'board': ['State (Andhra Pradesh)'],
  'gradeLevel': ['Class 6']
},

  importCompleteEvent:
    '{"data":{"downloadId":18788,"downloadProgress":-1,"identifier":"do_sample","status":"IMPORT_COMPLETED"},"type":"contentImport"}',

    categoryMediumsParam: [{
      name: 'english'
  }],

  categoryGradeParam: {
    terms: [{
        name: 'class 4'
    }]
}

};
