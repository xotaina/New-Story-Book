const express = require('express')
const Stories = require('./../models/Stories')
const User = require('./../models/User')
const {isAuthenticated} =require('../middleware/auth')

const router = express.Router()  

// show all stories add user 
router.get('/',isAuthenticated,(req,res)=>{
    Stories.findAll({order:[['createdAt','DESC']]}).then(stories => {

        res.render('stories/index',{
            story: stories.map(story => story.get({ plain: true }))
        })
    })
    .catch(err => console.log(err))
    
})

// show stories by a user
router.get('/user/:userId', isAuthenticated,(req,res) => {
    Stories.findAll({where:{user_id:req.params.userId}}).then(stories => {
        res.render('stories/index',{
            story: stories.map(story => story.get({ plain: true }))
        })
    })
    .catch(err => console.log(err))
 })

// Add Stories View
router.get('/add',isAuthenticated,(req,res) => {
    res.render("stories/add")
})

// create story with model
router.post('/',isAuthenticated,async(req,res) => {
    const {title,content} = req.body
    let errors = []
    if(!title){
        errors.push({msg:'Please add a title'})
    }
    if(!content){
        errors.push({msg:'Please add a content'})
    }
    if(errors.length > 0){
        res.render('stories/add',{
            layout:'auth',
            errors
        })
    }else{
        // validation passed
        const story = await Stories.create({
            title,
            content,
            user_id:req.session.user.id
        })
        .then(story => {
            res.redirect('/dashboard')
        })
        .catch(err => console.log(err))
    }
})


// view a story details with model add story owner firstname
router.get('/:id', isAuthenticated, (req,res) => {
    Stories.findOne({where:{id:req.params.id}
        })
    .then((story) => {
        const user = User.findByPk(story.dataValues.user_id)
        .then(user => {
            res.render('stories/details',{
                story: story ?story.get({ plain: true }) : null,
                user: user ?user.get({ plain: true }) : null
            })
        })
        .catch(err => console.log(err))
        // res.render('stories/show',{
        //     story
        // })
        
    })
    .catch(err => console.log(err))
})

// description = stories edit with model

router.get('/edit/:id',isAuthenticated,async(req,res)=>{
    Stories.findOne({where:{id:req.params.id}
        })
    .then((story) => {
        res.render('stories/edit',{
            story: story ?story.get({ plain: true }) : null
        })
    })
    .catch(err => console.log(err))
})

//update story details with model
router.post('/edit/:id',isAuthenticated,async(req,res) => {
    const {title,content} = req.body
    let errors = []
    if(errors.length > 0){
        res.render(`stories/edit/:${req.params.id}`,{
            errors
        })
    }else{
        // validation passed
        const story = await Stories.update({
            title,
            content
        },{where:{id:req.params.id}})
        .then(story => {
            res.redirect('/dashboard')
        })
        .catch(err => console.log(err))
    }
})

// delete story with model
router.post('/delete/:id',isAuthenticated,async(req,res)=>{
    const story = await Stories.destroy({where:{id:req.params.id}})
    .then(story => {
        res.redirect('/dashboard')
    })
    .catch(err => console.log(err))
})

module.exports = router