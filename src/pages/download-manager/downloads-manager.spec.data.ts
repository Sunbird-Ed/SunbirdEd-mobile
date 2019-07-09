import { ProfileType, Profile, ProfileSource, ContentSpaceUsageSummaryResponse } from 'sunbird-sdk';
export const downloadsDataMock = [
  {
    'isUpdateAvailable': true,
    'contentData': {
      'appIcon': 'sampleb_1527849151139.thumb.jpeg',
      'artifactUrl': 'sample/assets/do_212516141114736640146589/mp4_877_1527849257.mp4',
      'attributions': [
        ''
      ],
      'audience': [
        'Learner'
      ],
      'me_totalRatings': '3.0',
      'board': 'CBSE',
      'contentDisposition': 'inline',
      'contentEncoding': 'identity',
      'contentType': 'Resource',
      'createdBy': '877',
      'createdOn': '2018-06-01T10:34:17.170+0000',
      'creator': 'Subrat Rath',
      'description': 'Swing around',
      'downloadUrl': 'sampleecar_files/do_212516141114736640146589/swing_1527849415336_do_212516141114736640146589_1.0.ecar',
      'gradeLevel': [
        'KG',
        'Class 1'
      ],
      'identifier': 'do_212516141114736640146589',
      'language': [
        'English'
      ],
      'lastPublishedOn': '2018-06-01T10:36:55.335+0000',
      'mimeType': 'video/mp4',
      'name': 'Swing',
      'osId': 'org.ekstep.quiz.app',
      'owner': 'Joker',
      'pkgVersion': '1.0',
      'publisher': '',
      'resourceType': 'Practice',
      'size': '2120865.0',
      'status': 'Live',
      'subject': 'English',
      'variants': {
        'spine': {
          // tslint:disable-next-line:max-line-length
          'ecarUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_212516141114736640146589/swing_1527849415610_do_212516141114736640146589_1.0_spine.ecar',
          'size': 17434
        }
      },
      'versionKey': '1527849415052',
      'me_totalDownloads': '24.0'
    },
    'contentType': 'resource',
    'identifier': 'do_212516141114736640146589',
    'isAvailableLocally': true,
    'lastUpdatedTime': 0,
    'mimeType': 'video/mp4',
    'referenceCount': 1,
    'contentFeedback': [
      {
        'rating': 1,
        'comments': 'Test',
        'contentId': 'sd',
        'contentVersion': '223'
      }
    ]
  }
];
export const profileDataMock: Profile = {
  'createdAt': 123456,
  'handle': 'tes user',
  'profileType': ProfileType.STUDENT,
  'source': ProfileSource.LOCAL,
  'uid': '3af2e8a4-003e-438d-b360-2ae922696913'
};

export const appStorageInfo: ContentSpaceUsageSummaryResponse[] = [{
  path: 'sample path',
  sizeOnDevice: 123456
}];
