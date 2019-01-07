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

    public static readonly FOR_COURSE_TAB = [
        ContentType.COURSE
    ];
    public static readonly FOR_LIBRARY_TAB = [
        ContentType.STORY,
        ContentType.WORKSHEET,
        ContentType.GAME,
        ContentType.RESOURCE,
        ContentType.COLLECTION,
        ContentType.TEXTBOOK,
        ContentType.LESSON_PLAN
    ];
    public static readonly FOR_PROFILE_TAB = [
        ContentType.STORY,
        ContentType.WORKSHEET,
        ContentType.GAME,
        ContentType.RESOURCE,
        ContentType.COLLECTION,
        ContentType.TEXTBOOK,
        ContentType.LESSON_PLAN,
        ContentType.COURSE
    ];
    public static readonly FOR_DIAL_CODE_SEARCH = [
        ContentType.TEXTBOOK,
        ContentType.TEXTBOOK_UNIT
    ];
    public static readonly FOR_RECENTLY_VIEWED = [
        ContentType.STORY,
        ContentType.WORKSHEET,
        ContentType.GAME,
        ContentType.RESOURCE
    ];
}

export class MimeType {
    public static readonly COLLECTION = 'application/vnd.ekstep.content-collection';
}

export class Search {
    public static readonly FACETS = [
        'board',
        'gradeLevel',
        'subject',
        'medium',
        'contentType'
    ];
}

export class FlagContent {
    public static readonly FLAG_REASONS_VALUE = [
        'Copyright Violation',
        'Inappropriate Content',
        'Privacy Violation',
        'Other'
    ];
    public static readonly FLAG_REASONS_LABLE = [
        'OPTION_COPYRIGHT_VIOLATION',
        'OPTION_INAPPROPRIATE_CONTENT',
        'OPTION_PRIVACY_VIOLATION',
        'OPTION_OTHER'
    ];
}

export class ProfileConstants {
    public static readonly USER_TOKEN = 'userToken';
    public static readonly REQUIRED_FIELDS = [
        'completeness',
        'missingFields',
        'lastLoginTime',
        'topics',
        'organisations',
        'roles'
    ];
}

export class AudienceFilter {
    public static readonly GUEST_TEACHER = ['instructor', 'learner'];
    public static readonly GUEST_STUDENT = ['learner'];

    public static readonly LOGGED_IN_USER = ['instructor', 'learner'];
}

export class EventTopics {
    public static readonly ENROL_COURSE_SUCCESS = 'ENROL_COURSE_SUCCESS';
    public static readonly UNENROL_COURSE_SUCCESS = 'UNENROL_COURSE_SUCCESS';
    public static readonly COURSE_STATUS_UPDATED_SUCCESSFULLY = 'COURSE_STATUS_UPDATED_SUCCESSFULLY';
    public static readonly REFRESH_ENROLL_COURSE_LIST = 'REFRESH_ENROLL_COURSE_LIST';
}

export class ShareUrl {
    public static readonly CONTENT = '/play/content/';
    public static readonly COLLECTION = '/play/collection/';
}

export class MenuOverflow {
    public static readonly MENU_GUEST = ['USERS_AND_GROUPS', 'REPORTS', 'SETTINGS'];
    public static readonly MENU_LOGIN = ['USERS_AND_GROUPS', 'REPORTS', 'SETTINGS', 'LOGOUT'];
}

export class FrameworkConstant {
    public static readonly DEFAULT_FRAMEWORK_ID = 'NCF';
    public static readonly DEFAULT_FRAMEWORK_NAME = 'Common';
}

export class FormConstant {
    public static readonly DEFAULT_SYALLABUS_PATH = 'data/form/syllabus.json';
    public static readonly DEFAULT_SUPPORTED_BOARDS_PATH = 'data/form/supported_boards.json';
    public static readonly DEFAULT_PAGE_COURSE_FILTER_PATH = 'data/form/pageassemble_course_filter.json';
    public static readonly DEFAULT_PAGE_LIBRARY_FILTER_PATH = 'data/form/pageassemble_library_filter.json';
}

