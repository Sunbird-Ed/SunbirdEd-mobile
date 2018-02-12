export class ContentDetailRequest {

    contentId: string;
    attachFeedback: boolean;
    attachContentAccess: boolean;
    refreshContentDetails: boolean;
}

export class ContentListingCriteria {

    contentListingId: string;
    uid: string;
    language: string;
    subject: string;
    age: number;
    grade: number;
    medium: string;
    board: string;
    did: string;
    audience: Array<string>;
    channel: Array<string>;
    facets: Array<string>;
}

export class FilterValue {
    name: string;
    count: number;
    apply: boolean;
}

export class ContentSearchFilter {
    name: string;
    values: Array<FilterValue>;
}

export enum SearchType {
    SEARCH = "search",
    FILTER = "filter",
}

export class ContentSearchCriteria {

    query: string;
    limit: number;
    mode: number;
    age: number;
    grade: number;
    medium: string;
    board: string;
    createdBy: Array<string>;
    audience: Array<string>;
    channel: Array<string>;
    contentStatusArray: Array<string>;
    facets: Array<string>;
    contentTypes: Array<string>;
    facetFilters: Array<ContentSearchFilter>;
    impliedFilters: Array<ContentSearchFilter>;
    sortCriteria: Array<ContentSearchFilter>;
    // 1 - indicates search, 2 - filter
    searchType: SearchType;
}