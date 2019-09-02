const express = require('express'),
nodemailer = require('nodemailer'),
mongoose = require('mongoose'),
app = express();

app.set('view engine', 'ejs');
let email = '';
//Database configuration
mongoose.connect("mongodb://localhost:27017/student_details", {useNewUrlParser : true});
const studentSchema = new mongoose.Schema({
    name: String,
    role: String,
    email: String,
    location: String
});
const Student = mongoose.model("Student", studentSchema);

// Student.create({
//     name: 'Nakul Rajput',
//     role: 'Web designer',
//     email: 'nakul56@gmail.com',
//     location: 'Hyderabad'
// }, function(err, createdStudent){
//     console.log(createdStudent);
// });

app.get('/', function(req, res){
    res.render("home");
});

app.get('/students', function(req, res){
    const role = new RegExp(escapeRegex(req.query.role), 'gi');
    const location = new RegExp(escapeRegex(req.query.location), 'gi');
    Student.find({$and: [{"location" : location},{ "role" : role}]}, function(err, foundStudents){
        if(err){
            res.send("Requested data not found");
        } 
        foundStudents.forEach(function(student){
            email += student.email + ',';
        })
        res.render("index", {students: foundStudents});
    })
});

app.get("/sendEmail", function(req, res){
    async function main() {
        let testAccount = await nodemailer.createTestAccount();
        let transporter = nodemailer.createTransport({
            host: '',//hostname
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: '',//username
                pass: '' //password
            }
        });
        console.log(email.substring(0, email.length-1));
        let info = await transporter.sendMail({
            from: '"Educare System" <shrutismiley26@gmail.com>', // sender address
            to: 'lohita159@gmail.com', // list of receivers
            subject: "Internship at Educare system", // Subject line
            html: 'Hello everyone, <p> This email is to notify you that you has been shortlisted for internship at Educare system.</p><br> Educare system' // html body
        });
    
        console.log('Message sent: %s', info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }
    
    main().catch(console.error);
    email ='';
    res.redirect('/');
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//Server configuration
app.listen(process.env.PORT || 3000, function(){
    console.log("Server has started");
});
