export const mockRes = {
    reportOptions: {
        'issues': [{'name': 'OPTION_COPYRIGHT_VIOLATION', 'value': 'Copyright Violation', 'selected': false, 'id': 1},
        {'name': 'OPTION_INAPPROPRIATE_CONTENT', 'value': 'Inappropriate Content', 'selected': false, 'id': 2},
        {'name': 'OPTION_PRIVACY_VIOLATION', 'value': 'Privacy Violation', 'selected': false, 'id': 3},
        {'name': 'OPTION_OTHER', 'value': 'Other', 'selected': false, 'id': 4}]
    },

    values: {
        'issues': [true, true, false, false], 'comment': 'SAMPLE_COMMENT'
    },

    allFalsevalues: {
        'issues': [false, false, false, false], 'comment': 'SAMPLE_COMMENT'
    }
};
