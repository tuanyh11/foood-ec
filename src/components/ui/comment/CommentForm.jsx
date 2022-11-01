import {useState} from 'react'
import { RiUser3Line } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import { IMG_URL } from '../../../assets/Api'
import { useAuthSlice } from '../../../redux/hooks'

const CommentForm = ({
    submitLabel, 
    handleSubmit,
    style = {
        image: 'w-14 h-14',
        form: ''
    },
    initialText = '',
    handleCancel = false,
    avatar=''
}) => {

    const nav = useNavigate()
    const [user] = useAuthSlice()
    const [text, setText] = useState(initialText)

    const onSubmit = (e) => {
        if(user?.token) {
            e.preventDefault()
            handleSubmit(text)
            setText('')
            handleCancel && handleCancel()
        } else nav("/login")

    }


  return (
    <form className={`flex items-center mt-2  lg:w-full  ${style.form}`} onSubmit={onSubmit}>
          {avatar ? (
            <img
              className={`first-line:rounded-full w-16  h-16 rounded-full object-cover border-[1px] border-solid border-gray-200 shadow-md`}
              src={IMG_URL + avatar}
              alt=""
            />
          ) : (
            <div className="rounded-full shadow-lg p-3">
                <RiUser3Line className="w-8 h-8   text-slate-700" />
            </div>
          )}
        <div className="w-full p-2 " >
            <input 
                placeholder="Your comment...." 
                type="text" 
                className= "outline-none border-b-2 w-full text-sm focus:border-b-main transition origin-center duration-300" 
                value={text}
                // onFocus={() => setDisplayActComent(true)}
                onChange={(e) => setText( e.target.value)}
                />
            {
                // displayActComent ? 
                <div className="mt-2 flex justify-end items-center">
                    {handleCancel && 
                    (
                        <button 
                            type="button" 
                            className="p-2 text-xs  font-bold text-gray-600 uppercase mr-4"
                            onClick={() => handleCancel()}
                        >
                            Cancel
                        </button>
                    )
                    }
            
                    <button 

                        disabled={text.length === 0}
                        className={`p-2 text-xs font-bold text-white uppercase bg-emerald-400 rounded-sm ${!text && 'opacity-50 cursor-not-allowed'}`}
                    >
                        {submitLabel}
                    </button>
                </div>
                // : null
            }
        </div>
    </form>
  )
}

export default CommentForm