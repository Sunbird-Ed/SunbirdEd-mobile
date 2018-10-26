export const mockProfileRes = {

    viewLoadEvent: {
        isUploading: false
    },

    sessionMock: {
        'access_token': 'mLS2rHUKCdx_FXBfYjM7MPil3U2TcXocteHwGjQPuwSAsBhM4b1FFvIwitSLl2SiaqBenITY5ll-3340Tvg',
        'refresh_token': 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiS1bXp6OoKTGwMmDAl8yTFpJPsWg',
        'userToken': '68777b59-b28b-4aee-88d6-50d46e4c3509'
    },

    profileDetailsMock: '{"missingFields":["jobProfile","gender","subject","avatar","dob","grade","location"],'
        + '"webPages":[],"profileVisibility":[{"profileSummary":"public"}],'
        + '"education":[{"yearOfPassing":0.0,"degree":"Test","userId":"0b5b8cf8-a1b6-41d9-862d-ebc242f0b962",'
        + '"createdDate":"2018-09-11 12:58:45:261+0000","isDeleted":false,"createdBy":"0b5b8cf8-a1b6-41d9-862d-ebc242f0b962",'
        + '"percentage":0.0,"name":"Test","id":"01258840863834112080"}],"subject":[],"channel":"sunbird-staging",'
        + '"language":["Marathi","English"],"updatedDate":"2018-09-11 12:58:45:254+0000","completeness":57.0,'
        + '"skills":[{"skillName":"Maths","addedBy":"0b5b8cf8-a1b6-41d9-862d-ebc242f0b962"},'
        + '{"skillName":"Maths","addedBy":"0b5b8cf8-a1b6-41d9-862d-ebc242f0b962"}],'
        + '"id":"0b5b8cf8-a1b6-41d9-862d-ebc242f0b962","identifier":"0b5b8cf8-a1b6-41d9-862d-ebc242f0b962",'
        + '"profileVisibility":{"address":"private","phone":"private","email":"private"},'
        + '"updatedBy":"0b5b8cf8-a1b6-41d9-862d-ebc242f0b962","jobProfile":[],"externalIds":[],'
        + '"rootOrgId":"0125134851644620800","firstName":"Vivek","phone":"******5680","grade":[],"status":1.0,'
        + '"lastName":"kasture","roles":["PUBLIC"],"badgeAssertions":[],"isDeleted":false,'
        + '"organisations":[{"organisationId":"0125134851644620800","roles":["PUBLIC"],'
        + '"userId":"0b5b8cf8-a1b6-41d9-862d-ebc242f0b962","isDeleted":false,"hashTagId":"0125134851644620800",'
        + '"id":"01258839289689702427","orgjoindate":"2018-09-11 12:28:49:025+0000"}],"email":"vi***********@techjoomla.com",'
        + '"rootOrg":{"preferredLanguage":"English","channel":"sunbird-staging",'
        + '"description":"default user will be associated with this","orgCode":"defaultRootOrg","id":"0125134851644620800",'
        + '"slug":"sunbird-staging","identifier":"0125134851644620800","orgName":"defaultRootOrg","locationIds":[],'
        + '"isRootOrg":true,"rootOrgId":"0125134851644620800","contactDetail":[],"createdDate":"2018-05-28 16:23:38:330+0000",'
        + '"createdBy":"8217108a-6931-491c-9009-1ae95cb0477f","hashTagId":"0125134851644620800","status":1.0},'
        + '"address":[{"city":"Pune","userId":"0b5b8cf8-a1b6-41d9-862d-ebc242f0b962","zipcode":"411038","addType":"permanent",'
        + '"createdDate":"2018-09-11 12:31:06:127+0000","createdBy":"0b5b8cf8-a1b6-41d9-862d-ebc242f0b962","addressLine1":"Kothrud",'
        + '"id":"01258839358232166429"}],"profileSummary":"The hasOwnProperty() method returns a boolean indicating'
        + ' whether the object has the specified property as its own property (as opposed to inheriting it).","topics":[],'
        + '"userName":"vivek","userId":"0b5b8cf8-a1b6-41d9-862d-ebc242f0b962","emailVerified":false,'
        + '"lastLoginTime":1.536669035858E12,"createdDate":"2018-09-11 12:28:49:017+0000",'
        + '"createdBy":"659b011a-06ec-4107-84ad-955e16b0a48a"}',

    eduDetailsMock: {
        createdBy: '0b5b8cf8-a1b6-41d9-862d-ebc242f0b962',
        createdDate: '2018-09-11 12:58:45:261+0000',
        degree: 'Test',
        id: '01258840863834112080',
        isDeleted: false,
        name: 'Test',
        percentage: 0,
        userId: '0b5b8cf8-a1b6-41d9-862d-ebc242f0b962',
        yearOfPassing: 0
    },

    addressMock: {
        city: 'Pune',
        addressLine1: 'Kothrud',
        addType: 'permanent',
        createdDate: '2018-09-11 12:31:06:127+0000',
        id: '01258839358232166429',
        userId: '0b5b8cf8-a1b6-41d9-862d-ebc242f0b962',
        zipcode: '411038'
    },

    contentReqMock: {
        contentTypes: ['story', 'worksheet', 'game', 'collection', 'textBook', 'lessonPlan', 'resource'],
        createdBy: ['27c12b88-3e98-47de-b805-c72b43db4e9a']
    },

    contentSearchMock: '{"message":"successful","result":{"contentDataList":[],"id":"api.v1.search",'
        + '"request":{"filters":{"contentType":["story","worksheet","game","collection","textBook","lessonPlan","resource"],'
        + '"objectType":["Content"],"createdBy":["27c12b88-3e98-47de-b805-c72b43db4e9a"],"status":["Live"],'
        + '"compatibilityLevel":{"max":4,"min":1}},"query":"","limit":20,"offset":0},'
        + '"responseMessageId":"02c44a80-b669-11e8-9001-81918790455e"},"status":true}',

    endorseReqMock: {
        skills: ['.GFHJKL'],
        userId: '2f996f21-ff4d-489c-94ec-72f30ef10b4c'
    },

    endorseResMock: '{"message":"successful","status":true}',

    visibilityReqMock: {
        privateFields: ['profileSummary'],
        publicFields: [],
        userId: '0b5b8cf8-a1b6-41d9-862d-ebc242f0b962'
    },

    visibilityResMock: '{"message":"successful","status":true}',
    option : {
        'userId': '659b011a-06ec-4107-84ad-955e16b0a48a',
        'refreshEnrolledCourses': true,
        'returnRefreshedEnrolledCourses': true
      },
    getEnrolledCourses : {
        'message': 'successful',
        'result': {
            'courses': [{
                    'active': true,
                    'addedBy': '659b011a-06ec-4107-84ad-955e16b0a48a',
                    'batchId': '01253535028937523240',
                    'contentId': 'do_21253534443347968011561',
                    'courseId': 'do_21253534443347968011561',
                    'courseLogoUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content',
                    'courseName': 'RF Course 4',
                    'dateTime': '2018-07-04 09:31:22:294+0000',
                    'description': 'Untitled Collection',
                    'enrolledDate': '2018-06-29 07:08:12:876+0000',
                    'id': '0784a9dd0a03d157513267dbd701a875e575d969ecad7dac4d38872c68e708e9',
                    'identifier': '0784a9dd0a03d157513267dbd701a875e575d969ecad7dac4d38872c68e708e9',
                    'lastReadContentId': 'do_21253529011637452811543',
                    'lastReadContentStatus': 1,
                    'leafNodesCount': 3,
                    'progress': 0,
                    'status': 2,
                    'userId': '659b011a-06ec-4107-84ad-955e16b0a48a'
                },
                {
                    'active': true,
                    'addedBy': '659b011a-06ec-4107-84ad-955e16b0a48a',
                    'batchId': '01252959167688704035',
                    'contentId': 'do_21252958806734438412332',
                    'courseId': 'do_21252958806734438412332',
                    'courseLogoUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com',
                    'courseName': 'TestOrg2',
                    'dateTime': '2018-06-28 13:33:01:032+0000',
                    'description': 'cjbejwnckewnkcew',
                    'enrolledDate': '2018-06-20 10:41:16:600+0000',
                    'id': '53552055f3fbc9078842134f2e2ae72424fcfedd5de8b1d93cadc69d4c280058',
                    'identifier': '53552055f3fbc9078842134f2e2ae72424fcfedd5de8b1d93cadc69d4c280058',
                    'lastReadContentId': 'do_21252951528461926412265',
                    'lastReadContentStatus': 1,
                    'leafNodesCount': 5,
                    'progress': 2,
                    'status': 2,
                    'userId': '659b011a-06ec-4107-84ad-955e16b0a48a'
                }
            ]
        },
        'status': true
    },
    trainingsCompleted : [{
        'active': true,
        'addedBy': '659b011a-06ec-4107-84ad-955e16b0a48a',
        'batchId': '01243478051228876844',
        'contentId': 'do_2124347714236497921124',
        'courseId': 'do_2124347714236497921124',
        'courseLogoUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/con',
        'courseName': 'Course-feb06',
        'dateTime': '2018-02-06 11:35:54:672+0000',
        'description': 'By KS',
        'enrolledDate': '2018-02-06 11:35:20:172+0000',
        'id': '2d01cc192aed68d7daf92802e7a5d09bb021abd48443f404ca2259f1967264ab',
        'identifier': '2d01cc192aed68d7daf92802e7a5d09bb021abd48443f404ca2259f1967264ab',
        'lastReadContentId': 'do_2123618302937989121631',
        'lastReadContentStatus': 2,
        'leafNodesCount': 1,
        'progress': 1,
        'status': 2,
        'userId': '659b011a-06ec-4107-84ad-955e16b0a48a'
     },
     {
        'active' : true,
        'addedBy' : '659b011a-06ec-4107-84ad-955e16b0a48a',
        'batchId' : '012463788537749504399',
        'contentId' : 'do_2124637836969656321631',
        'courseId' : 'do_2124637836969656321631',
        'courseLogoUrl' : 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.',
        'courseName' : 'Test create course dashboard',
        'dateTime' : '2018-03-20 09:24:16:101+0000',
        'description' : 'testing',
        'enrolledDate' : '2018-03-19 11:22:12:894+0000',
        'id' : 'dd5e1fc0ce01f63cd35f47dac40d2584372a5ddf8094360f8c6cc5514e567d93',
        'identifier' : 'dd5e1fc0ce01f63cd35f47dac40d2584372a5ddf8094360f8c6cc5514e567d93',
        'lastReadContentId' : 'do_2123229897847357441455',
        'lastReadContentStatus' : 2,
        'leafNodesCount' : 1,
        'progress' : 1,
        'status' : 2,
        'userId' : '659b011a-06ec-4107-84ad-955e16b0a48a'
     }]
};
