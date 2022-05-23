const PORT = 3000;

const exp = require("constants");
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const { Booking } = require("./models/Booking");
const qrcode = require('qrcode')

let mongoDB_link = "Your MongoDB server link goes here"

mongoose.connect(mongoDB_link)
    .then(()=>{
        console.log("Mongobb connected!");
    })
    .catch(err=>{
        console.log("Connection Failed");
        console.log(err);
    })

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));

const sports = ["Badminton","Gym","Billards","Tennis"];

const checkCollision = async (req,res,next)=>{

    console.log(req.body);
    
    const collisionSlots = await Booking.find({
        date: req.body.date
    });

    let newstart = req.body.starthours;
    let newend = parseInt(req.body.starthours) + parseInt(req.body.duration);

    let ok = true;

    collisionSlots.forEach(element=>{

        if( newstart>=element.starthours && newstart<element.endhours ) {
            ok=false;
        }
        if( newend>element.starthours && newend<=element.endhours ) {
            ok=false;
        }
    });

    if(ok) {
        return next();
    } else {
        res.send(`<script>alert("Collision detected in selected timing and booked slots! Please select valid slot!"); window.location.href="/${req.body.sport}"</script>`)
    }


};

const generateQR = async (text)=>{
    const qr = await qrcode.toDataURL(text);
    return qr;
}

app.listen(PORT,()=>{
    console.log(`Listening to port ${PORT}`);
});

app.get("/query",(req,res)=>{

    res.render("query");

});

app.get("/",(req,res)=>{

    res.render("home");

});

app.post("/booking",checkCollision,async (req,res)=>{

    console.log(req.body);

    req.body.endhours = parseInt(req.body.starthours) + parseInt(req.body.duration);
    const newBooking = new Booking(req.body);

    const getQrcode = async (data)=>{
      
        const qrcode1 = await generateQR(data._id.toString());

        res.render("confirmation",{qr: qrcode1});
    }

    
    newBooking.save()
        .then((data)=>{
            getQrcode(data);
        })
        .catch(err=>{
            console.log("Failed to Saved!");
            res.send("Failed");
        })


});


app.get("/:Sport", async (req,res)=>{

    const getSport = req.params.Sport;

    if(!sports.includes(getSport)) {
        return res.send("<script>alert('Not a valid Page'); window.location.href='/'</script>");
    }

    if(req.query.date===undefined) {
        req.query.date = new Date();
    }
    
    const getDate = new Date(req.query.date);
    console.log(getDate);

    const getLists = await Booking.find({
        sport:getSport,
        date:getDate
    });

    console.log(getLists);

    res.render("booking",{sport:getSport, bookedSlots: getLists });

});

