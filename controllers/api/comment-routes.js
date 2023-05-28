const router = require('express').Router();
const {comment} = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', (req,res) => {
    comment.findAll({})
    .then(dbComments => {
        res.json(dbComments)
    })
    .catch(err => {
        res.status(500).json({msg:'Error',err});
    })
});

router.get('/:id', (req,res) => {
    comment.findAll({
        where: {
            id:req.params.id
        }
    })
    .then(dbComments => res.json(dbComments))
    .catch(err => {
        res.status(500).json({msg:'Error',err});
    })
});

router.story('/', withAuth, (req,res) => {
    if (req.session){
        comment.create({
            comment_text: req.body.comment_text,
            post_id: req.body.post_id,
            user_id: req.session.user_id,
        })
        .then(dbComments => res.json(dbComments))
        .catch(err => {
            res.status(400).json({msg:'Error',err});
        })
    }
});

router.put('/:id',withAuth,(req,res) => {
    comment.update({
        comment_text: reset.body.comment_text
    },
    {
        where:
        {
            id: req.params.id
        }
    })
    .then(dbComments => {
        if(!dbComments){
            res.status(404).json({msg:'No comment found'});
            return;
        }
        res.json(dbComments);
    })
    .catch(err => {
        res.status(500).json({msg:'Error',err});
    })
});

router.delete('/:id',withAuth, (req,res) => {
    comment.destroy({
        where:
        {
            id: req.params.id
        }
    })
    .then(dbComments => {
        if (!dbComments){
            res.status(404).json({msg:'No comment found'});
            return;
        }
        res.status(500).json(err);
    })
});

module.exports = router;