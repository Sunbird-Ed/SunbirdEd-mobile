export const mockRes = {
    getOngoingBatchesResponse:
    {'message': 'successful',
    'result':  {'content': [{'courseAdditionalInfo':  {'courseName': 'Sample course', 'leafNodesCount': '2',
    'description': 'ByKS', 'courseLogoUrl': '', 'tocUrl': '', 'status': 'Live'}, 'courseCreator': '', 'courseId': 'do_123',
    'createdBy': 'xyx', 'createdDate': '2018-08-1807: 36: 01: 967+0000', 'createdFor': ['012'], 'creatorFirstName': 'xxx',
    'creatorLastName': '', 'description': 'BykS', 'endDate': '2018-08-19', 'enrollmentType': 'invite-only', 'hashTagId': '012571',
    'id': '123', 'identifier': '123', 'mentors': [], 'name': 'Aug18', 'participant':  {}, 'startDate': '2018-08-18',
    'status': 1, 'updatedDate': '2018-08-1808: 00: 00: 760+0000'}], 'count': 1}, 'status': true},

    getUpcomingBatchesResponse:
    {'message': 'successful',
    'result':  {'content': [{'courseAdditionalInfo':  {'courseName': 'Sample course', 'leafNodesCount': '2',
    'description': 'ByKS', 'courseLogoUrl': '', 'tocUrl': '', 'status': 'Live'}, 'courseCreator': '', 'courseId': 'do_123',
    'createdBy': 'xyx', 'createdDate': '2018-08-1807: 36: 01: 967+0000', 'createdFor': ['012'], 'creatorFirstName': 'xxx',
    'creatorLastName': '', 'description': 'BykS', 'endDate': '2018-08-19', 'enrollmentType': 'invite-only',
    'hashTagId': '012571', 'id': '123', 'identifier': '123', 'mentors': [], 'name': 'Aug18', 'participant':  {},
    'startDate': '2018-08-18', 'status': 0, 'updatedDate': '2018-08-1808: 00: 00: 760+0000'}], 'count': 1}, 'status': true},

    enrollBatchResponse:
    {'message': 'successful', 'status': true},

    sessionResponse:
    {'userToken': 'sample_user_token'},

    connectionFailureResponse:
    {'error': 'CONNECTION_ERROR'},

    alreadyRegisterredFailureResponse:
    {'error': 'USER_ALREADY_ENROLLED_COURSE'},
  };
