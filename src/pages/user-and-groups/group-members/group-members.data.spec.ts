export const mockRes = {
    facets: {
      name: "board",
      displayName: "BOARD",
      values: [
        "sample_1",
        "sam2",
        "sam3",
        "sam4",
        "sam5",
        "sam6"
      ],
      selected: ["sam4"],
    },
    facetsWithoutSelectedValue: {
      name: "board",
      displayName: "BOARD",
      values: [
          "sam1",
          "sam2",
          "sam3",
          "sam4",
          "sam5",
          "sam6"
      ]
    }
   };
//    describe("isSelected", () => {
//       it("should be select the value", () => {
//         comp.facets = mockRes.facets;
//         comp.isSelected("sam2");

//         comp.facets = mockRes.facetsWithoutSelectedValue;
//         comp.isSelected("sam2");
//       });
//     });

//     describe("changeValue", () => {
//       it("should be change the value", () => {
//         comp.facets = mockRes.facets;
//         comp.changeValue("sam2");
//         comp.facets = " ";
//       });
//       it("should be change the value of index", () => {
//         comp.facets = mockRes.facets;
//         comp.changeValue("sam4");

//         comp.facets = mockRes.facetsWithoutSelectedValue;
//         comp.changeValue("sam4");
//       });
//     });