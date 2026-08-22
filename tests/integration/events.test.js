require("dotenv").config();
const request =require("supertest");
const mongoose =require("mongoose");
const jwt =require("jsonwebtoken");
const app =require("../../app");


beforeAll(async()=>{
    if(mongoose.connection.readyState ===0){
        await mongoose.connect(process.env.MONGO_URI)
    };
},10000);


describe("get api/events", ()=>{
    it("return 200", async()=>{
        const res =await request(app).get("/api/events");
        expect(res.status).toBe(200);
    }, 10000);
});

describe("post /api/events", ()=>{
    it("return 401 when not authenticated", async()=>{
        const res =await request(app)
         .post("/api/events")
         .send({
            title:"Tech event",
            date:"2026-10-21",
            category:"60d5ecb8b5c9c22b1c8e1220",
            capacity: 200
         });
         expect(res.status).toBe(401);
    });

    it("returning 422 when payload error", async()=>{

        const tokenValidate = jwt.sign(
            {id:"60d5ecb8b5c9c22b1c8e1220", role :"admin"},
            process.env.JWT_SECRET
        );
        const res =await request(app)
          .post("/api/events")
          .set("Authorization", `Bearer ${tokenValidate}`)
          .send({});

          expect(res.status).toBe(422);
    });
});

afterAll(async()=>{
    await mongoose.disconnect();
    await mongoose.connection.close();
    });