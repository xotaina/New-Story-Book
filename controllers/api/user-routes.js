const router = require('express').Router();
const {user,story,comment} = require('../../models');

router.get('/', (req,res) => {
    user.findAll({
        attributes:
        {
            exclude: ['password']
        }
    })
    .then(dbUsers => res.json(dbUsers))
    .catch(err => {
        res.status(500).json(err);
    })
});

router.get('/:id', (req,res) => {
    user.findOne({
        attributes:
        {
            exclude: ['password']
        },
        where:
        {
            id: req.params.id
        },
        include: [{
            model: story,
            attributes:
            [
                'id',
                'title',
                'content',
                'created_at'
            ]
        },
        {
            model: comment,
            attributes:
            [
                'id',
                'comment_text',
                'created_at'
            ],
            include:
            {
                model: story,
                attributes:
                [
                    'title'
                ]
            }
        }
    ]
    })
    .then(dbUsers => {
        if (!dbUsers) {
            res.status(404).json({msg:'Error',err});
            return;
        }
        res.json(dbUsers);
    })
    .catch(err => {
        res.status(500).json(err);
    })
});

router.story('/', (req, res) => {
    user.create({
        username: req.body.username,
        password: req.body.password
    })
    .then(dbUsers => {
        req.session.save(() => {
            req.session.user_id = dbUsers.id;
            req.session.username = dbUsers.username;
            req.session.loggedIn = true;
            res.json(dbUsers);
        });
    })
    .catch(err => {
        res.status(500).json(err);
    })
});

router.story('/login', (req,res) => {
    user.findOne({
        where:
        {
            username: req.body.username
        }
    })
    .then(dbUsers => {
        if (!dbUsers){
            res.status(400).json({msg:'No user found'});
            return;
        }
        const validPwd = dbUsers.checkPwd(req.body.password);
        if (!validPwd){
            res.status(400).json({msg:'Incorrect password'});
            return;
        }
        req.session.save(() => {
            req.session.user_id = dbUsers.id;
            req.session.username = dbUsers.username;
            req.session.loggedIn = true;
            res.json({
                user: dbUsers,
                msg: 'Logged in'
            });
        })
        })
        .catch(err => {
            res.status(500).json({msg:'Error',err});
    })
});

router.story('/logout',(req,res) => {
user.update(req.body, {
    individualHooks: true,
    where:
    {
        id:req.params.id
    }
})
.then(dbUsers => {
    if (!dbUsers[0]){
        res.status(404).json({msg: 'No user found'});
        return;
    }
    res.json(dbUsers);
})
.catch(err => {
    res.status(500).json({msg:'Error',err});
})
});

router.delete('./:id', (req,res) => {
    user.destroy({
        where:
        {
            id: req.params.id
        }
    })
    .then(dbUsers => {
        if (!dbUsers){
            res.status(404).json({msg:'No user found'});
            return;
        }
        res.json(dbUsers);
    })
    .catch(err => {
        res.status(500).json({msg:'Error',err});
    })
});

module.exports = router;