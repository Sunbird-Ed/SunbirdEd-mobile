import { ProfileType, UserSource } from 'sunbird';
export const mockRes = {
  facets: {
    name: 'board',
    displayName: 'BOARD',
    values: [
      'sample_1',
      'sample_2',
      'sample_3',
      'sample_4',
      'sample_5',
      'sample_6'
    ],
    selected: ['sample_4'],
  },
  facetsWithoutSelectedValue: {
    name: 'board',
    displayName: 'BOARD',
    values: [
      'sample_1',
      'sample_2',
      'sample_3',
      'sample_4',
      'sample_5',
      'sample_6'
    ]
  },
  profile :
    { handle: 'sample', syllabus: ['NCF'], board: ['CBSE'], grade: ['KG'], subject: ['English'], medium: ['English'],
    profileType: ProfileType.TEACHER, source: UserSource.LOCAL },
   userData : {
      'age': -1,
      'avatar': 'avatar',
      'createdAt': 'Aug 9, 2018 11:36:50 AM',
      'day': -1,
      'gender': '',
      'handle': 'test name',
      'isGroupUser': false,
      'language': 'en',
      'month': -1,
      'profileType': ProfileType.STUDENT,
      'source': UserSource.LOCAL,
      'standard': -1,
      'uid': '3af2e8a4-003e-438d-b360-2ae922696913'
  }

};
//    describe('isSelected', () => {
//       it('should be select the value', () => {
//         comp.facets = mockRes.facets;
//         comp.isSelected('sample_2');

//         comp.facets = mockRes.facetsWithoutSelectedValue;
//         comp.isSelected('sample_2');
//       });
//     });

//     describe('changeValue', () => {
//       it('should be change the value', () => {
//         comp.facets = mockRes.facets;
//         comp.changeValue('sample_2');
//         comp.facets = ' ';
//       });
//       it('should be change the value of index', () => {
//         comp.facets = mockRes.facets;
//         comp.changeValue('sample_4');

//         comp.facets = mockRes.facetsWithoutSelectedValue;
//         comp.changeValue('sample_4');
//       });
//     });
