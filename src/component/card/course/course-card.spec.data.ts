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
    }
}