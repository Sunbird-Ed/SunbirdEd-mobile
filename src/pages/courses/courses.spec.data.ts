export const mockRes = {
  getEnrolledCourses:
  {"message":"successful","result":{"courses":[{"active":true,"addedBy":"abc","batchId":"1234","contentId":"do_123","courseId":"do_123","courseLogoUrl":"sampleurl","courseName":"LiveCourse","dateTime":"2018-04-2212: 00: 07: 304+0000","description":"Sampledescription","enrolledDate":"2018-04-2212: 00: 07: 304+0000","id":"axyz","identifier":"xyz","lastReadContentStatus":0,"leafNodesCount":4,"progress":0,"status":0,"userId":"xyz"}]}},

  popularCoursesResponse:
  {
    "id": "1234",
    "name": "Course",
    "sections": "[{\"display\":\"{\\\"name\\\":{\\\"en\\\":\\\"Popular Books\\\"}}\",\"count\":53.0,\"index\":1.0,\"sectionDataType\":\"content\",\"resmsgId\":\"1238\",\"contents\":[{\"subject\":\"Tamil\",\"channel\":\"1234\",\"downloadUrl\":\"sampleurl\",\"language\":[\"Tamil\"],\"mimeType\":\"application/vnd.ekstep.content-collection\",\"variants\":{\"spine\":{\"ecarUrl\":\"sample.ecar\",\"size\":596405.0}},\"objectType\":\"Content\",\"gradeLevel\":[\"Class 5\",\"Class 6\"],\"appIcon\":\"sample.thumb.jpg\",\"children\":[\"do_2123610485389475841501\"],\"appId\":\"sunbird_portal\",\"me_totalRatings\":0.0,\"contentEncoding\":\"gzip\",\"mimeTypesCount\":\"{\\\"application/vnd.ekstep.content-collection\\\":1,\\\"video/x-youtube\\\":1}\",\"contentType\":\"TextBook\",\"identifier\":\"do_1234\",\"lastUpdatedBy\":\"sasa\",\"audience\":[\"Learner\"],\"visibility\":\"Default\",\"toc_url\":\"sampletoc.json\",\"contentTypesCount\":\"{\\\"Resource\\\":1,\\\"Collection\\\":1}\",\"consumerId\":\"1234\",\"author\":\"bhv\",\"childNodes\":[\"do_1234\",\"do_231\"],\"mediaType\":\"content\",\"osId\":\"org.ekstep.quiz.app\",\"graph_id\":\"domain\",\"nodeType\":\"DATA_NODE\",\"lastPublishedBy\":\"68777b59-b28b-4aee-88d6-50d46e4c3509\",\"prevState\":\"Live\",\"concepts\":[\"123\",\"123\"],\"size\":596405.0,\"lastPublishedOn\":\"2018-05-22T12:20:04.607+0000\",\"IL_FUNC_OBJECT_TYPE\":\"Content\",\"name\":\"m1\",\"status\":\"Live\",\"code\":\"do_21as\",\"description\":\"jbh\",\"medium\":\"English\",\"idealScreenSize\":\"normal\",\"posterImage\":\"sasmpleimage\",\"createdOn\":\"2017-11-02T06:01:56.040+0000\",\"me_totalSideloads\":0.0,\"me_totalComments\":0.0,\"contentDisposition\":\"inline\",\"lastUpdatedOn\":\"2018-05-22T12:20:04.465+0000\",\"SYS_INTERNAL_LAST_UPDATED_ON\":\"2018-05-22T12:20:05.171+0000\",\"me_totalDownloads\":2.0,\"creator\":\"CreatoUse\",\"createdFor\":[\"01232002070124134414\",\"012315809814749184151\"],\"IL_SYS_NODE_TYPE\":\"DATA_NODE\",\"os\":[\"All\"],\"pkgVersion\":2.0,\"versionKey\":\"112\",\"idealScreenDensity\":\"hdpi\",\"s3Key\":\"ecar_files/dsammplspine_spine.ecar\",\"lastSubmittedOn\":\"2017-11-02T06:04:17.268+0000\",\"me_averageRating\":0.0,\"createdBy\":\"qw-ab\",\"compatibilityLevel\":1.0,\"leafNodesCount\":1.0,\"IL_UNIQUE_ID\":\"do_12\",\"board\":\"State (Uttar Pradesh)\",\"resourceType\":\"Book\",\"node_id\":0.0}],\"searchQuery\":\"{\\\"request\\\":{\\\"filters\\\":{\\\"contentType\\\":[\\\"TextBook\\\"],\\\"objectType\\\":[\\\"Content\\\"],\\\"status\\\":[\\\"Live\\\"]},\\\"sort_by\\\":{\\\"me_averageRating\\\":\\\"desc\\\"},\\\"limit\\\":10}}\",\"name\":\"Popular Books\",\"id\":\"1234\",\"apiId\":\"api.content.search\",\"group\":1.0}]"
  },

  failurepopularCoursesResponse:
  {
    "error":"COONECTION_ERROR"
  },

  searchQuery:
  "{\"request\":{\"filters\":{\"contentType\":[\"Collection\"],\"objectType\":[\"Content\"],\"status\":[\"Live\"]},\"sort_by\":{\"me_averageRating\":\"desc\"},\"limit\":10}}",

  mergedSearchQuery:
  "{\"request\":{\"filters\":{\"contentType\":[\"Collection\"],\"objectType\":[\"Content\"],\"status\":[\"Live\"]},\"sort_by\":{\"me_averageRating\":\"desc\"},\"limit\":10,\"mode\":\"soft\"}}"
}
