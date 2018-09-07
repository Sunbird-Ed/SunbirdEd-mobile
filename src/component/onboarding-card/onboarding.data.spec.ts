export const mockSyllabusList = [
    {
        "text": "மாநிலம் (ஆந்திரப் பிரதேசம்)",
        "value": "ap_k-12_13",
        "checked": false
    },
    {
        "text": "மாநிலம் (மகாராஷ்டிரா)",
        "value": "mh_k-12_15",
        "checked": false
    },
    {
        "text": "மாநிலம் (ராஜஸ்தான்)",
        "value": "rj_k-12_1",
        "checked": false
    },
    {
        "text": "மாநிலம் (உத்தர பிரதேசம்)",
        "value": "up_k-12_3",
        "checked": false
    },
    {
        "text": "NCF-Translation-Testing",
        "value": "NCFCOPY",
        "checked": false
    },
    {
        "text": "Common",
        "value": "NCF",
        "checked": false
    }
];

export const mockOnboardingEvents = {
    isDataAvailable: { show: true, index: 10 }
}

export const mockSelectedSlide = {
    "id": "syllabusList",
    "title": "SYLLABUS_QUESTION",
    "desc": "SYLLABUS_OPTION_TEXT",
    "options": [
        {
            "text": "State (Andhra Pradesh)",
            "value": "ap_k-12_13",
            "checked": false
        },
        {
            "text": "State (Maharashtra)",
            "value": "mh_k-12_15",
            "checked": false
        },
        {
            "text": "State (Rajasthan)",
            "value": "rj_k-12_1",
            "checked": false
        },
        {
            "text": "State (Uttar Pradesh)",
            "value": "up_k-12_3",
            "checked": false
        },
        {
            "text": "NCF-Translation-Testing",
            "value": "NCFCOPY",
            "checked": false
        },
        {
            "text": "Common",
            "value": "NCF",
            "checked": false
        }
    ],
    "selectedOptions": "",
    "selectedCode": []
};

