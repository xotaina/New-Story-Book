const {comment} = require('../models');

const comments = [{
    comment_text: 'Example',
    user_id: 1,
    story_id: 1
},
{
    comment_text: 'Example2',
    user_id: 2,
    story_id: 2
},
{
    comment_text: 'Example3',
    user_id: 3,
    story_id: 3
}];

const seedComments = () => comment.bulkCreate(comments);

module.exports = seedComments;