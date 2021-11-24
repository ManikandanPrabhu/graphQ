const express = require('express');
// const expressGraphQL = require('express-graphql').graphqlHTTP;
const {graphqlHTTP} = require('express-graphql')
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull } = require('graphql');
const app = express();
const authors = [
    {id: 1, name : 'JK Rowling'},
    { id: 2, name: 'Queen' },
    { id: 3, name: 'King' }
];
const books =  [
    {id: 1 , name: 'Harry Ppotter secrets', authorId: 1},
    { id: 2, name: 'Ppotter secrets', authorId: 1 },
    { id: 3, name: 'secrets', authorId: 1 },
    { id: 4, name: 'last Secret', authorId: 1 },
    { id: 5, name: 'Queen Arthure Secret', authorId: 2 },
    { id: 6, name: 'Queen Elizabeth Secret', authorId: 2 },
    { id: 7, name: 'King seven Secret', authorId: 3 },
    { id: 8, name: 'King Eleven Secret', authorId: 3 }
];
const AuthorType = new GraphQLObjectType({
    name: 'Authors',
    description: 'List of Authors of a book',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt)},
        name: {type: new GraphQLNonNull(GraphQLString)},
        books: {
            type: new GraphQLList(BookType),
            resolve: (author) => {
                return books.filter((book) => book.authorId == author.id)
            }
        }
    })
})

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'Books written by Author',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLString) },
        author: {
            type: AuthorType,
            resolve: (book) =>{
                return authors.find(author => author.id == book.authorId)
            } 
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addBook: {
            type: BookType,
            description: 'Add a book',
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                authorId: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent, args) => {
                const book = {
                    id: books.length +1,
                    name : args.name,
                    authorId: args.authorId
                }
                books.push(book);
                return book;
            }
        },
        addAuthor: {
            type: AuthorType,
            description: 'Add an Author',
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) }                
            },
            resolve: (parent, args) => {
                const author = {
                    id: authors.length + 1,
                    name: args.name                    
                }
                authors.push(author);
                return author;
            }
        }
    })
})
const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: ()=> ({
        book: {
            type: BookType,
            description: 'A single book',
            args:  {
                id: {
                    type: GraphQLInt
                }
            },
            resolve: (parent, args) => books.find( (book) => book.id == args.id)
        },
        books: {
            type: new GraphQLList(BookType),
            description: 'List of all books',
            resolve: () => books
        },
        author: {
            type: AuthorType,
            description: 'A single Author',
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => authors.find((author) => author.id == args.id)
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'List of all Authors',
            resolve: () => authors
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));
app.listen(5000., () => console.log("server is runing for graphql"));