const express = require('express');
const router = express.Router();
const {user, story, comment} = require("../../models");
const withAuth = require ('../../utils/auth');

router.get('/', (req,res) =>{
    story.findAll({
        attributes: 
        [
        'id',
        'title',
        'content',
        'created_at'
        ],
        order: 
        [
            'created_at',
            'DESC'
        ]
    })
    .then(dbStories => {
        res.json(dbStories);
    })
    .catch(err =>{
        res.status(500).json({msg: "Error", err});
    });
});

router.get("/:id", (req,res) => {
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
            'created_at',
        ],
        include: 
        [{
            model: user,
            attributes: ['username']
        },
        {
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
                attributes: ['username']
            }
        }]
    })
    .then(dbStories =>{
        if (!dbStories) {
            res.status(404).json({msg: 'No stories found'});
            return;
        }
        res.json(dbStories);
    })
.catch(err =>{
    res.status(500).json({msg: 'Error',err});
})
});

router.put('/:id', withAuth,(req,res)=>{
    story.update({
        title: req.body.title,
        content: req.body.content
    },
    {
        where:
        {
            id: req.params.id
        }
    })
    .then(dbStories => {
        if (!dbStories) {
            res.status(404).json({msg: 'No story found'});
            return;
        }
        res.json(dbStories);
    })
    .catch(err => {
        res.status(500).json({msg: 'Error',err});
    });
});

router.delete('/:id', withAuth, (req,res)=> {
    story.destroy({
        where:
        {
            id: req.params.id
        }
    })
    .then(dbStories => {
        if (!dbStories){
            res.status(404).json({msg: 'No story found'});
            return;
        }
        res.json(dbStories);
    })
    .catch(err => {
        res.status(500).json({msg:'Error',err});
    });
});

module.exports = router;