export const mockCurrentUserDetails = '{"age":-1,"avatar":"avatar","board":["stateandhrapradesh"],"createdAt":"Sep 7, 2018 5:13:16 PM","day":-1,"gender":"","grade":["class10","class9"],"gradeValueMap":{"class10":"Class 10","class9":"Class 9"},"handle":"Guest1","isGroupUser":false,"language":"en","medium":["english"],"month":-1,"profileType":"TEACHER","source":"LOCAL","standard":-1,"subject":["biology","mathematics"],"syllabus":["ap_k-12_13"],"uid":"0722daf6-ba0b-4f27-8c7d-3868d431df17"}';
export const mockOnBoardingSlideDefaults = [
    {
        'id': 'syllabusList',
        'title': 'SYLLABUS_QUESTION',
        'desc': 'SYLLABUS_OPTION_TEXT',
        'options': [],
        'selectedOptions': '',
        'selectedCode': []
    },
    {
        'id': 'boardList',
        'title': 'BOARD_QUESTION',
        'desc': 'BOARD_OPTION_TEXT',
        'options': [],
        'selectedOptions': '',
        'selectedCode': []
    },
    {
        'id': 'mediumList',
        'title': 'MEDIUM_QUESTION',
        'desc': 'MEDIUM_OPTION_TEXT',
        'options': [],
        'selectedOptions': '',
        'selectedCode': []
    },
    {
        'id': 'gradeList',
        'title': 'GRADE_QUESTION',
        'desc': 'GRADE_OPTION_TEXT',
        'options': [],
        'selectedOptions': '',
        'selectedCode': []
    },
    {
        'id': 'subjectList',
        'title': 'SUBJECT_QUESTION',
        'desc': 'SUBJECT_OPTION_TEXT',
        'options': [],
        'selectedOptions': '',
        'selectedCode': []
    }
];
export const mockCategories = [
    {
      "identifier": "mh_k-12_15_board",
      "code": "board",
      "name": "Board",
      "description": "Board",
      "index": 1,
      "status": "Live",
      "translations": null,
      "terms": [
        {
          "identifier": "mh_k-12_15_board_statemaharashtra",
          "code": "statemaharashtra",
          "name": "State (Maharashtra)",
          "description": "State (Maharashtra)",
          "index": 1,
          "category": "board",
          "status": "Live",
          "translations": null,
          "associations": [
            {
              "identifier": "mh_k-12_15_medium_telugu",
              "code": "telugu",
              "translations": null,
              "name": "Telugu",
              "description": "Telugu",
              "category": "medium",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_medium_hindi",
              "code": "hindi",
              "translations": null,
              "name": "Hindi",
              "description": "Hindi",
              "category": "medium",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_medium_kannada",
              "code": "kannada",
              "translations": null,
              "name": "Kannada",
              "description": "Kannada",
              "category": "medium",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_medium_gujarati",
              "code": "gujarati",
              "translations": null,
              "name": "Gujarati",
              "description": "Gujarati",
              "category": "medium",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_medium_urdu",
              "code": "urdu",
              "translations": null,
              "name": "Urdu",
              "description": "Urdu",
              "category": "medium",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_medium_marathi",
              "code": "marathi",
              "translations": null,
              "name": "Marathi",
              "description": "Marathi",
              "category": "medium",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_medium_english",
              "code": "english",
              "translations": null,
              "name": "English",
              "description": "English",
              "category": "medium",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_medium_sindhi",
              "code": "sindhi",
              "translations": null,
              "name": "Sindhi",
              "description": "Sindhi",
              "category": "medium",
              "status": "Live"
            }
          ]
        }
      ]
    },
    {
      "identifier": "mh_k-12_15_medium",
      "code": "medium",
      "name": "Medium",
      "description": "Medium",
      "index": 2,
      "status": "Live",
      "translations": null,
      "terms": [
        {
          "identifier": "mh_k-12_15_medium_marathi",
          "code": "marathi",
          "name": "Marathi",
          "description": "Marathi",
          "index": 1,
          "category": "medium",
          "status": "Live",
          "translations": null,
          "associations": [
            {
              "identifier": "mh_k-12_15_gradelevel_class7",
              "code": "class7",
              "translations": null,
              "name": "Class 7",
              "description": "Class 7",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class4",
              "code": "class4",
              "translations": null,
              "name": "Class 4",
              "description": "Class 4",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class5",
              "code": "class5",
              "translations": null,
              "name": "Class 5",
              "description": "Class 5",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class6",
              "code": "class6",
              "translations": null,
              "name": "Class 6",
              "description": "Class 6",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class1",
              "code": "class1",
              "translations": null,
              "name": "Class 1",
              "description": "Class 1",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class3",
              "code": "class3",
              "translations": null,
              "name": "Class 3",
              "description": "Class 3",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class10",
              "code": "class10",
              "translations": null,
              "name": "Class 10",
              "description": "Class 10",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class9",
              "code": "class9",
              "translations": null,
              "name": "Class 9",
              "description": "Class 9",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class2",
              "code": "class2",
              "translations": null,
              "name": "Class 2",
              "description": "Class 2",
              "category": "gradeLevel",
              "status": "Live"
            }
          ]
        },
        {
          "identifier": "mh_k-12_15_medium_hindi",
          "code": "hindi",
          "name": "Hindi",
          "description": "Hindi",
          "index": 2,
          "category": "medium",
          "status": "Live",
          "translations": null,
          "associations": [
            {
              "identifier": "mh_k-12_15_gradelevel_class6",
              "code": "class6",
              "translations": null,
              "name": "Class 6",
              "description": "Class 6",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class7",
              "code": "class7",
              "translations": null,
              "name": "Class 7",
              "description": "Class 7",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class3",
              "code": "class3",
              "translations": null,
              "name": "Class 3",
              "description": "Class 3",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class9",
              "code": "class9",
              "translations": null,
              "name": "Class 9",
              "description": "Class 9",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class10",
              "code": "class10",
              "translations": null,
              "name": "Class 10",
              "description": "Class 10",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class4",
              "code": "class4",
              "translations": null,
              "name": "Class 4",
              "description": "Class 4",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class2",
              "code": "class2",
              "translations": null,
              "name": "Class 2",
              "description": "Class 2",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class5",
              "code": "class5",
              "translations": null,
              "name": "Class 5",
              "description": "Class 5",
              "category": "gradeLevel",
              "status": "Live"
            }
          ]
        },
        {
          "identifier": "mh_k-12_15_medium_urdu",
          "code": "urdu",
          "name": "Urdu",
          "description": "Urdu",
          "index": 3,
          "category": "medium",
          "status": "Live",
          "translations": null,
          "associations": [
            {
              "identifier": "mh_k-12_15_gradelevel_class4",
              "code": "class4",
              "translations": null,
              "name": "Class 4",
              "description": "Class 4",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class5",
              "code": "class5",
              "translations": null,
              "name": "Class 5",
              "description": "Class 5",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class3",
              "code": "class3",
              "translations": null,
              "name": "Class 3",
              "description": "Class 3",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class6",
              "code": "class6",
              "translations": null,
              "name": "Class 6",
              "description": "Class 6",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class7",
              "code": "class7",
              "translations": null,
              "name": "Class 7",
              "description": "Class 7",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class9",
              "code": "class9",
              "translations": null,
              "name": "Class 9",
              "description": "Class 9",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class10",
              "code": "class10",
              "translations": null,
              "name": "Class 10",
              "description": "Class 10",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class2",
              "code": "class2",
              "translations": null,
              "name": "Class 2",
              "description": "Class 2",
              "category": "gradeLevel",
              "status": "Live"
            }
          ]
        },
        {
          "identifier": "mh_k-12_15_medium_sindhi",
          "code": "sindhi",
          "name": "Sindhi",
          "description": "Sindhi",
          "index": 4,
          "category": "medium",
          "status": "Live",
          "translations": null,
          "associations": [
            {
              "identifier": "mh_k-12_15_gradelevel_class2",
              "code": "class2",
              "translations": null,
              "name": "Class 2",
              "description": "Class 2",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class4",
              "code": "class4",
              "translations": null,
              "name": "Class 4",
              "description": "Class 4",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class3",
              "code": "class3",
              "translations": null,
              "name": "Class 3",
              "description": "Class 3",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class5",
              "code": "class5",
              "translations": null,
              "name": "Class 5",
              "description": "Class 5",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class6",
              "code": "class6",
              "translations": null,
              "name": "Class 6",
              "description": "Class 6",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class7",
              "code": "class7",
              "translations": null,
              "name": "Class 7",
              "description": "Class 7",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class9",
              "code": "class9",
              "translations": null,
              "name": "Class 9",
              "description": "Class 9",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class10",
              "code": "class10",
              "translations": null,
              "name": "Class 10",
              "description": "Class 10",
              "category": "gradeLevel",
              "status": "Live"
            }
          ]
        },
        {
          "identifier": "mh_k-12_15_medium_gujarati",
          "code": "gujarati",
          "name": "Gujarati",
          "description": "Gujarati",
          "index": 5,
          "category": "medium",
          "status": "Live",
          "translations": null,
          "associations": [
            {
              "identifier": "mh_k-12_15_gradelevel_class6",
              "code": "class6",
              "translations": null,
              "name": "Class 6",
              "description": "Class 6",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class7",
              "code": "class7",
              "translations": null,
              "name": "Class 7",
              "description": "Class 7",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class9",
              "code": "class9",
              "translations": null,
              "name": "Class 9",
              "description": "Class 9",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class4",
              "code": "class4",
              "translations": null,
              "name": "Class 4",
              "description": "Class 4",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class10",
              "code": "class10",
              "translations": null,
              "name": "Class 10",
              "description": "Class 10",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class5",
              "code": "class5",
              "translations": null,
              "name": "Class 5",
              "description": "Class 5",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class2",
              "code": "class2",
              "translations": null,
              "name": "Class 2",
              "description": "Class 2",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class3",
              "code": "class3",
              "translations": null,
              "name": "Class 3",
              "description": "Class 3",
              "category": "gradeLevel",
              "status": "Live"
            }
          ]
        },
        {
          "identifier": "mh_k-12_15_medium_telugu",
          "code": "telugu",
          "name": "Telugu",
          "description": "Telugu",
          "index": 6,
          "category": "medium",
          "status": "Live",
          "translations": null,
          "associations": [
            {
              "identifier": "mh_k-12_15_gradelevel_class2",
              "code": "class2",
              "translations": null,
              "name": "Class 2",
              "description": "Class 2",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class5",
              "code": "class5",
              "translations": null,
              "name": "Class 5",
              "description": "Class 5",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class6",
              "code": "class6",
              "translations": null,
              "name": "Class 6",
              "description": "Class 6",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class9",
              "code": "class9",
              "translations": null,
              "name": "Class 9",
              "description": "Class 9",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class4",
              "code": "class4",
              "translations": null,
              "name": "Class 4",
              "description": "Class 4",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class7",
              "code": "class7",
              "translations": null,
              "name": "Class 7",
              "description": "Class 7",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class10",
              "code": "class10",
              "translations": null,
              "name": "Class 10",
              "description": "Class 10",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class3",
              "code": "class3",
              "translations": null,
              "name": "Class 3",
              "description": "Class 3",
              "category": "gradeLevel",
              "status": "Live"
            }
          ]
        },
        {
          "identifier": "mh_k-12_15_medium_kannada",
          "code": "kannada",
          "name": "Kannada",
          "description": "Kannada",
          "index": 7,
          "category": "medium",
          "status": "Live",
          "translations": null,
          "associations": [
            {
              "identifier": "mh_k-12_15_gradelevel_class2",
              "code": "class2",
              "translations": null,
              "name": "Class 2",
              "description": "Class 2",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class3",
              "code": "class3",
              "translations": null,
              "name": "Class 3",
              "description": "Class 3",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class4",
              "code": "class4",
              "translations": null,
              "name": "Class 4",
              "description": "Class 4",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class5",
              "code": "class5",
              "translations": null,
              "name": "Class 5",
              "description": "Class 5",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class7",
              "code": "class7",
              "translations": null,
              "name": "Class 7",
              "description": "Class 7",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class6",
              "code": "class6",
              "translations": null,
              "name": "Class 6",
              "description": "Class 6",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class9",
              "code": "class9",
              "translations": null,
              "name": "Class 9",
              "description": "Class 9",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class10",
              "code": "class10",
              "translations": null,
              "name": "Class 10",
              "description": "Class 10",
              "category": "gradeLevel",
              "status": "Live"
            }
          ]
        },
        {
          "identifier": "mh_k-12_15_medium_english",
          "code": "english",
          "name": "English",
          "description": "English",
          "index": 8,
          "category": "medium",
          "status": "Live",
          "translations": null,
          "associations": [
            {
              "identifier": "mh_k-12_15_gradelevel_class10",
              "code": "class10",
              "translations": null,
              "name": "Class 10",
              "description": "Class 10",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class2",
              "code": "class2",
              "translations": null,
              "name": "Class 2",
              "description": "Class 2",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class4",
              "code": "class4",
              "translations": null,
              "name": "Class 4",
              "description": "Class 4",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class3",
              "code": "class3",
              "translations": null,
              "name": "Class 3",
              "description": "Class 3",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class5",
              "code": "class5",
              "translations": null,
              "name": "Class 5",
              "description": "Class 5",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class6",
              "code": "class6",
              "translations": null,
              "name": "Class 6",
              "description": "Class 6",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class7",
              "code": "class7",
              "translations": null,
              "name": "Class 7",
              "description": "Class 7",
              "category": "gradeLevel",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_gradelevel_class9",
              "code": "class9",
              "translations": null,
              "name": "Class 9",
              "description": "Class 9",
              "category": "gradeLevel",
              "status": "Live"
            }
          ]
        }
      ]
    },
    {
      "identifier": "mh_k-12_15_gradelevel",
      "code": "gradeLevel",
      "name": "Grade",
      "description": "Grade",
      "index": 3,
      "status": "Live",
      "translations": null,
      "terms": [
        {
          "identifier": "mh_k-12_15_gradelevel_class6",
          "code": "class6",
          "name": "Class 6",
          "description": "Class 6",
          "index": 1,
          "category": "gradeLevel",
          "status": "Live",
          "translations": null,
          "associations": [
            {
              "identifier": "mh_k-12_15_subject_urdu",
              "code": "urdu",
              "translations": null,
              "name": "Urdu",
              "description": "Urdu",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_science",
              "code": "science",
              "translations": null,
              "name": "Science",
              "description": "Science",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_mathematics",
              "code": "mathematics",
              "translations": null,
              "name": "Mathematics",
              "description": "Mathematics",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_geography",
              "code": "geography",
              "translations": null,
              "name": "Geography",
              "description": "Geography",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_english",
              "code": "english",
              "translations": null,
              "name": "English",
              "description": "English",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_historyandcivics",
              "code": "historyandcivics",
              "translations": null,
              "name": "History And Civics",
              "description": "History And Civics",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_hindi",
              "code": "hindi",
              "translations": null,
              "name": "Hindi",
              "description": "Hindi",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_marathi",
              "code": "marathi",
              "translations": null,
              "name": "Marathi",
              "description": "Marathi",
              "category": "subject",
              "status": "Live"
            }
          ]
        },
        {
          "identifier": "mh_k-12_15_gradelevel_class7",
          "code": "class7",
          "name": "Class 7",
          "description": "Class 7",
          "index": 2,
          "category": "gradeLevel",
          "status": "Live",
          "translations": null,
          "associations": [
            {
              "identifier": "mh_k-12_15_subject_science",
              "code": "science",
              "translations": null,
              "name": "Science",
              "description": "Science",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_historyandcivics",
              "code": "historyandcivics",
              "translations": null,
              "name": "History And Civics",
              "description": "History And Civics",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_urdu",
              "code": "urdu",
              "translations": null,
              "name": "Urdu",
              "description": "Urdu",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_mathematics",
              "code": "mathematics",
              "translations": null,
              "name": "Mathematics",
              "description": "Mathematics",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_english",
              "code": "english",
              "translations": null,
              "name": "English",
              "description": "English",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_marathi",
              "code": "marathi",
              "translations": null,
              "name": "Marathi",
              "description": "Marathi",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_hindi",
              "code": "hindi",
              "translations": null,
              "name": "Hindi",
              "description": "Hindi",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_geography",
              "code": "geography",
              "translations": null,
              "name": "Geography",
              "description": "Geography",
              "category": "subject",
              "status": "Live"
            }
          ]
        },
        {
          "identifier": "mh_k-12_15_gradelevel_class9",
          "code": "class9",
          "name": "Class 9",
          "description": "Class 9",
          "index": 3,
          "category": "gradeLevel",
          "status": "Live",
          "translations": null,
          "associations": [
            {
              "identifier": "mh_k-12_15_subject_hindi",
              "code": "hindi",
              "translations": null,
              "name": "Hindi",
              "description": "Hindi",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_marathi",
              "code": "marathi",
              "translations": null,
              "name": "Marathi",
              "description": "Marathi",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_defencestudies",
              "code": "defencestudies",
              "translations": null,
              "name": "Defence Studies",
              "description": "Defence Studies",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_mathematics",
              "code": "mathematics",
              "translations": null,
              "name": "Mathematics",
              "description": "Mathematics",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_historyandcivics",
              "code": "historyandcivics",
              "translations": null,
              "name": "History And Civics",
              "description": "History And Civics",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_selfdevelopment",
              "code": "selfdevelopment",
              "translations": null,
              "name": "Self Development",
              "description": "Self Development",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_geography",
              "code": "geography",
              "translations": null,
              "name": "Geography",
              "description": "Geography",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_science",
              "code": "science",
              "translations": null,
              "name": "Science",
              "description": "Science",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_english",
              "code": "english",
              "translations": null,
              "name": "English",
              "description": "English",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_urdu",
              "code": "urdu",
              "translations": null,
              "name": "Urdu",
              "description": "Urdu",
              "category": "subject",
              "status": "Live"
            }
          ]
        },
        {
          "identifier": "mh_k-12_15_gradelevel_class10",
          "code": "class10",
          "name": "Class 10",
          "description": "Class 10",
          "index": 4,
          "category": "gradeLevel",
          "status": "Live",
          "translations": null,
          "associations": [
            {
              "identifier": "mh_k-12_15_subject_marathi",
              "code": "marathi",
              "translations": null,
              "name": "Marathi",
              "description": "Marathi",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_historyandcivics",
              "code": "historyandcivics",
              "translations": null,
              "name": "History And Civics",
              "description": "History And Civics",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_mathematics",
              "code": "mathematics",
              "translations": null,
              "name": "Mathematics",
              "description": "Mathematics",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_english",
              "code": "english",
              "translations": null,
              "name": "English",
              "description": "English",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_geography",
              "code": "geography",
              "translations": null,
              "name": "Geography",
              "description": "Geography",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_science",
              "code": "science",
              "translations": null,
              "name": "Science",
              "description": "Science",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_urdu",
              "code": "urdu",
              "translations": null,
              "name": "Urdu",
              "description": "Urdu",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_hindi",
              "code": "hindi",
              "translations": null,
              "name": "Hindi",
              "description": "Hindi",
              "category": "subject",
              "status": "Live"
            }
          ]
        },
        {
          "identifier": "mh_k-12_15_gradelevel_class2",
          "code": "class2",
          "name": "Class 2",
          "description": "Class 2",
          "index": 5,
          "category": "gradeLevel",
          "status": "Live",
          "translations": null,
          "associations": [
            {
              "identifier": "mh_k-12_15_subject_hindi",
              "code": "hindi",
              "translations": null,
              "name": "Hindi",
              "description": "Hindi",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_marathi",
              "code": "marathi",
              "translations": null,
              "name": "Marathi",
              "description": "Marathi",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_mathematics",
              "code": "mathematics",
              "translations": null,
              "name": "Mathematics",
              "description": "Mathematics",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_urdu",
              "code": "urdu",
              "translations": null,
              "name": "Urdu",
              "description": "Urdu",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_english",
              "code": "english",
              "translations": null,
              "name": "English",
              "description": "English",
              "category": "subject",
              "status": "Live"
            }
          ]
        },
        {
          "identifier": "mh_k-12_15_gradelevel_class3",
          "code": "class3",
          "name": "Class 3",
          "description": "Class 3",
          "index": 6,
          "category": "gradeLevel",
          "status": "Live",
          "translations": null,
          "associations": [
            {
              "identifier": "mh_k-12_15_subject_english",
              "code": "english",
              "translations": null,
              "name": "English",
              "description": "English",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_hindi",
              "code": "hindi",
              "translations": null,
              "name": "Hindi",
              "description": "Hindi",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_geography",
              "code": "geography",
              "translations": null,
              "name": "Geography",
              "description": "Geography",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_marathi",
              "code": "marathi",
              "translations": null,
              "name": "Marathi",
              "description": "Marathi",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_evs",
              "code": "evs",
              "translations": null,
              "name": "Evs",
              "description": "Evs",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_mathematics",
              "code": "mathematics",
              "translations": null,
              "name": "Mathematics",
              "description": "Mathematics",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_urdu",
              "code": "urdu",
              "translations": null,
              "name": "Urdu",
              "description": "Urdu",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_districtgeography",
              "code": "districtgeography",
              "translations": null,
              "name": "District Geography",
              "description": "District Geography",
              "category": "subject",
              "status": "Live"
            }
          ]
        },
        {
          "identifier": "mh_k-12_15_gradelevel_class4",
          "code": "class4",
          "name": "Class 4",
          "description": "Class 4",
          "index": 7,
          "category": "gradeLevel",
          "status": "Live",
          "translations": null,
          "associations": [
            {
              "identifier": "mh_k-12_15_subject_urdu",
              "code": "urdu",
              "translations": null,
              "name": "Urdu",
              "description": "Urdu",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_mathematics",
              "code": "mathematics",
              "translations": null,
              "name": "Mathematics",
              "description": "Mathematics",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_evspart2",
              "code": "evspart2",
              "translations": null,
              "name": "Evs Part 2",
              "description": "Evs Part 2",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_marathi",
              "code": "marathi",
              "translations": null,
              "name": "Marathi",
              "description": "Marathi",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_evspart1",
              "code": "evspart1",
              "translations": null,
              "name": "Evs Part 1",
              "description": "Evs Part 1",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_hindi",
              "code": "hindi",
              "translations": null,
              "name": "Hindi",
              "description": "Hindi",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_english",
              "code": "english",
              "translations": null,
              "name": "English",
              "description": "English",
              "category": "subject",
              "status": "Live"
            }
          ]
        },
        {
          "identifier": "mh_k-12_15_gradelevel_class5",
          "code": "class5",
          "name": "Class 5",
          "description": "Class 5",
          "index": 8,
          "category": "gradeLevel",
          "status": "Live",
          "translations": null,
          "associations": [
            {
              "identifier": "mh_k-12_15_subject_marathi",
              "code": "marathi",
              "translations": null,
              "name": "Marathi",
              "description": "Marathi",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_evspart1",
              "code": "evspart1",
              "translations": null,
              "name": "Evs Part 1",
              "description": "Evs Part 1",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_mathematics",
              "code": "mathematics",
              "translations": null,
              "name": "Mathematics",
              "description": "Mathematics",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_evspart2",
              "code": "evspart2",
              "translations": null,
              "name": "Evs Part 2",
              "description": "Evs Part 2",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_english",
              "code": "english",
              "translations": null,
              "name": "English",
              "description": "English",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_urdu",
              "code": "urdu",
              "translations": null,
              "name": "Urdu",
              "description": "Urdu",
              "category": "subject",
              "status": "Live"
            },
            {
              "identifier": "mh_k-12_15_subject_hindi",
              "code": "hindi",
              "translations": null,
              "name": "Hindi",
              "description": "Hindi",
              "category": "subject",
              "status": "Live"
            }
          ]
        },
        {
          "identifier": "mh_k-12_15_gradelevel_class1",
          "code": "class1",
          "name": "Class 1",
          "description": "Class 1",
          "index": 9,
          "category": "gradeLevel",
          "status": "Live",
          "translations": null,
          "associations": [
            {
              "identifier": "mh_k-12_15_subject_marathi",
              "code": "marathi",
              "translations": null,
              "name": "Marathi",
              "description": "Marathi",
              "category": "subject",
              "status": "Live"
            }
          ]
        }
      ]
    },
    {
      "identifier": "mh_k-12_15_subject",
      "code": "subject",
      "name": "Subject",
      "description": "Subject",
      "index": 4,
      "status": "Live",
      "translations": null,
      "terms": [
        {
          "identifier": "mh_k-12_15_subject_historyandcivics",
          "code": "historyandcivics",
          "name": "History And Civics",
          "description": "History And Civics",
          "index": 1,
          "category": "subject",
          "status": "Live",
          "translations": null
        },
        {
          "identifier": "mh_k-12_15_subject_mathematics",
          "code": "mathematics",
          "name": "Mathematics",
          "description": "Mathematics",
          "index": 2,
          "category": "subject",
          "status": "Live",
          "translations": null
        },
        {
          "identifier": "mh_k-12_15_subject_science",
          "code": "science",
          "name": "Science",
          "description": "Science",
          "index": 3,
          "category": "subject",
          "status": "Live",
          "translations": null
        },
        {
          "identifier": "mh_k-12_15_subject_evspart1",
          "code": "evspart1",
          "name": "Evs Part 1",
          "description": "Evs Part 1",
          "index": 4,
          "category": "subject",
          "status": "Live",
          "translations": null
        },
        {
          "identifier": "mh_k-12_15_subject_evspart2",
          "code": "evspart2",
          "name": "Evs Part 2",
          "description": "Evs Part 2",
          "index": 5,
          "category": "subject",
          "status": "Live",
          "translations": null
        },
        {
          "identifier": "mh_k-12_15_subject_districtgeography",
          "code": "districtgeography",
          "name": "District Geography",
          "description": "District Geography",
          "index": 6,
          "category": "subject",
          "status": "Live",
          "translations": null
        },
        {
          "identifier": "mh_k-12_15_subject_geography",
          "code": "geography",
          "name": "Geography",
          "description": "Geography",
          "index": 7,
          "category": "subject",
          "status": "Live",
          "translations": null
        },
        {
          "identifier": "mh_k-12_15_subject_defencestudies",
          "code": "defencestudies",
          "name": "Defence Studies",
          "description": "Defence Studies",
          "index": 8,
          "category": "subject",
          "status": "Live",
          "translations": null
        },
        {
          "identifier": "mh_k-12_15_subject_selfdevelopment",
          "code": "selfdevelopment",
          "name": "Self Development",
          "description": "Self Development",
          "index": 9,
          "category": "subject",
          "status": "Live",
          "translations": null
        },
        {
          "identifier": "mh_k-12_15_subject_evs",
          "code": "evs",
          "name": "Evs",
          "description": "Evs",
          "index": 10,
          "category": "subject",
          "status": "Live",
          "translations": null
        },
        {
          "identifier": "mh_k-12_15_subject_english",
          "code": "english",
          "name": "English",
          "description": "English",
          "index": 11,
          "category": "subject",
          "status": "Live",
          "translations": null
        },
        {
          "identifier": "mh_k-12_15_subject_urdu",
          "code": "urdu",
          "name": "Urdu",
          "description": "Urdu",
          "index": 12,
          "category": "subject",
          "status": "Live",
          "translations": null
        },
        {
          "identifier": "mh_k-12_15_subject_hindi",
          "code": "hindi",
          "name": "Hindi",
          "description": "Hindi",
          "index": 13,
          "category": "subject",
          "status": "Live",
          "translations": null
        },
        {
          "identifier": "mh_k-12_15_subject_marathi",
          "code": "marathi",
          "name": "Marathi",
          "description": "Marathi",
          "index": 14,
          "category": "subject",
          "status": "Live",
          "translations": null
        }
      ]
    }
  ];