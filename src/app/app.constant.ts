import * as frameworkDataList from "../config/framework.filters";

export class ContentType {
    public static readonly STORY = 'Story';
    public static readonly WORKSHEET = 'Worksheet';
    public static readonly GAME = 'Game';
    public static readonly RESOURCE = 'Resource';
    public static readonly COLLECTION = 'Collection';
    public static readonly TEXTBOOK = 'TextBook';
    public static readonly LESSON_PLAN = 'LessonPlan';
    public static readonly COURSE = 'Course';
    public static readonly TEXTBOOK_UNIT = 'TextBookUnit';
    public static readonly LESSON_PLAN_UNIT = 'LessonPlanUnit';
    public static readonly COURSE_UNIT = 'CourseUnit';

    public static readonly FOR_LIBRARY_TAB = [ContentType.STORY,
    ContentType.WORKSHEET, ContentType.GAME,
    ContentType.RESOURCE, ContentType.COLLECTION,
    ContentType.TEXTBOOK, ContentType.LESSON_PLAN];
    public static readonly FOR_COURSE_TAB = [ContentType.COURSE];
    public static readonly FOR_DIAL_CODE_SEARCH = [ContentType.TEXTBOOK, ContentType.TEXTBOOK_UNIT];
}

export class MimeType {
    public static readonly COLLECTION = 'application/vnd.ekstep.content-collection';
}

export class Search {
    public static readonly FACETS = ['board', 'gradeLevel', 'subject', 'medium', 'contentType'];
}

export class FlagContent {
    public static readonly FLAG_REASONS_VALUE = ['Copyright Violation', 'Inappropriate Content', 'Privacy Violation', 'Other'];
    public static readonly FLAG_REASONS_LABLE = ['OPTION_COPYRIGHT_VIOLATION', 'OPTION_INAPPROPRIATE_CONTENT', 'OPTION_PRIVACY_VIOLATION', 'OPTION_OTHER'];
}

export class ProfileConstants {
    public static readonly USER_TOKEN = 'userToken';
    public static readonly REQUIRED_FIELDS = ['completeness', 'missingFields', 'lastLoginTime', 'topics'];
}

export class PageFilterConstants {
    public static readonly COURSE_FILTER = [
        {
            name: "board",
            displayName: "BOARD",
            values: []
        },
        {
            name: "subject",
            displayName: "SUBJECT",
            values: []

        },
        {
            name: "medium",
            displayName: "MEDIUM",
            values: []
        }
    ];

    public static readonly RESOURCE_FILTER = [
        {
            name: "board",
            displayName: "BOARD",
            values: []
        },
        {
            name: "gradeLevel",
            displayName: "CLASS",
            values: []
        },
        {
            name: "subject",
            displayName: "SUBJECT",
            values: []

        },
        {
            name: "medium",
            displayName: "MEDIUM",
            values: []

        },
        {
            name: "contentType",
            displayName: "RESOURCE_TYPE",
            values: frameworkDataList.contentTypeList.sort()
        }
    ];
}

export class AudienceFilter {

    // TODO : Check with Anil for TEACHER & LOGGED_IN_USER values
    public static readonly GUEST_TEACHER = ["instructor", "learner"];
    public static readonly GUEST_STUDENT = ["learner"];

    public static readonly LOGGED_IN_USER = ["instructor", "learner"];
}

export class EventTopics {
    public static readonly ENROL_COURSE_SUCCESS = 'ENROL_COURSE_SUCCESS';
    public static readonly COURSE_STATUS_UPDATED_SUCCESSFULLY = 'COURSE_STATUS_UPDATED_SUCCESSFULLY';
}

export class ShareUrl {
    public static readonly CONTENT = '/play/content/';
    public static readonly COLLECTION = '/play/collection/';
}