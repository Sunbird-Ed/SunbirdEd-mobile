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
        + '"skills":[{"skillName":"Maths","addedBy":"0b5b8cf8-a1b6-41d9-862d-ebc242f0b962"}],'
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

    visibilityResMock: '{"message":"successful","status":true}'
};
