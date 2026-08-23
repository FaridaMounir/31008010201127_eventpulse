const dns = require("node:dns/promises");
dns.setServers(["1.1.1.1", "8.8.8.8"]);


require("dotenv").config();

const mongoose =require("mongoose");
const bcrypt =require("bcryptjs")
const User =require("./models/userSchema");
const Category =require("./models/categorySchema");
const Event = require("./models/eventSchema");

const seedData =async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Seed connected");

        const saltRounds =10;
        const hashedPassword =await bcrypt.hash("adminpassword123", saltRounds)


        const userAdmin =await User.findOneAndUpdate(
            {email: "admin@mail.com"},
            {
                name: "Admin user",
                email: "admin@mail.com",
                password: hashedPassword,
                role:"admin"
            },
            {upsert: true, new: true, runValidators: true}
        );
        console.log("Admin user ensured");
        

        const categoryNames =["Tech", "Music", "Sports"];
        const categories ={};

        for(const name of categoryNames){
            const cat =await Category.findOneAndUpdate(
                { name },
                { name, description: `${name} related events` },
                { upsert: true, new: true, runValidators: true }
            );
            categories[name] =cat._id;
        };
        console.log("Categories ensured");


        const sampleEvents =[
            {

              title: "Tech Innovation Event",
              description: "A technology and innovation event.",
              capacity: 200,
              date: new Date("2026-10-15"),
              city: "Cairo",
              category: categories["Tech"],
              organizer: userAdmin._id,
              venue: "Cairo Conference Center"

            },
            {
              title: 'Summer Music Festival',
              description: "The best music event out there!",
              capacity: 500,
              date: new Date('2026-07-20'),
              city: 'Alexandria',
              category: categories['Music'],
              organizer: userAdmin._id,
              venue: "Bibilotheca Alexandria Library"
            },
        ];

        for(const eventData of sampleEvents){
            await Event.findOneAndUpdate(
                {title: eventData.title},
                eventData,
                {upsert: true, new: true, runValidators: true}
            );
        };

        console.log("Sample events ensured");

        console.log("Seeding completed successfully!");
        await mongoose.disconnect();
        process.exit(0);

    }catch(error){
        console.error(`Seed error: ${error.message}`);
        process.exit(1);
    }
};

seedData();