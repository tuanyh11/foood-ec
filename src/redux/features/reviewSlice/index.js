import {createSlice} from '@reduxjs/toolkit'



const initialState = {
    comments: [],
    productComments: [],
    length: 0,
}

const getLength = (comments) => comments.length

const commentSlice = createSlice({
    initialState,
    name: 'comment',
    reducers: { 
        initComment: (state, action) => {
            state.comments = action.payload.comments
            state.length = action.payload.length
        },
        addComment: (state, action) => {
            console.log(action.payload)
            state.comments = [...state.comments, action.payload]
            state.length = ++state.length
        }, 
        getComments: (state, action) => {
            const newcomment = state.comments.filter((comment) => comment.productId === action.payload)
            state.productComments = newcomment
        },
        delComment: (state, action) => {
            state.comments = state.comments.filter((comment) => comment._id !== action.payload)
            state.length = --state.length
        },
        updateComment: (state, action) => {
            state.comments = state.comments.map((comment) => {
                if(comment._id === action.payload._id) return {
                    ...comment, 
                    content: action.payload.content
                }
                return comment
                
            })
            state.length = ++state.length
        }
    }
})

export const commentActions = commentSlice.actions

export default commentSlice.reducer