const AppError =require("../../utils/appError");

describe("AppError", ()=>{
    describe("statusCode", ()=>{
        it("Handling error 404", ()=>{
            const error =new AppError("Not found", 404);
            expect(error.statusCode).toBe(404);
        });

        it("Handling error 500", ()=>{
            const error =new AppError("Internal servr error", 500);
            expect (error.statusCode).toBe(500);
        });

    });

    describe("Different status", ()=>{
        it("return fail for 4xx error", ()=>{
            [400, 401, 403, 404].forEach((statusCode)=>{
                const error =new AppError("User error", statusCode);
                expect(error.status).toBe("fail");
            });
        });

        it("return fail for 5xx error", ()=>{
                const error =new AppError("Internal server error", 500);
                expect(error.status).toBe("error");
        });

    });
        describe("isOperational errors", ()=>{
            it("true isOperational error", ()=>{
                const clientError =new AppError("Bad request", 400);
                const serverError = new AppError("Database connection error", 500);

                expect(clientError.isOperational).toBe(true);
                expect(serverError.isOperational).toBe(true);
            });

            it("describe instanceOf", ()=>{
                const error =new AppError("Message", 400);
                expect (error).toBeInstanceOf(Error);
            });
        });
});