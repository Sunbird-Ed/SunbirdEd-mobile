export const mockRes = {
  sampleFacetWithGradeValues: {
    'name': 'Class', 'translations': '{\'en\':\'Class\',\'hi\':\'कक्षा\',\'te\':\'క్లాసు\',\'ta\':\'வகுப்பு\',\'mr\':\'इयत्ता\'}',
  'code': 'gradeLevel', 'index': 2, 'values': ['KG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7',
  'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'Other'] },
  sampleFacetWithContentType: {
    'name': 'Resource Type', 'translations':
    '{\'en\':\'Resource Type\',\'hi\':\'संसाधन के प्रकार\',\'te\':\'ఎలాంటి వనరు\',\'ta\':\'கல்வி வளம் வகை\',\'mr\':\'संसाधन प्रकार\'}',
    'code': 'contentType', 'index': 5, 'values': ['Story', 'Worksheet', 'Collection', 'LessonPlan', 'TextBook'],
    'resourceTypeValues': [{ 'name': 'Story', 'code': 'Story', 'translations':
    '{\'en\':\'Story\',\'hi\':\'कहानी\',\'te\':\'స్టోరీ\',\'ta\':\'கதை\',\'mr\':\'कथा\'}' },
    { 'name': 'Worksheet', 'code': 'Worksheet',
    'translations': '{\'en\':\'Worksheet\',\'hi\':\'Worksheet\',\'te\':\'Worksheet\',\'ta\':\'Worksheet\',\'mr\':\'Worksheet\'}' },
    { 'name': 'Collection', 'code': 'Collection',
    'translations': '{\'en\':\'Collection\',\'hi\':\'Collection\',\'te\':\'Collection\',\'ta\':\'Collection\',\'mr\':\'Collection\'}' },
    { 'name': 'LessonPlan', 'code': 'LessonPlan',
    'translations': '{\'en\':\'LessonPlan\',\'hi\':\'LessonPlan\',\'te\':\'LessonPlan\',\'ta\':\'LessonPlan\',\'mr\':\'LessonPlan\'}' },
    { 'name': 'TextBook', 'code': 'TextBook',
    'translations': '{\'en\':\'TextBook\',\'hi\':\'TextBook\',\'te\':\'TextBook\',\'ta\':\'TextBook\',\'mr\':\'TextBook\'}' }] },
  facets: {
    name: 'board',
    displayName: 'BOARD',
    values: [
      'sample_1',
      'sam2',
      'sam3',
      'sam4',
      'sam5',
      'sam6'
    ],
    selected: ['sam4'],
  },
  facetsWithoutSelectedValue: {
    name: 'board',
    displayName: 'BOARD',
    values: [
      'sam1',
      'sam2',
      'sam3',
      'sam4',
      'sam5',
      'sam6'
    ]
  },
  topicVal : [
    [
      {
        'identifier': 'tpd_topic_physics',
        'code': 'Physics',
        'translations': null,
        'name': 'Physics',
        'description': 'Physics',
        'index': 1,
        'category': 'topic',
        'status': 'Live'
      },
      {
        'identifier': 'tpd_topic_chemistry',
        'code': 'Chemistry',
        'translations': null,
        'name': 'Chemistry',
        'description': 'Chemistry',
        'index': 2,
        'category': 'topic',
        'status': 'Live'
      },
      {
        'identifier': 'tpd_topic_biology',
        'code': 'Biology',
        'translations': null,
        'name': 'Biology',
        'description': 'Biology',
        'index': 3,
        'category': 'topic',
        'status': 'Live'
      },
      {
        'identifier': 'tpd_topic_general-science',
        'code': 'General Science',
        'translations': null,
        'name': 'General Science',
        'description': 'General Science',
        'index': 4,
        'category': 'topic',
        'status': 'Live'
      }
    ]
  ]
};