export class PreferenceKey {
    public static readonly SELECTED_LANGUAGE_CODE = 'selected_language_code';
    public static readonly SELECTED_LANGUAGE = 'selected_language';
    public static readonly SELECTED_USER_TYPE = 'selected_user_type';
    public static readonly COURSE_IDENTIFIER = 'course_identifier';
    public static readonly IS_ONBOARDING_COMPLETED = 'is_onboarding_settings_completed';
    public static readonly IS_BOOKMARK_VIEWED = 'is_bookmark_viewed';
    public static readonly CONTENT_CONTEXT = 'content_context';
}

export class GenericAppConfig {
    public static readonly DISPLAY_ONBOARDING_CARDS = 'DISPLAY_ONBOARDING_CARDS';
    public static readonly DISPLAY_FRAMEWORK_CATEGORIES_IN_PROFILE = 'DISPLAY_FRAMEWORK_CATEGORIES_IN_PROFILE';
    public static readonly DISPLAY_ONBOARDING_PAGE = 'DISPLAY_ONBOARDING_PAGE';
    public static readonly DISPLAY_SIGNIN_FOOTER_CARD_IN_COURSE_TAB_FOR_TEACHER = 'DISPLAY_SIGNIN_FOOTER_CARD_IN_COURSE_TAB_FOR_TEACHER';
    public static readonly DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_TEACHER = 'DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_TEACHER';
    public static readonly DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_TEACHER = 'DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_TEACHER';
    public static readonly DISPLAY_SIGNIN_FOOTER_CARD_IN_COURSE_TAB_FOR_STUDENT = 'DISPLAY_SIGNIN_FOOTER_CARD_IN_COURSE_TAB_FOR_STUDENT';
    public static readonly DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_STUDENT = 'DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_STUDENT';
    public static readonly DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_STUDENT = 'DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_STUDENT';
    public static readonly TRACK_USER_TELEMETRY = 'TRACK_USER_TELEMETRY';
    public static readonly CONTENT_STREAMING_ENABLED = 'CONTENT_STREAMING_ENABLED';
    public static readonly DISPLAY_ONBOARDING_SCAN_PAGE = 'DISPLAY_ONBOARDING_SCAN_PAGE';
    public static readonly DISPLAY_ONBOARDING_CATEGORY_PAGE = 'DISPLAY_ONBOARDING_CATEGORY_PAGE';
    public static readonly OPEN_RAPDISCOVERY_ENABLED = 'OPEN_RAPDISCOVERY_ENABLED';
    public static readonly SUPPORT_EMAIL = 'SUPPORT_EMAIL';
}

export const appLanguages = [
    {
        label: 'हिंदी',
        code: 'hi',
        isApplied: false,
        name: 'Hindi'
    },
    {
        label: 'English',
        code: 'en',
        isApplied: false,
        name: 'English'
    },
    {
        label: 'मराठी',
        code: 'mr',
        isApplied: false,
        name: 'Marathi'
    },
    {
        label: 'తెలుగు',
        code: 'te',
        isApplied: false,
        name: 'Telugu'
    },
    {
        label: 'தமிழ்',
        code: 'ta',
        isApplied: false,
        name: 'Tamil'
    },
    {
        label: 'ಕನ್ನಡ',
        code: 'kn',
        isApplied: false,
        name: 'Kannada'
    },
    {
        label: 'اردو',
        code: 'ur',
        isApplied: false,
        name: 'Urdu'
    }
];

export class PageName {
    public static readonly RESOURCE = 'Resource';
    public static readonly COURSE = 'Course';
    public static readonly DIAL_CODE = 'DIAL Code Consumption';
}

export class XwalkConstants {
    public static readonly APP_ID = 'org.xwalk.core';
}

export class ContentCard {
    public static readonly LAYOUT_INPROGRESS = 'InProgress';
    public static readonly LAYOUT_POPULAR = 'Popular';
    public static readonly LAYOUT_SAVED_CONTENT = 'SavedContent';
}

export class ViewMore {
    public static readonly PAGE_COURSE_ENROLLED = 'course.EnrolledCourses';
    public static readonly PAGE_COURSE_POPULAR = 'course.PopularContent';
    public static readonly PAGE_RESOURCE_SAVED = 'resource.SavedResources';
    public static readonly PAGE_RESOURCE_RECENTLY_VIEWED = 'resource.RecentlyViewed';
}
