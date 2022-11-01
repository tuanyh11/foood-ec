import { clear } from "@testing-library/user-event/dist/clear";
import { useState, useEffect, useRef } from "react";
import {
  RiMore2Fill,
  RiPencilLine,
  RiDeleteBinLine,
  RiArrowRightLine,
  RiUser3Line,
} from "react-icons/ri";
import { useAuthSlice } from "../../../redux/hooks";
import CommentForm from "./CommentForm";
import ConfirmBox from "../ConfirmBox";
import { IMG_URL } from "../../../assets/Api";

const clickOutside = (contentRef, actionRef) => {
  document.addEventListener("click", (e) => {
    if (
      contentRef.current &&
      contentRef.current.contains(e.target) &&
      actionRef.current
    ) {
      actionRef.current.classList.toggle("hidden");
    } else if (
      contentRef.current &&
      actionRef.current &&
      !contentRef.current.contains(e.target)
    ) {
      actionRef.current.classList.add("hidden");
    }
  });
};

const Comment = ({
  comment,
  replies,
  className = "mt-4",
  setActiveComment,
  activeComment,
  addComment,
  deleteComment,
  updateComment,
  parentId = null,
  reply = false,
  showMore,
  setShowMore,
}) => {
  const [user] = useAuthSlice();
  const [showConfirmBox, setShowConfirmBox] = useState();

  const [isDelete, setIsDeleted] = useState(false);

  const actionRef = useRef(null);
  const contentRef = useRef(null);

  const isReply =
    activeComment &&
    activeComment._id === comment._id &&
    activeComment.type === "reply";
  const isEditing =
    activeComment &&
    activeComment._id === comment._id &&
    activeComment.type === "edit";

  const replyId = parentId || comment._id;

  useEffect(() => {
    if (isDelete) {
      deleteComment(comment._id);
      setShowConfirmBox();
    }
  }, [isDelete]);

  useEffect(() => {
    clickOutside(contentRef, actionRef);
    return () => {
      document.removeEventListener("click", () => {});
    };
  }, []);

  console.log(user?.avatar)

  return (
    <div className={`${className}`}>
      {showConfirmBox === comment._id && (
        <div className="fixed top-0 right-0 left-0 bottom-0 bg-rgba_1 z-50">
          <div className="absolute top-[50%] right-[50%] translate-x-[50%] translate-y-[-50%]">
            <ConfirmBox
              confirmLabel="yes"
              confirmTitle="Are you sure you want to delete"
              handleAccept={() => setIsDeleted(true)}
              handleDeny={() => setShowConfirmBox(false)}
            />
          </div>
        </div>
      )}

      <div className=" group flex  items-center ">
        {/* coment content */}
        <div className="mr-4 flex-shrink-0">
          {user?.avatar ? (
            <img
              className={`${
                reply ? "w-10 h-10" : "w-12 h-12"
              } rounded-full object-cover border-[1px] border-solid border-gray-200`}
              src={IMG_URL + user?.avatar}
              alt=""
            />
          ) : (
            <div className="rounded-full shadow-lg p-3">
                <RiUser3Line className="w-8 h-8   text-slate-700" />
            </div>
          )}
        </div>

        <div className={`${isEditing ? "w-full" : ""}`}>
          <div className="shadow-md p-2">
            <div className="flex items-center mb-2">
              <span className="text-sm font-extrabold mr-3">
                {comment.userName}
              </span>
              <p className="text-xs font-medium">
                {new Date(comment.createdAt).toLocaleDateString()}
              </p>
            </div>

            {isEditing ? (
              <CommentForm
                style={{ image: "w-14 h-14" }}
                submitLabel="update"
                initialText={comment.content}
                handleSubmit={(text) => updateComment(text, comment._id)}
                
              avatar={user?.avatar}
                handleCancel={() =>
                  setActiveComment({ _id: comment._id, type: "" })
                }
              />
            ) : (
              <p className="text-md text-gray-700 font-normal break-all">
                {comment.content}
              </p>
            )}
          </div>

          {/* reply actions */}
          <div className="mt-3 flex">
            <button
              className="text-xs font-bold mr-4"
              onClick={() =>
                setActiveComment({ _id: comment._id, type: "reply" })
              }
            >
              Reply
            </button>
            {user?._id === comment.userId && (
              <button
                onClick={() =>
                  setActiveComment({ _id: comment._id, type: "edit" })
                }
                className="text-xs font-bold mr-4 lg:hidden md:hidden"
              >
                Edit
              </button>
            )}
            {user?._id === comment.userId && (
              <button
                onClick={() => setShowConfirmBox(comment._id)}
                className="text-xs font-bold mr-4 lg:hidden md:hidden"
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {user?._id === comment.userId && !isEditing && (
          <div
            className=" relative ml-auto  hidden lg:flex md:flex"
            ref={contentRef}
          >
            <button className="opacity-0 group-hover:!opacity-[1]">
              <RiMore2Fill />
            </button>
            <div
              ref={actionRef}
              className={`absolute p-[8px_0] shadow-sm border-[1px] z-10 capitalize top-[120%] right-[-280%] bg-white hidden`}
            >
              <p
                onClick={() =>
                  setActiveComment({ _id: comment._id, type: "edit" })
                }
                className="flex items-center p-[8px_30px] text-sm hover:bg-gray-300 cursor-pointer"
              >
                <RiPencilLine className="mr-2 text-main" />
                edit
              </p>

              <p
                onClick={() => setShowConfirmBox(comment._id)}
                className="flex items-center p-[8px_30px] text-sm  hover:bg-gray-300 cursor-pointer"
              >
                <RiDeleteBinLine className="mr-2 text-main " />
                delete
              </p>
            </div>
          </div>
        )}
      </div>

      {isReply && (
        <CommentForm
          style={{
            image: "w-10 h-10",
            form: comment.parentId ? "" : "ml-[50px] lg:ml-[70px] ",
          }}
          
          avatar={user?.avatar}
          submitLabel="reply"
          handleSubmit={(text) => addComment(text, replyId, activeComment.type)}
          handleCancel={() => setActiveComment({ _id: comment._id, type: "" })}
          avatarUser={IMG_URL + user?.avatar}
        />
      )}

      {/* reply comment */}

      {replies.length > 0 && !showMore.includes(comment._id) && (
        <div
          className="flex items-center hover:underline cursor-pointer ml-[60px] mt-2"
          onClick={() => setShowMore((pre) => [...pre, comment._id])}
        >
          <RiArrowRightLine />
          <p className="ml-2 text-sm font-bold">{`${replies.length} ${
            replies.length > 1 ? "responses" : "response"
          } `}</p>
        </div>
      )}
      {replies.length > 0 &&
        showMore.includes(comment._id) &&
        replies.map((reply, index) => (
          <div className="ml-[50px] lg:ml-[70px]" key={reply._id}>
            <Comment
              replies={[]}
              comment={reply}
              key={reply._id}
              className="mt-2"
              setActiveComment={setActiveComment}
              activeComment={activeComment}
              addComment={addComment}
              parentId={comment._id}
              deleteComment={deleteComment}
              updateComment={updateComment}
              reply={true}
            />
          </div>
        ))}

      {/* action comment */}
    </div>
  );
};

export default Comment;
