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
    public static readonly FACETS_ETB = [
        'subject'
    ];

    public static readonly FACETS = [
        'board',
        'gradeLevel',
        'subject',
        'medium',
        'resourceType'
    ];

    public static readonly FACETS_COURSE = [
        'topic',
        'purpose',
        'gradeLevel',
        'subject',
        'medium',
        'contentType',
        'channel'
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

export class BatchConstants {
    public static readonly REQUIRED_FIELDS = [
        'endDate',
        'description',
        'name',
        'enrollmentType',
        'hashTagId',
        'startDate',
        'courseId',
        'status',
        'createdBy',
        'creatorFirstName',
        'creatorLastName',
        'identifier',
        'id'
    ];
    // createdFor ,courseAdditionalInfo, participant, updatedDate, createdDate, courseCreator, mentors
}

export class ProfileConstants {
    public static readonly USER_TOKEN = 'userToken';
    public static readonly REQUIRED_FIELDS = [
        'completeness',
        'missingFields',
        'lastLoginTime',
        'topics',
        'organisations',
        'roles',
        'locations'
    ];

    public static readonly CONTACT_TYPE_PHONE = 'phone';
    public static readonly CONTACT_TYPE_EMAIL = 'email';
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
    public static readonly PLAYER_CLOSED = 'PLAYER_CLOSED';
}

export class ShareUrl {
    public static readonly CONTENT = '/play/content/';
    public static readonly COLLECTION = '/play/collection/';
}

export class MenuOverflow {
    public static readonly MENU_GUEST = ['USERS_AND_GROUPS', 'REPORTS', 'SETTINGS'];
    public static readonly MENU_LOGIN = ['USERS_AND_GROUPS', 'REPORTS', 'SETTINGS', 'LOGOUT'];
    public static readonly DOWNLOAD_FILTERS = ['CONTENT_SIZE', 'LAST_VIEWED'];
}

export class SideMenu {
    public static readonly MENU_GUEST = ['USERS_AND_GROUPS', 'REPORTS', 'LANGUAGE', 'SETTINGS'];
    public static readonly MENU_LOGIN = ['USERS_AND_GROUPS', 'REPORTS', 'LANGUAGE', 'SETTINGS', 'LOGOUT'];
}

export class FormConstant {
    public static readonly DEFAULT_PAGE_COURSE_FILTER_PATH = 'data/form/pageassemble_course_filter.json';
    public static readonly DEFAULT_PAGE_LIBRARY_FILTER_PATH = 'data/form/pageassemble_library_filter.json';
}

export class PreferenceKey {
    public static readonly SELECTED_LANGUAGE_CODE = 'sunbirdselected_language_code';
    public static readonly SELECTED_LANGUAGE = 'sunbirdselected_language';
    public static readonly SELECTED_USER_TYPE = 'sunbirdselected_user_type';
    public static readonly COURSE_IDENTIFIER = 'sunbirdcourse_identifier';
    public static readonly IS_ONBOARDING_COMPLETED = 'sunbirdis_onboarding_settings_completed';
    public static readonly IS_BOOKMARK_VIEWED = 'sunbirdis_bookmark_viewed';
    public static readonly CONTENT_CONTEXT = 'sunbirdcontent_context';
    public static readonly GUEST_USER_ID_BEFORE_LOGIN = 'sunbirdGUEST_USER_ID_BEFORE_LOGIN';
    public static readonly KEY_SUNBIRD_SUPPORT_FILE_PATH = 'sunbirdsunbird_support_file_path';
    public static readonly KEY_DATA_SYNC_TYPE = 'sunbirdsync_config';
    public static readonly KEY_DATA_SYNC_TIME = 'sunbirddata_sync_time';
    public static readonly APP_LOGO = 'app_logo';
    public static readonly APP_NAME = 'app_name';
    public static readonly APP_RATING_DATE = 'app_rating_date';
    public static readonly APP_RATE_LATER_CLICKED = 'app_rate_later_clicked';
    public static readonly APP_RATING_POPUP_APPEARED = 'app_rating_popup_appeared';
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
    public static readonly VERSION_NAME = 'VERSION_NAME';
    public static readonly VERSION_CODE = 'VERSION_CODE';
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

export class CardSectionName {
    public static readonly SECTION_SAVED_RESOURCES = 'Saved Resources';
    public static readonly SECTION_RECENT_RESOURCES = 'Recently Viewed';
}

export class ViewMore {
    public static readonly PAGE_COURSE_ENROLLED = 'course.EnrolledCourses';
    public static readonly PAGE_COURSE_POPULAR = 'course.PopularContent';
    public static readonly PAGE_RESOURCE_SAVED = 'resource.SavedResources';
    public static readonly PAGE_RESOURCE_RECENTLY_VIEWED = 'resource.RecentlyViewed';
}

export class Location {
    public static readonly TYPE_STATE = 'state';
    public static readonly TYPE_DISTRICT = 'district';
}

export class FrameworkCategory {
    public static readonly BOARD = 'board';
    public static readonly MEDIUM = 'medium';
    public static readonly GRADE_LEVEL = 'gradeLevel';
    public static readonly SUBJECT = 'subject';
    public static readonly TOPIC = 'topic';
    public static readonly PURPOSE = 'purpose';

    public static readonly DEFAULT_FRAMEWORK_CATEGORIES = [
        FrameworkCategory.BOARD,
        FrameworkCategory.MEDIUM,
        FrameworkCategory.GRADE_LEVEL,
        FrameworkCategory.SUBJECT
    ];

    public static readonly COURSE_FRAMEWORK_CATEGORIES = [
        FrameworkCategory.TOPIC,
        FrameworkCategory.PURPOSE,
        FrameworkCategory.MEDIUM,
        FrameworkCategory.GRADE_LEVEL,
        FrameworkCategory.SUBJECT
    ];
}

export class SystemSettingsIds {
    public static readonly CUSTODIAN_ORG_ID = 'custodianOrgId';
    public static readonly COURSE_FRAMEWORK_ID = 'courseFrameworkId';
    public static readonly CONTENT_COMING_SOON_MSG = 'contentComingSoonMsg';
    public static readonly CONSUMPTION_FAQS = 'consumptionFaqs';
}

export class StoreRating {
    public static readonly DATE_DIFF = 2;
    public static readonly APP_MIN_RATE = 4;
    public static readonly FOLDER_NAME = 'sunbird-app-rating';
    public static readonly FILE_NAME = 'app-rating.doc';
    public static readonly FILE_TEXT = 'APP-Rating';
    public static readonly RETURN_CLOSE = 'close';
    public static readonly RETURN_HELP = 'help';
    public static readonly DEVICE_FOLDER_PATH = cordova.file.dataDirectory;
}
export class ContentConstants {
    public static readonly DEFAULT_LICENSE = 'CC BY 4.0';
    public static readonly COMING_SOON_MSG = 'comingSoonMsg';
}

