const express = require('express')
const router = express.Router()
const User = require('./../models/User')
const Stories = require('./../models/Stories')
const {isAuthenticated} =require('../middleware/auth')
// const bcrypt = require('bcrypt')

// login
router.get('/',(req,res) =>{
    res.render('auth/login',{
        layout:'auth'
    })
})

// login handle
router.post('/login',(req,res) =>{
    const {email,password} = req.body
    let errors = []

    // check required fields
    if(!email || !password){
        errors.push({msg:'Please fill in all fields'})
    }

    if(errors.length > 0){
        res.render('auth/login',{
            layout:'auth',
            errors
        })
    }else{
        // validation passed
        const user = User.findOne({where:{email:email}})
        .then(user =>{
            if(!user){
                // user not found
                errors.push({msg:'Email is not registered'})
                res.render('auth/login',{
                    layout:'auth',
                    errors
                })
            }else{
                // use User checkPwd function to compare password 
                if( password === user.dataValues.password){
                    // password match save session with express session
                    req.session.user = user
                    res.redirect('/dashboard')
                }else{
                    // password does not match
                    errors.push({msg:'Password is incorrect'})
                    res.render('auth/login',{
                        layout:'auth',
                        errors
                    })
                }
            }
        })
        .catch(err => console.log(err))
    }
})

// register
router.get('/register',(req,res) =>{
    res.render('auth/register',{
        layout:'auth'
    })
})

// register handle
router.post('/register',(req,res) =>{
    const {firstname,lastname,email,password,password2} = req.body
    let errors = []

    // check required fields
    if(!firstname || !lastname || !email || !password || !password2){
        errors.push({msg:'Please fill in all fields'})
    }

    // check password match
    if(password !== password2){
        errors.push({msg:'Passwords do not match'})
    }

    // check password length
    if(password.length < 6){
        errors.push({msg:'Password should be at least 6 characters'})
    }

    if(errors.length > 0){
        res.render('register',{
            layout:'auth',
            errors
        })
    }else{
        // validation passed
        User.findOne({where:{email:email}})
        .then(user =>{
            if(user){
                // user exists
                errors.push({msg:'Email is already registered'})
                res.render('auth/register',{
                    layout:'auth',
                    errors
                })
            }else{
                User.create({firstname,lastname,email,password})
                .then(user =>{
                    res.render('auth/login',{
                        layout:'auth',
                        success:'Registration Successful. '
                    })
                })
                .catch(err => console.log(err))
            }
        })
    }
})

// dashboard
router.get('/dashboard',isAuthenticated,(req,res) =>{
    // get user stories
    Stories.findAll({where:{user_id:req.session.user.id}})
    .then(stories =>{
        const plainStories = stories.map(story => story.get({ plain: true }));
       
        res.render('auth/dashboard',{
            layout:'main',
            stories:plainStories,
            user:req.session.user
        })

    })
    .catch(err => console.log(err))
})

// logout
router.get('/logout',(req,res)=>{
    req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
        }
        res.redirect('/');
      });
})

module.exports = router