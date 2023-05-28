const router = require('express').Router();
const sequelize = require('../config/connection');
const {user,story,comment} = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, (req,res) => {
    story.findAll({
        where:
        {
            user_id: req.session.user_id
        },
        attributes:
        [
            'id',
            'title',
            'content',
            'created_at'
        ],
        include: [{
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
        const stories = dbStoryData.map(story => story.get({plain: true}));
        res.render('dashboard', {posts, loggedIn: true});
    })
    .catch(err =>{
        res.status(500).json({msg:'Error',err});
    })
});

router.get('/edit/:id', withAuth,(req,res) => {
    story.findOne({
        where:
        {
            id: req.params.id
        },
        attributes:
        [
            'id',
            'title',
            'content',
            'created_at'
        ],
        include:
        [{
            model: user,
            attributes:
            [
                'username'
            ]
        },
        {
            model: comment,
            attributes:
            [
                'id',
                'comment_text',
                'story_id',
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
        }
    ]
    })
    .then(dbStoryData => {
        if (!dbStoryData){
            res.status(404).json({msg:'No story found'});
            return;
        }
        const story = dbStoryData.get({plain:true});
        res.render('edit-story', {story,loggedIn:true});
    })
    .catch(err => {
        res.status(500).json({msg:'Error',err});
    })
});

router.get('/new',(req,res) => {
    res.render('new-story');
});

module.exports = router;