const sequelize = require('../config/connection');
const {story,user,comment} = require('../models');
const router = require('express').Router();

router.get('/',(req,res) => {
    story.findAll({
        attributes:
        [
            'id',
            'title',
            'content',
            'created_at'
        ],
        include:
        [{
            model: comment,
            attributes:
            [
                'id',
                'comment_text',
                'post_id',
                'user_id',
                'created_at'
            ],
            include:
            {
                model: user,
                attributes:
                [
                    'username'
                ]
            }
        }]
    })
    .then(dbStoryData => {
        const stories = dbStoryData.map(story => story.get({plain:true}));
        res.render('homepage',{stories,loggedIn: req.session.loggedIn});
    })
    .catch(err => {
        res.status(500).json({msg:'Error',err});
    })
});

router.get('/login', (req,res) => {
    if (req.session.loggedIn){
        res.redirect('/');
        return;
    }
    res.render('login');
});

router.get('/signup', (req,res) => {
    res.render('signup');
});

router.get('/story/:id', (req,res) => {
    story.findOne({
        where:
        {
            id: req.params.id
        },
        attributes: 
        [
            'id',
            'content',
            'title',
            'created_at'
        ],
        include:
        [{
            model: comment,
            attributes:
            [
                'id',
                'comment_text',
                'post_id',
                'user_id',
                'created_at'
            ],
            include:
            {
                model: user,
                attributes:
                [
                    'username'
                ]
            }
        }]
    })
    .then(dbStoryData => {
        if(!dbStoryData){
            res.status(404).json({msg:'No story found'});
            return;
        }
        const story = dbStoryData.get({plain:true});
        res.render('sigle-story',{story, loggedIn:req.session.loggedIn});
    })
    .catch(err => {
        res.status(500).json({msg:'Error', err});
    })
});

router.get('/story-comments', (req,res) => {
    story.findOne({
        where:
        {
            id: req.params.id
        },
        attributes:
        [
            'id',
            'content',
            'title',
            'created_at'
        ],
        include:
        [{
            model: comment,
            attributes:
            [
                'id',
                'comment_text',
                'post_id',
                'user_id',
                'created_at'
            ],
            include:
            {
                model: user,
                attributes:
                [
                    'username'
                ]
            }
        }]
    })
    .then(dbStoryData => {
        if(!dbStoryData){
            res.status(404).json({msg:'Error',err});
            return;
        }
        const story = dbStoryData.get({plain:true});
        res.render('stories-comments', {story,loggedIn: req.session.loggedIn});
    })
    .catch(err => {
        res.status(500).json({msg:'Error',err});
    })
});

module.exports = router;