import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import {
  updateDataIteration,
  updateProductRequest,
} from "../Types/FeedbackInfoTypes";
import { TABLE_NAME } from "../Utilities/CommonVariables";
import FeedbackUpvotes from "../Components/Feedback/FeedbackUpvotes";

function FeedbackInfo() {
  console.log("BA");
  const { state: feedbackData } = useLocation();

  console.log(feedbackData);

  const { id } = useParams();

  const [upVotes, setUpVotes] = useState<number>(feedbackData.upvotes);
  const [isEditable, setIsEditable] = useState(false);
  const [title, setTitle] = useState(feedbackData.title);
  const [description, setDescription] = useState(feedbackData.description);
  const [category, setCategory] = useState(feedbackData.category);
  const [commentInput, setCommentInput] = useState<string>("");
  const [isUpvoteClicked, setIsUpvoteClicked] = useState(false);

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
    queryKey: ["updateData"],
    queryFn: () => fetchData(),
  });

  const incrementUpvotes = async () => {
    const rowUser: string = currentData[0].currentUser.username;
    if (feedbackData.usersUpvoted.includes(rowUser) || isUpvoteClicked) {
      return;
    } else if (
      !feedbackData.usersUpvoted.includes(rowUser) ||
      !isUpvoteClicked
    ) {
      setUpVotes((prev) => prev + 1);

      let newArr = currentData[0].productRequests.map((itemObj: any) => {
        return feedbackData.id === itemObj.id
          ? {
              ...itemObj,
              upvotes:
                feedbackData.id === itemObj.id ? upVotes + 1 : itemObj.upvotes,
            }
          : itemObj;
      });

      newArr = newArr.map((itemObj: any) => {
        return feedbackData.id === itemObj.id
          ? { ...itemObj, usersUpvoted: [...itemObj.usersUpvoted, rowUser] }
          : itemObj;
      });

      const { error } = await supabase
        .from("Product-feedback-app")
        .update({ productRequests: newArr })
        .eq("id", "90813cf7-fdee-4f10-aef5-ce2c1950c9c3");
      console.error(error);
    }
    setIsUpvoteClicked(true);
  };

  // -----------------------------------------------------------------------------------------------

  //update function title, description and category
  const updateProductRequestTitle = async ({
    rowId,
    productRequestId,
    newTitle,
    newDescription,
    newCategory,
  }: updateProductRequest) => {
    try {
      if (isLoading) {
        <Loading />;
      }

      const dataByRowId = currentData.filter((row: any) => {
        return row.id === rowId;
      });

      console.log(dataByRowId);

      const updatedData = dataByRowId[0].productRequests.map(
        (request: updateDataIteration) => {
          return request.id === productRequestId
            ? {
                ...request,
                title: newTitle,
                description: newDescription,
                category: newCategory,
              }
            : request;
        }
      );

      console.log(updatedData);

      const { data: updateData, updateError } = await supabase
        .from(TABLE_NAME)
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

  //de retinut
  const handleClick = () => {
    updateProductRequestTitle({
      rowId: "90813cf7-fdee-4f10-aef5-ce2c1950c9c3",
      productRequestId: feedbackData.id,
      newTitle: title,
      newDescription: description,
      newCategory: category,
    });
  };

  // function to edit the title input
  const handleTitleChange = (e: any) => {
    setTitle(e.target.value);
  };

  // function to edit the description input
  const handleDescriptionChange = (e: any) => {
    setDescription(e.target.value);
  };

  //function to get the category
  const handleCategory = (e: any) => {
    setCategory(e.target.value);
  };

  //function to add comment

  const addComment = async (): Promise<void> => {
    try {
      if (isLoading) {
        <Loading />;
      }

      const userWhoCommented = {
        id: comments.length + 1,
        content: commentInput,
        user: {
          image: currentData[0]?.currentUser?.image,
          name: currentData[0]?.currentUser?.name,
          username: currentData[0]?.currentUser?.username,
        },
      };

      console.log(userWhoCommented);

      const updatedProductRequests = currentData[0]?.productRequests?.map(
        (item: any) => {
          if (item.id === Number(id)) {
            return {
              ...item,
              comments: [...(item?.comments || []), userWhoCommented],
            };
          }
          return item;
        }
      );

      console.log(updatedProductRequests);

      const { data, updateError } = await supabase
        .from(TABLE_NAME)
        .update({ productRequests: updatedProductRequests })
        .eq("id", "90813cf7-fdee-4f10-aef5-ce2c1950c9c3");

      console.log("comment added");

      if (updateError) {
        throw new Error("Error updating data");
      }

      return data;
    } catch (error) {
      console.error("Error updating data:", error);
      throw error;
    }
  };

  useEffect(() => {
    console.log(commentInput);
  }, [commentInput]);

  return (
    <div className="p-4 mx-2 flex flex-col gap-6">
      {/* header and edit button */}
      <div className="flex justify-between">
        {/* left side */}

        {
          <Link className="flex items-center gap-2" to="/">
            <img src={arrowLeft}></img>

            <p className="text-gray-500">Go Back</p>
          </Link>
        }

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
              {category}
            </p>
          ) : (
            <select
              className={`outline-none bg-[#e6e9f6] text-[#4661e6] font-bold py-1 px-4 rounded-xl capitalize text-center ${styles["remove-select-arrow"]}`}
              value={category}
              onChange={handleCategory}
            >
              <option selected>{feedbackData.category}</option>
              <option value="Enhancement">Enhancement</option>
              <option value="UI">UI</option>
              <option value="UX">UX</option>
              <option value="Bug">Bug</option>
              <option value="Feature">Feature</option>
            </select>
          )}
        </div>
        {/* bottom container */}
        <div className="flex justify-between mt-3">
          {/* left side */}
          <div className=" bg-[#e6e9f6] flex py-1 px-4 rounded-xl gap-2 items-center">
            <img className="w-3" src={arrowUp}></img>
            <FeedbackUpvotes incrementFunction={incrementUpvotes}>
              <p className="font-bold">{upVotes}</p>
            </FeedbackUpvotes>
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
        <AddComment addComment={addComment} setCommentInput={setCommentInput} />
      </div>
    </div>
  );
}

export default FeedbackInfo;

// cevasdfdsf
