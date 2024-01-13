import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import arrowUp from "../assets/shared/icon-arrow-up.svg";
import arrowLeft from "../assets/shared/icon-arrow-left.svg";
import commentsIcon from "../assets/shared/icon-comments.svg";
import CommentContainer from "../Components/Comments/CommentContainer";
import AddComment from "../Components/Comments/AddComment";
import CommentType from "../Types/CommentTypes";
import AddFeedback from "../Components/AddingButton";
import styles from "../styles/FeedbackInfo.module.css";
import supabase from "../configSupa/supabaseConfiguration";
import fetchData from "../Utilities/Fetch";
import Loading from "../Components/Loading/Loading";

type SaveChangesData = {
  title: string;
  description: string;
};

function FeedbackInfo() {
  const location = useLocation();
  const feedbackData = location.state;

  const [upVotes, setUpVotes] = useState<number | null>(feedbackData.upvotes);

  const [isEditable, setIsEditable] = useState(false);

  const [title, setTitle] = useState(feedbackData.title);
  const [description, setDescription] = useState(feedbackData.description);

  const incrementUpVotes = () => {
    setUpVotes((prev) => (prev !== null ? prev + 1 : 1));
  };

  //comments
  const comments = feedbackData.comments ?? []; //verifica null sau undefined

  const replies = comments.map((item: CommentType) => {
    return item.replies?.length ?? 0;
  });

  //replies
  const totalReplies = replies.reduce((acc: number, curr: number) => {
    return acc + curr;
  }, 0);

  //function to Edit mode
  const handleEdit = () => {
    setIsEditable(true);
  };

  const { data: currentData, isLoading } = useQuery({
    queryKey: ["myData"],
    queryFn: () => fetchData(),
  });

  const updateProductRequestTitle = async (
    rowId,
    productRequestId,
    newTitle
  ) => {
    try {
      if (isLoading) {
        return <Loading />;
      }

      console.log(currentData);
      // Find and update the specific element
      const updatedData = currentData[0].productRequests.map((request) => {
        return request.id === productRequestId
          ? { ...request, title: newTitle }
          : request;
      });
      console.log(updatedData);

      // Update the entire array
      const { data: updateData, updateError } = await supabase
        .from("Product-feedback-app")
        .update({ productRequests: updatedData })
        .eq("id", rowId);

      if (updateError) {
        throw new Error("Error updating data");
      }

      return updateData;
    } catch (error) {
      console.error("Error updating data:", error);
      throw error;
    }
  };

  const handleClick = () => {
    updateProductRequestTitle(
      "7db0b938-adff-477a-8c64-a9bd28c2b652",
      feedbackData.id,
      title
    );
  };

  // function to edit the title input
  const handleTitleChange = (e: any) => {
    setTitle(e.target.value);
  };

  // function to edit the description input
  const handleDescriptionChange = (e: any) => {
    setDescription(e.target.value);
  };

  return (
    <div className="p-4 mx-2 flex flex-col gap-6">
      {/* header and edit button */}
      <div className="flex justify-between">
        {/* left side */}

        <Link className="flex items-center gap-2" to="/">
          <img src={arrowLeft}></img>

          <p className="text-gray-500">Go Back</p>
        </Link>

        {/* right side */}
        <div className="text-white cursor-pointer">
          {isEditable && (
            <div className="bg-green-400 rounded-lg">
              <AddFeedback onClickProp={handleClick}>Save changes</AddFeedback>
            </div>
          )}
          {!isEditable && (
            <div className=" bg-purple-800 rounded-lg">
              <AddFeedback onClickProp={handleEdit}>Edit Feedback</AddFeedback>
            </div>
          )}
        </div>
      </div>
      <div className="bg-white rounded-xl mt-7 p-4 flex flex-col gap-2 ">
        {isEditable ? (
          <input
            className="font-bold outline-none"
            value={title}
            onChange={(e) => handleTitleChange(e)}
          ></input>
        ) : (
          <p className="font-bold outline-none">{feedbackData.title}</p>
        )}

        {isEditable ? (
          <textarea
            className="outline-none resize-none"
            value={description}
            onChange={(e) => handleDescriptionChange(e)}
          ></textarea>
        ) : (
          <p className=" outline-none">{feedbackData.description}</p>
        )}
        {/* array of things */}
        <div className="flex flex-wrap gap-2">
          {!isEditable ? (
            <p className="bg-[#e6e9f6] text-[#4661e6] font-bold py-1 px-4 rounded-xl capitalize">
              {" "}
              {feedbackData.category}
            </p>
          ) : (
            <select
              className={`outline-none bg-[#e6e9f6] text-[#4661e6] font-bold py-1 px-4 rounded-xl capitalize text-center ${styles["remove-select-arrow"]}`}
            >
              <option selected>{feedbackData.category}</option>
              <option value="">Enhancement</option>
              <option value="">UI</option>
              <option value="">UX</option>
              <option value="">Bug</option>
              <option value="">Feature</option>
            </select>
          )}
        </div>
        {/* bottom container */}
        <div className="flex justify-between mt-3">
          {/* left side */}
          <div className=" bg-[#e6e9f6] flex py-1 px-4 rounded-xl gap-2 items-center">
            <img onClick={incrementUpVotes} className="w-3" src={arrowUp}></img>
            <p className="font-bold">{upVotes}</p>
          </div>
          {/* right side */}
          <div className="flex items-center gap-2">
            <img className="w-6" src={commentsIcon}></img>

            {comments.length !== 0 && (
              <p className="font-bold">{totalReplies + comments.length}</p>
            )}
          </div>
        </div>
      </div>
      {/* comments container */}
      <div className="bg-white p-4 rounded-xl flex flex-col gap-8">
        {/* Comments header */}
        <p className="font-bold">
          <span>{comments.length}</span> Comments
        </p>
        {/* comment component mapping */}

        {feedbackData.comments?.map((comment: CommentType) => {
          return <CommentContainer comment={comment} />;
        })}
      </div>
      <div>
        <AddComment />
      </div>
    </div>
  );
}

export default FeedbackInfo;
