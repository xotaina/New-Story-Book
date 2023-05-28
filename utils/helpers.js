module.exports = {
    format_date: date => {
        return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(date).getFullYear()}`;
    },
    truncate:(str,len) =>{
        if (str.length > len && str.length >0) {
            let new_str = str + ' '
            new_str = str.substr(0,len)
            new_str = str.substr(0,new_str.lastIndexOf(' '))
            new_str = new_str.length > 0 ? new_str :str.substr(0,len)

            return new_str + '...'
        }
        return str
    },
    stripTags :(input) =>{
        return input.replace(/<(?:.|\n)*?>/gm, '')
    },

    edit:(storyUser,loggedUser,storyId) =>{
        if (storyUser._id.toString() == loggedUser._id.toString()){
            return `<a href="/stories/edit/${storyId}" class="btn btn-outline-primary"><i class="fa fa-edit"></i>Edit Story</a>`
            console.log(storyId)
        }
        else{
            return ''
        }
    },
    select:(selected,options)=>{
        return options
                .fn(this)
                .replace(
                    new RegExp(' value="'+ selected +'"'),
                    '$& selected="selected"'
                )
                .replace(
                    new RegExp('>'+ selected +'</option>'),
                    ' selected="selected"$&'
                )
    },
    sN:(index)=>{
        return index + 1
    }
}