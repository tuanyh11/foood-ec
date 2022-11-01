import {useState, useEffect} from 'react'
import { useAuthSlice, useReviewSlice} from '../../../redux/hooks'
import {useDispatch} from 'react-redux'
import Comment from './Comment'
import CommentForm from './CommentForm'
import { useNavigate, useParams } from 'react-router-dom'
import Pagination from '../Pagination'
import { createComment, deleteComment, updateCommentApi } from '../../../assets/Api'
import { useCallback } from 'react'



const Comments = ({user = null, limitComment = 10, comments = [], addComment, delComment, commentBucketId, updateComment}) => {

    const dispatch = useDispatch()

    const navigation = useNavigate()

    const {id} = useParams()

    const [activeComment, setActiveComment] = useState()

    const [showMore, setShowMore] =  useState([])

    const [rootComments, setRootComments] = useState([])

    const sort = useCallback(() => {
        const userComments = comments.filter((comment) => comment.userId === user?._id)
                                     .sort( (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        const otherComments = comments.filter(comment => comment.userId !== user?._id)
        return [...userComments, ...otherComments].filter(comment => comment.parentId === null)
    }, [comments, user?._id])
    

    useEffect(() => {
        setRootComments(sort())
    }, [sort])

    const getRepliesComment = (commentId) => comments.filter(comment => comment.parentId === commentId)
                                                     .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    // comment form 

    const addCommentAsync = async (text, parentId = null, type = '') => {
        try {
            const {data} = await createComment(id, {content: text, parentId})
            dispatch(addComment({...data.data, user: {userId: user?._id, avatar: user?.avatar}}))
        } catch (error) {
            console.log(error)
        }
    }


    const deleteCommentAsync = async ( commentId) => {
        try {
            await deleteComment({productId: id, commentId, id: commentBucketId})
            dispatch(delComment(commentId))
        } catch (error) {
            console.log(error)
        }
    }
    
    const updateCommentAsync = async (text, commentId) => {
        try {
            const {data} = await updateCommentApi({productId: id, commentId, id: commentBucketId, content: text})
            dispatch(updateComment({_id: commentId, content: text}))
        } catch (error) {
            console.log(error)
        }
    }

    const defaultRootComment = sort()


  return (
    <div >
       
        <CommentForm
            submitLabel="write"
            handleSubmit={(text) => addCommentAsync(text, null, 'adding')}
            handleCancel={() => setActiveComment({id: '', type: ''})}
            avatar={user?.avatar}
        />
        {
            rootComments.map((comment, index) => (
                <Comment 
                    key={comment._id} 
                    comment={comment} 
                    replies={getRepliesComment(comment._id)}
                    setActiveComment={setActiveComment}
                    activeComment={activeComment}
                    addComment={addCommentAsync}
                    deleteComment={deleteCommentAsync}
                    updateComment={updateCommentAsync}
                    showMore={showMore}
                    setShowMore={setShowMore}
                />
            ))
        }

    </div>
  )
}

export default Comments