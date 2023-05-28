const {story} = require('../models');

const stories = [{
    title: 'Example 1',
    content: 'Example 1',
    user_id: 1
},
{
    title: 'Example 2',
    content: 'Example 2',
    user_id: 2
},
{
    title: 'Example 3',
    content: 'Example 3',
    user_id: 3
}
];

const seedStories = () => story.bulkCreate(stories);

module.exports = seedStories;