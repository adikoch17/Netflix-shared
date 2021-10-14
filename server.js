const express= require('express');
const mongoose = require('mongoose');
const app = express();
const routes = require('./routes/router');
const cors = require("cors");


app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/styles",express.static(__dirname + "/styles"));
app.use("/images",express.static(__dirname + "/images"));

app.use(cors());

mongoose.connect('mongodb://localhost:27017/tarp',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
     useFindAndModify: false
});

const db = mongoose.connection;

db.on('error',()=>{console.log("error")});
db.once('open',()=>{console.log("connected to db")});

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String
});

const mysubsSchema = new mongoose.Schema({
    usermail:String,
    service:String,
    email:String,
    password:String
});

const subSchema = new mongoose.Schema({
    host:String,
    service:String,
    email:String,
    password:String
});
const user = mongoose.model('user',userSchema);
const sub = mongoose.model('sub',subSchema);
const mysub = mongoose.model('mysub',mysubsSchema);


//INDEX

app.get('/',(req,res)=>{
    var email = req.params.id;
   res.render('index');

})

//HOME

app.get('/home::id',(req,res)=>{
    let id = req.params.id
    user.findById(id)
    .then(usr =>{
        mysub.findOne({usermail:usr.email})
        .then(usersubs => {
            sub.findOne({host:usr.email})
            .then(hst=>{
        console.log(usr._id);
        console.log(usersubs,"hello");
        if(usersubs && hst){
            res.render('home',{data:usersubs,id:usr._id,host:true});
        }
        else if(usersubs){
            res.render('home',{data:usersubs,id:usr._id,host:false});
        }
        else{
            res.render('home',{data:"none",id:usr._id,host:false});
            }
          })
        })
    })
})


//GET MY SUBS
app.post('/mysubs',(req,res)=>{
    console.log(req.body);
    let dataToSend={};
    let email = req.body.email;
    console.log(email)
    mysub.findOne({usermail:"aditya.kocherlakota@gmail.com"})
    .then(userSub =>{
        console.log(userSub);
        if(userSub){
            dataToSend = {email:userSub.email,pass:userSub.password}
            res.send({email:userSub.email,pass:userSub.password});
        }
        else{
            res.send({message:"no"});
        }
    })
    .catch(err =>{
        console.log("not avail");
    })
})

//SIGN UP

app.post('/signup',(req,res)=>{

    var data = req.body;
    console.log(data);
    user.findOne({email:data.email})
    .then(user=>{
        if(user){
            throw new Error("user already exists")
        }
    })
    .then(()=>{
        let userData = new user({...data});
        userData.save((err,userDet)=>{
            if(err){
                throw new Error("Error in creating user");
            }
            else{
                console.log(userDet,"registration successful")
                res.send({message:"successful"})
            }
        })
    })
    .catch(err =>{
        console.log("errorrrr",err);
        res.send({message:"error"});
    })

});

// LOG IN

app.post('/login',(req,res)=>{

    var data = req.body;
    console.log(data);
    user.findOne({email:data.email})
    .then(user =>{
        if(user){
            if(user.password===data.password){
                res.send({message:"yes",id:user._id});
            }
            else{
                res.send({message:"no"});
            }
        }
        else{
            res.send({message:"user does not exist"});
        }
        
    })

});


//SHARE SUBSCRIPTION

app.post('/shareSub',(req,res)=>{

    var data = req.body;
    sub.findOne({email:data.email,service:data.service})
    .then(subData =>{
        if(subData){
            res.send({message:"sub already exists from this account"})
        }
        else{
            var subDet = new sub({...data});
            subDet.save((err,det)=>{
                if(err){
                    res.send({message:"errorr"});
                }
                else{
                    res.send({message:"shared"});
                }
            })

        }
    })

})

//Join NETFLIX


app.get('/addPartic',(req,res)=>{
    res.render('addPart');
})

app.post('/addParticipant',(req,res)=>{
    let host = req.body.host;
    let pid = req.body.part;
    console.log(pid);
    sub.findOne({host:host})
    .then(sb =>{
        user.findById(pid)
        .then(usr =>{
        var mysubDet = new mysub({usermail:usr.email,service:"Netflix",email:sb.email,password:sb.password});
        mysubDet.save((err,det)=>{
            if(err){
                res.send({message:"errorr"});
            }
            else{
                res.send({message:"joined"});
                }
            })
        })
    })
    .catch(err=>{
        console.log(err);
        })
})


//GET MY SUBS

app.post('/addnetflix',(req,res)=>{
    console.log(req.body);
    var data = new mysub(req.body);
    res.send({message:"yes"});
    data.save();

})

//MANAGE SUBS

app.get('/manageSubscriptions::id',(req,res)=>{
    let id=req.params.id;
    console.log(req.params.id);
    user.findById(id)
    .then(usr=>{
        sub.findOne({host:usr.email})
        .then(sb=>{
            mysub.find({email:sb.email})
            .then(msub =>{
                console.log(msub);
                if(sb){
                    res.render('manSub',{email:sb.email,users:msub});
                }
                else{
                    res.render('manSub');
                }
            })
        })
    })
})

app.post('/manSubDel',(req,res)=>{
    let id =req.body.id;
    user.findById(id)
    .then(usr=>{
        sub.findOne({host:usr.email})
        .then(sb=>{
            mysub.find({email:sb.email})
            .then(mysubs => {
                sub.findOneAndDelete({host:usr.email},(err,doc)=>{console.log(err);});
                let i = 0;
                mysubs.forEach(msub=>{
                    console.log(msub,++i);
                    mysub.findOneAndDelete({usermail:msub.usermail},(err,doc)=>{console.log(err);});
                   
                })
                res.send({message:"deleted"});
            })
        })
    })
});

// ROUTES

app.use('/',routes);


app.listen(3000,()=>{
    console.log("connected to server");
})