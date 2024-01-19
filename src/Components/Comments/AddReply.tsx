import supabase from "../../configSupa/supabaseConfiguration";
import { useRef } from "react";
import fetchData from "../../Utilities/Fetch";
import { useQuery } from "@tanstack/react-query";
import Loading from "../Loading/Loading";
import { TABLE_NAME } from "../../Utilities/CommonVariables";

function AddReply({ setIsReplyInputOpen, comment }: any) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const closeReplyInput = () => {
    setIsReplyInputOpen(false);
  };

  const { data: currentData, isLoading } = useQuery({
    queryKey: ["updateData"],
    queryFn: () => fetchData(),
  });

  const allProductRequests = currentData[0].productRequests ?? [];

  console.log(currentData[0].currentUser.name);

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
                content: inputRef.current?.value ?? "321321",
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
  );
}

export default AddReply;
