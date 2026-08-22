const asyncHandler =require("../../utils/asyncHandler");

describe("asyncHandler", ()=>{
    it("passing req, res and next", async()=>{
        const req ={};
        const res ={};
        const next =jest.fn();

        const mockController =jest.fn().mockResolvedValue("success");
        const handler =asyncHandler(mockController);

        await handler(req, res, next);

        expect (mockController).toHaveBeenCalledWith(req ,res ,next);
    });

    it("Give error to next()", async()=>{
        const req ={};
        const res ={};
        const next =jest.fn();
        const test =new Error("Database failed");

        const mockController =jest.fn().mockRejectedValue(test);
        const handler =asyncHandler(mockController);

        await handler(req, res, next);

        expect(next).toHaveBeenCalledWith(test);
    });
});