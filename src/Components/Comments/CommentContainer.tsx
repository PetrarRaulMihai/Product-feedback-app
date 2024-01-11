import { PropComment } from "../../Types/CommentTypes";
import img from "../../assets/user-images/image-judah.jpg";
import ReplyContainer from "./ReplyContainer";
import { Reply } from "../../Types/ReplyTypes";
import { useState } from "react";

// This component represents the main comment appearance without sub-comments
function CommentContainer({ comment }: PropComment) {
  const [showRepliesFlag, setShowRepliesFlag] = useState<boolean>(false);

  const displayReplies = () => {
    setShowRepliesFlag(!showRepliesFlag);
  };

  const repliesArr = comment.replies ?? [];

  return (
    <div>
      {/* parent container of the holy comment container*/}
      <div className="border-b-[1px] border-gray-400 pb-2">
        <div className="flex gap-3  pb-4">
          {/* left container */}
          <div>
            <img className="w-10 rounded-full" src={img}></img>
          </div>
          {/* right container */}
          <div className="flex w-full flex-col gap-3">
            {/* top container */}
            <div className="flex text-sm justify-between w-full">
              {/* name and user nickname container */}
              <div className="">
                <p className="font-semibold">{comment.user.name}</p>
                <p className="text-blue-500 font-semibold">
                  @{comment.user.username}
                </p>
              </div>
              {/* Reply button container */}
              <div className="flex justify-center items-center">
                <p className="text-blue-500 font-semibold">Reply</p>
              </div>
            </div>
            {/* bottom container */}
            <div>
              {/* Comment text */}
              {/* text exceeded.... tailwind class => truncate w-full */}
              <p className="text-sm text-gray-500">{comment.content}</p>
            </div>
          </div>
        </div>
        {/* Display comments ... */}
        <div>
          {repliesArr.length !== 0 && (
            <p className="text-sm text-gray-500 " onClick={displayReplies}>
              {showRepliesFlag ? "...hide" : "replies..."}
            </p>
          )}
        </div>
      </div>

      {/* here replies array will be rendered as map */}
      <div className="flex flex-col gap-1">
        {showRepliesFlag &&
          repliesArr?.map((replyItem: Reply) => {
            return <ReplyContainer replyItem={replyItem} />;
          })}
      </div>
    </div>
  );
}

export default CommentContainer;