import express from 'express'
import { GraphQLFloat, GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { createHandler } from 'graphql-http/lib/use/http';
import { Category, connectDB,Product } from './db/models.js';

const app = express()
const port = 3000
connectDB()
// const query = new GraphQLObjectType({
//     name: "RootQuery",
//     fields: {
//        user:{
//            type: new GraphQLObjectType({
//             name: 'User',
//             fields: {
//                 _id: {
//                     type: GraphQLID 
//                 },
//                 name: {
//                     type: GraphQLString
//                 }
//             }
//            }),
//            resolve: () => {
//             return {
//                 _id: 1,
//                 name: 'yousef'
//             }
//            } 
//        }
//     }
// })
// const schema =new GraphQLSchema({
//     query
// })
const categoryType = new GraphQLObjectType({
    name: "category",
    fields: {
        _id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        }
    }
})

const productType = new GraphQLObjectType({
    name: "product",
    fields: {
        _id: {
            type: GraphQLID
        },
        title: {
            type: GraphQLString
        },
        description: {
            type: GraphQLString
        },
        price: {
            type: GraphQLFloat
        },
        category: {
            type: categoryType,
            args: {
                count: {
                    type: GraphQLInt
                }
            },
            resolve: async(parent,args) => {
                if(args.id){
                    return await Category.findById(parent.category).limit(args.count)
                }
                return await Category.findById(parent.category)
                // return await Category.aggregate([{$match:{_id:new Types.ObjectId(parent.category)}}])
            }
        }
    }
})
const query = new GraphQLObjectType({
    name: "RootQuery",
    fields:{
        products:{
            type:new GraphQLList(productType),
            args: {
                sort:{
                    type:GraphQLString
                }
            },
            resolve: async(parent,args) => {
                if(args.sort){
                    return await Product.find().sort([[args.sort,'asc']])
                }
                return await Product.find()
            }
        }
    }
})

const schema = new GraphQLSchema({
    query,
    
})
app.all('/graphql',createHandler({schema}))
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})