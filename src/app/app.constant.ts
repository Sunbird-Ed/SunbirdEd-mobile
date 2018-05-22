export class ContentType {
    public static readonly STORY = 'Stroy';
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