const express = require('express');
const router = express.Router()

router.get('/signup',(req,res)=>{
    res.render('signup');
});

router.get('/login',(req,res)=>{
    res.render('login');
})

router.get('/shareSubscription',(req,res)=>{
    res.render('sharesub');
})
router.get('/joinSubscription',(req,res)=>{
    res.render('joinsub');
})



module.exports= router;