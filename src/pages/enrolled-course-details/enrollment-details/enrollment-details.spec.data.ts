import { MimeType, ContentType } from './../../../app/app.constant';

export const mockRes = {
    enrollBatchResponse:
    {
        'message': 'successful',
        'status': true
    },
    connectionFailureResponse:
    {
        'error': 'CONNECTION_ERROR'
    },
    alreadyRegisterredFailureResponse:
    {
        'error': 'USER_ALREADY_ENROLLED_COURSE'
    },
    navigationContent: {
        contentId: 5,
        contentType: ContentType.COURSE,
        mimeType: MimeType.COLLECTION
    },
    navigationContent2: {
        contentId: 5,
        contentType: ContentType.COLLECTION,
        mimeType: MimeType.COLLECTION
    },
    navigationContent3: {
        contentId: 5,
        contentType: ContentType.COLLECTION
    },
    resumeCourse: {
        lastReadContentId: 'do_123',
        status: 1
    },
    resumeCourseFalsy: {
        lastReadContentId: 'do_12345',
        status: 5
    }
};
