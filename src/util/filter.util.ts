import { AppGlobalService } from "../service/app-global.service";

function applyProfileFilter(profileFilter: Array<any>, assembleFilter: Array<any>, categoryKey: string, appGlobal: AppGlobalService) {
    if (categoryKey) {
        let nameArray = [];
        profileFilter.forEach(filterCode => {
            let nameForCode = appGlobal.getNameForCodeInFramework(categoryKey, filterCode);

            if (!nameForCode) {
                nameForCode = filterCode;
            }

            nameArray.push(nameForCode);
        })

        profileFilter = nameArray;
    }


    if (!assembleFilter) {
        assembleFilter = [];
    }
    assembleFilter = assembleFilter.concat(profileFilter);

    let unique_array = [];

    for (let i = 0; i < assembleFilter.length; i++) {
        if (unique_array.indexOf(assembleFilter[i]) == -1 && assembleFilter[i].length > 0) {
            unique_array.push(assembleFilter[i])
        }
    }

    return unique_array;
}

export function updateFilterInSearchQuery(queryParams, appliedFilter, profile, mode, isFilterApplied, appGlobal: AppGlobalService) {
    let queryObj = JSON.parse(queryParams);
    let filter = queryObj.request.filters;

    if (mode === "soft") {
        queryObj.request.mode = mode;
    }

    if (appliedFilter) {
        let appliedFilterKey = Object.keys(appliedFilter);

        appliedFilterKey.forEach(key => {
            if (appliedFilter[key].length > 0) {
                if (!filter[key]) {
                    filter[key] = []
                }

                appliedFilter[key].forEach(filterValue => {
                    if (!filter[key].includes(filterValue)) {
                        filter[key].push(filterValue);
                    }
                })
            }
        })
    }

    if (profile && !isFilterApplied) {
        if (profile.board && profile.board.length) {
            filter["board"] = applyProfileFilter(profile.board, filter["board"], "board", appGlobal);
        }

        if (profile.medium && profile.medium.length) {
            filter["medium"] = applyProfileFilter(profile.medium, filter["medium"], "medium", appGlobal);
        }

        if (profile.grade && profile.grade.length) {
            filter["gradeLevel"] = applyProfileFilter(profile.grade, filter["gradeLevel"], "gradeLevel", appGlobal);
        }

        if (profile.subject && profile.subject.length) {
            filter["subject"] = applyProfileFilter(profile.subject, filter["subject"], "subject", appGlobal);
        }
    }

    queryObj.request.filters = filter;
    queryParams = JSON.stringify(queryObj);


    return queryParams;
}