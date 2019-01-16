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
        courseCard.layoutName = 'InProgress';
        courseCard.course = {};
        courseCard.course.leafNodesCount = 6;
        courseCard.course.progress = 7;
        courseCard.ngOnInit();
        expect(courseUtilServiceMock.getCourseProgress).toBeCalled();
    });

    it('should initialize batchExp with true', () => {
        courseCard.layoutName = courseCard.layoutInProgress = 'SAMPLE_LAYOUT';
        courseCard.course = {
            batch: {
                status: 2
            }
        };
        courseCard.ngOnInit();
        expect(courseCard.batchExp).toBe(true);
    });

    it('should initialize batchExp with false', () => {
        courseCard.layoutName = courseCard.layoutInProgress = 'SAMPLE_LAYOUT';
        courseCard.course = {
            batch: {
                status: 1
            }
        };
        courseCard.ngOnInit();
        expect(courseCard.batchExp).toBe(false);
    });

    it('should return true if content type is Story', () => {
        const contentType = 'Story';
        const ret = courseCard.isResource(contentType);
        expect(ret).toBe(true);

    });

    it('should return true if content type is Worksheet', () => {
        const contentType = 'Worksheet';
        const ret = courseCard.isResource(contentType);
        expect(ret).toBe(true);

    });

    it('should return true if content type is Worksheet', () => {
        const contentType = 'OTHERS';
        const ret = courseCard.isResource(contentType);
        expect(ret).toBe(false);

    });

    it('should resume course', () => {
        const content = mockRes.resumeCourse;
        spyOn(courseCard, 'saveContentContext').and.stub();
        courseCard.resumeCourse(content);
        expect(eventsMock.publish).toHaveBeenCalledWith('course:resume', expect.objectContaining({ content: content }));
    });

    it('should resume course', () => {
        const content = mockRes.resumeCourseFalsy;
        spyOn(courseCard, 'saveContentContext').and.stub();
        courseCard.resumeCourse(content);
        expect(navCtrlMock.push).toHaveBeenCalledWith(EnrolledCourseDetailsPage, expect.objectContaining({
            content: content
        }));
    });

    it('should navigate to details page respectively', () => {
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

    it('should navigate to details page respectively', () => {
        const content = mockRes.navigationContent;
        courseCard.layoutInProgress = courseCard.layoutName = 'InProgress';
        spyOn(courseCard, 'isResource').and.stub();
        content.mimeType = mockRes.navigationContent.mimeType;
        // act
        courseCard.navigateToDetailPage(content, 'InProgress');
        expect(navCtrlMock.push(CollectionDetailsPage, expect.objectContaining({
            content: content
        })));
    });

    it('should navigate to details page respectively', () => {
        const content = mockRes.navigationContent;
        spyOn(courseCard, 'isResource').and.stub();
        courseCard.layoutInProgress = courseCard.layoutName = 'sample';
        // act
        courseCard.navigateToDetailPage(content, 'InProgress');

        expect(navCtrlMock.push(ContentDetailsPage, expect.objectContaining({
            content: content
        })));
    });


});
