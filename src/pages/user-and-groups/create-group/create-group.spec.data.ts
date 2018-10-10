export const mockCreateorremoveGroupRes = {

    viewLoadEvent: {
        isUploading: false
    },

    sessionMock: {
        'access_token': 'some vaild accesstoken',
        'refresh_token': 'some refresh token',
        'userToken': '68777b59'
    },

    syllabusListMock:
        [
            {
                code: 'ap_k-12_13',
                name: 'State (Andhra Pradesh)'
            }
        ],

    syllabusList:
        [
            {
                'text': 'State (Andhra Pradesh)',
                'value': 'ap_k-12_13',
                'checked': true
            },
            {
                'text': 'State (Maharashtra)',
                'value': 'mh_k-12_15',
                'checked': false
            }]
};
