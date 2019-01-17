import 'jest';
import { CourseCard } from './course-card';
import { mockRes } from './course-card.spec.data';
import {
    navCtrlMock,
    courseUtilServiceMock,
    eventsMock,
    telemetryGeneratorServiceMock,
    sharedPreferencesMock
} from '../../../__tests__/mocks';

import { EnrolledCourseDetailsPage } from '../../../pages/enrolled-course-details/enrolled-course-details';
import { CollectionDetailsPage } from '../../../pages/collection-details/collection-details';
import { ContentDetailsPage } from '../../../pages/content-details/content-details';

describe('course-card component', () => {
    let courseCard: CourseCard;
    beforeEach(() => {
        courseCard = new CourseCard(
            navCtrlMock as any,
            courseUtilServiceMock as any,
            eventsMock as any,
            telemetryGeneratorServiceMock as any,
            sharedPreferencesMock as any
        );
        jest.resetAllMocks();
    });
    it('should ctreate a valid instance of PageFilter', () => {
        expect(courseCard).toBeTruthy();
    });

    it('should get course progress', () => {
        // arrange
        courseCard.layoutName = 'InProgress';
        courseCard.course = {};
        courseCard.course.leafNodesCount = 6;
        courseCard.course.progress = 7;
        // act
        courseCard.ngOnInit();
        // assert
        expect(courseUtilServiceMock.getCourseProgress).toBeCalled();
    });

    it('should initialize batchExp with true', () => {
        // arrange
        courseCard.layoutName = courseCard.layoutInProgress = 'SAMPLE_LAYOUT';
        courseCard.course = {
            batch: {
                status: 2
            }
        };
        // act
        courseCard.ngOnInit();
        // assert
        expect(courseCard.batchExp).toBe(true);
    });

    it('should initialize batchExp with false', () => {
        // arrange
        courseCard.layoutName = courseCard.layoutInProgress = 'SAMPLE_LAYOUT';
        courseCard.course = {
            batch: {
                status: 1
            }
        };
        // act
        courseCard.ngOnInit();
        // assert
        expect(courseCard.batchExp).toBe(false);
    });

    it('should return true if content type is Story', () => {
        // arrange
        const contentType = 'Story';
        const ret = courseCard.isResource(contentType);
        // assert
        expect(ret).toBe(true);

    });

    it('should return true if content type is Worksheet', () => {
        // arrange
        const contentType = 'Worksheet';
        const ret = courseCard.isResource(contentType);
        // assert
        expect(ret).toBe(true);

    });

    it('should return false if content type is anything', () => {
        // arrange
        const contentType = 'OTHERS';
        const ret = courseCard.isResource(contentType);
        // assert
        expect(ret).toBe(false);

    });

    it('should resume course', () => {
        // arrange
        const content = mockRes.resumeCourse;
        spyOn(courseCard, 'saveContentContext').and.stub();
        // act
        courseCard.resumeCourse(content);
        // assert
        expect(eventsMock.publish).toHaveBeenCalledWith('course:resume', expect.objectContaining({ content: content }));
    });

    it('should resume course', () => {
        // arrange
        const content = mockRes.resumeCourseFalsy;
        spyOn(courseCard, 'saveContentContext').and.stub();
        // act
        courseCard.resumeCourse(content);
        // assert
        expect(navCtrlMock.push).toHaveBeenCalledWith(EnrolledCourseDetailsPage, expect.objectContaining({
            content: content
        }));
    });

    it('should navigate to EnrolledCourseDetailsPage', () => {
        const content = mockRes.navigationContent;
        courseCard.layoutInProgress = courseCard.layoutName = 'InProgress';
        content.mimeType = mockRes.navigationContent.mimeType;
        spyOn(courseCard, 'isResource').and.stub();
        spyOn(courseCard, 'saveContentContext');
        // act
        courseCard.navigateToDetailPage(content, 'InProgress');

        expect(courseCard.saveContentContext).toHaveBeenCalledWith(content);
        expect(navCtrlMock.push(EnrolledCourseDetailsPage, expect.objectContaining({
            content: content
        })));
    });

    it('should navigate to CollectionDetailsPage', () => {
        // arrange
        const content = mockRes.navigationContent;
        courseCard.layoutInProgress = courseCard.layoutName = 'InProgress';
        content.mimeType = mockRes.navigationContent.mimeType;
        spyOn(courseCard, 'isResource').and.stub();
        // act
        courseCard.navigateToDetailPage(content, 'InProgress');
        // assert
        expect(navCtrlMock.push(CollectionDetailsPage, expect.objectContaining({
            content: content
        })));
    });

    it('should navigate to ContentDetailsPage', () => {
        // arrange
        const content = mockRes.navigationContent;
        courseCard.layoutInProgress = courseCard.layoutName = 'sample';
        spyOn(courseCard, 'isResource').and.stub();
        // act
        courseCard.navigateToDetailPage(content, 'InProgress');
        // assert
        expect(navCtrlMock.push(ContentDetailsPage, expect.objectContaining({
            content: content
        })));
    });


});
