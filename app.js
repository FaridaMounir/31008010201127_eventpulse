const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

require("dotenv").config();

const express =require("express");
const mongoose =require("mongoose");
const connectDB = require("./config/db");
const morgan =require("morgan");
const http =require("http");
const path =require("path");
const {Server} =require("socket.io");
const mongoSanitize =require("express-mongo-sanitize");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const errorHandler =require("./middleware/errorHandler");
const authRouter =require("./routes/authRoutes");
const eventRouter =require("./routes/eventRoutes");
const registrationRouter =require("./routes/registrationRoutes");
const announcementRouter =require("./routes/announcementRoutes");

const app =express();
const server =http.createServer(app);

const io =new Server(server, {
    cors: {
        origin: "*"
    }
});
app.set("io", io);

io.on("connection", (socket)=>{
    console.log(`User connected!! ${socket.id}`);
    
    socket.on("join-event", (eventId)=>{
        socket.join(eventId);
        console.log(`${socket.id} Joined the room: ${eventId}`);
    });
    
    socket.on("disconnect", ()=>{
        console.log(`user disconencted :${socket.id}`);
    });
});



app.use(morgan("dev"));
app.use(express.json());

app.use((req, res, next) => {
  Object.defineProperty(req, 'query', {
    value: req.query,
    writable: true,
    enumerable: true,
    configurable: true
  });
  next();
});
app.use(mongoSanitize());


app.get("/health",(req, res)=>{
    const dbState =mongoose.connection.readyState ===1 ?"connected" :"disconnected";

    res.status(200).json({
        status: "OK",
        enviroment: process.env.NODE_ENV ||"development",
        database:dbState,
        uptime:`${Math.floor(process.uptime())} seconds`,
        timestamp: new Date().toISOString()
    });
});

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "EventPulse API",
      version: "1.0.0",
    },
  },

  apis: [path.join(__dirname, "./routes/*.js"), path.join(__dirname, "./app.js")],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css";

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCssUrl: CSS_URL,
    customJs: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js",
    ],
  })
);

app.use("/api/auth",authRouter);
app.use("/api/events",eventRouter);
app.use("/api/registrations", registrationRouter);
app.use("/api/announcements", announcementRouter);

app.use(errorHandler);

connectDB();

async function start(){

    const PORT =process.env.PORT || 3000;
    server.listen(PORT, ()=>{
        console.log(`Server running on port ${PORT}`);
    });

};

if (require.main === module) {
  start();
}

module.exports = app;