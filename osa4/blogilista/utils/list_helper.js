const blog = require("../models/blog")

const dummy = (blogs) => { return 1 }

const totalLikes = (blogs) => {
    const total = blogs.reduce((sum, blog) => { return sum + blog.likes }, 0)
    return total
}

const favoriteBlog = (blogs) => {
    if (!blogs || blogs.length === 0) {
        console.log('No blog entries found')
        return null
    }
    const arrayForLikes = blogs.map(blog => blog.likes)
    const maxValue = Math.max(...arrayForLikes)
    return blogs.filter(blog => blog.likes === maxValue)[0]
}

const mostBlogs = (blogs) => {
    const nameSet = new Set ([])
    blogs.forEach(blog => {
        nameSet.add(blog.author)
    })

    const authors = []
    nameSet.forEach(authorName => {
        const authorWithCounter = {
            author:`${authorName}`, 
            blogs: blogs.filter(blog => blog.author===authorName).length
        }
        authors.push(authorWithCounter)
    })

    const authorsWithMostBLogs = authors.filter(author => author.blogs === Math.max(...authors.map(Tally => Tally.blogs)))

    return authorsWithMostBLogs[0]
}

const mostLikes = (blogs) => {

    const nameSet = new Set ([])
    blogs.forEach(blog => {
        nameSet.add(blog.author)
    })

    const authors = []
    nameSet.forEach(authorName => {
        const authorBlogs = blogs.filter(blog => blog.author === authorName)
        const authorWithLikes = {
            author:`${authorName}`, 
            likes: authorBlogs.reduce((sum, blog) => { return sum + blog.likes }, 0)
        }
        authors.push(authorWithLikes)
    })

    const authorsWithMostLikes = authors.filter(author => author.likes === Math.max(...authors.map(Tally => Tally.likes)))

    return authorsWithMostLikes[0]

}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }