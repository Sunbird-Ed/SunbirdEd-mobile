import { MimeType, ContentType } from './../../../app/app.constant';

export const mockRes = {
    contentCardDetails: {
        contentType: ContentType.RESOURCE
    },
    enrolledCourseDetails: {
        contentType: ContentType.COURSE
    },
    collectionDetails: {
        mimeType: MimeType.COLLECTION
    },
    contentDetails: {
        identifier: ''
    },
    resumeCourse: {
        lastReadContentId: 'do_123',
        status: 1
    },
    resumeCourseFalsy: {
        lastReadContentId: 'do_12345',
        status: 5
    },
    navigationContent: {
        contentId: 5,
        contentType: ContentType.COURSE,
        mimeType: MimeType.COLLECTION
    }
};
