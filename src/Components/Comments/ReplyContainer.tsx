import { ReplyItem } from "../../Types/ReplyTypes";
import img from "../../assets/user-images/image-judah.jpg";
import supabase from "../../configSupa/supabaseConfiguration";
import { useRef, useState } from "react";
import fetchData from "../../Utilities/Fetch";
import { useQuery } from "@tanstack/react-query";
import Loading from "../Loading/Loading";
import { TABLE_NAME } from "../../Utilities/CommonVariables";

// This component has the same design as CommentContainer component
function ReplyContainer({ replyItem, comment }: ReplyItem) {
  const [replyInput, setReplyInput] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const { data: currentData, isLoading } = useQuery({
    queryKey: ["updateData"],
    queryFn: () => fetchData(),
  });

  const allProductRequests = currentData[0].productRequests ?? [];

  console.log(currentData[0].currentUser.name);

  const closeReplyInput = () => {
    setReplyInput(false);
  };

  //   add reply to DB
  const addReply = async () => {
    console.log(comment);

    console.log(inputRef.current?.value);

    try {
      if (isLoading) {
        <Loading />;
      }
      const updatedArray = allProductRequests.map((productRequest: any) => {
        const updatedReplies = productRequest?.comments?.find((item: any) => {
          return item.id === comment.id;
        });

        if (updatedReplies) {
          if (!updatedReplies.hasOwnProperty("replies")) {
            // If 'replies' key does not exist, create it
            updatedReplies.replies = [
              {
                user: {
                  name: currentData[0].currentUser.name,
                  username: currentData[0].currentUser.username,
                },
                replyingTo: comment.user.username,
                content: inputRef.current?.value ?? "",
              },
            ];
          } else {
            // If 'replies' key exists, add to the array
            updatedReplies.replies = [
              {
                user: {
                  name: currentData[0].currentUser.name,
                  username: currentData[0].currentUser.username,
                },
                replyingTo: comment.user.username,
                content: inputRef.current?.value ?? "",
              },
              ...(updatedReplies.replies || []),
            ];
          }
        }

        return productRequest;
      });

      const { error } = await supabase
        .from(TABLE_NAME)
        .update({ productRequests: updatedArray })
        .eq("id", "90813cf7-fdee-4f10-aef5-ce2c1950c9c3");
      console.error(error);
    } catch {}
  };

  return (
    <div className="flex gap-3 ml-7 pl-2 border-l-[1px] border-gray-400 mt-4">
      {/* left container */}
      <div>
        <img className="w-10 rounded-full" src={img}></img>
      </div>
      {/* right container */}
      <div className="flex w-full flex-col">
        {/* top container */}
        <div className="flex text-sm justify-between w-full">
          {/* name and user nickname container */}
          <div className="">
            <p className="font-semibold">{replyItem?.user?.name}</p>
            <p className="text-blue-500 font-semibold">
              {replyItem?.user?.username}
            </p>
          </div>
          {/* Reply button container */}
          <div className="flex justify-center items-center">
            <p
              className="text-red-500 font-semibold cursor-pointer"
              onClick={() => setReplyInput(true)}
            >
              Reply
            </p>
          </div>
        </div>
        {/* bottom container */}
        <div className="mt-3">
          {/* Comment text */}
          {/* text exceeded.... tailwind class => truncate w-full */}
          <p className="text-sm text-gray-500">
            <span className="text-[#b532ec] font-bold">
              @{replyItem.replyingTo}{" "}
            </span>
            {replyItem.content}
          </p>
          {/* reply input */}
          {replyInput && (
            <div className="mt-2">
              <div>
                <label htmlFor="reply"></label>
                <input
                  id="reply"
                  type="text"
                  placeholder="Add reply..."
                  className="w-full outline-none border-b-2 border-gray-300"
                  ref={inputRef}
                ></input>
              </div>

              <div className="flex justify-end gap-4 text-sm">
                <button onClick={addReply}>Add</button>
                <button onClick={closeReplyInput}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReplyContainer;
