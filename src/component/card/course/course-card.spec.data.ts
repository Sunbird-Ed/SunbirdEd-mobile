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
