import { useState } from "react";
import arrowUp from "../../assets/shared/icon-arrow-up.svg";
import commentsIcon from "../../assets/shared/icon-comments.svg";
import { FeedbackProps } from "./Feedbacks";
import { Link } from "react-router-dom";
import FeedbackUpvotes from "./FeedbackUpvotes";
import supabase from "../../configSupa/supabaseConfiguration";

// custom TYPESCRIPT !!!!!!!!
export type Props = {
  item: FeedbackProps;
  prodReqArr: any[];
  rowUser: string;
};

function Feedback({ item, prodReqArr, rowUser }: Props) {
  const [upVotes, setUpVotes] = useState<number>(item.upvotes);
  const [isUpvoteClicked, setIsUpvoteClicked] = useState(false);

  let commentLength = item.comments ?? [];

  const incrementUpvotes = async (e: any) => {
    e.preventDefault();

    if (item.usersUpvoted.includes(rowUser) || isUpvoteClicked) {
      console.log("Already voted");
      // eventually decrease upvote
      return;
    } else if (!item.usersUpvoted.includes(rowUser) || !isUpvoteClicked) {
      setUpVotes((prev) => prev + 1);

      let newArr = prodReqArr.map((itemObj: any) => {
        return item.id === itemObj.id
          ? {
              ...itemObj,
              upvotes: item.id === itemObj.id ? upVotes + 1 : itemObj.upvotes,
            }
          : itemObj;
      });

      newArr = newArr.map((itemObj) => {
        return item.id === itemObj.id
          ? { ...itemObj, usersUpvoted: [...itemObj.usersUpvoted, rowUser] }
          : itemObj;
      });

      const { error } = await supabase
        .from("Product-feedback-app")
        .update({ productRequests: newArr })
        .eq("id", "90813cf7-fdee-4f10-aef5-ce2c1950c9c3");
      console.error(error);
      setIsUpvoteClicked(true);
    }
  };

  return (
    <Link to={`/feedback/${item.id}`} state={item}>
      <div className="bg-white rounded-xl mt-7 mx-5 p-5 flex flex-col gap-2">
        <p className="font-bold break-words">{item.title}</p>
        <p className="text-gray-500 font-semibold break-words">
          {item.description}
        </p>
        {/* array of things */}
        <div className="flex flex-wrap gap-2">
          <p className="bg-[#e6e9f6] text-[#4661e6] font-bold py-1 px-4 rounded-xl capitalize">
            {item.category}
          </p>
        </div>
        {/* bottom container */}
        <div className="flex justify-between mt-3">
          {/* left side */}
          <div className=" bg-[#e6e9f6] flex py-1 px-4 rounded-xl gap-2 items-center">
            <img className="w-full" src={arrowUp}></img>
            <FeedbackUpvotes incrementFunction={incrementUpvotes}>
              {upVotes}
            </FeedbackUpvotes>
          </div>
          {/* right side */}
          <div className="flex items-center gap-2">
            <img className="w-6" src={commentsIcon}></img>
            <p className="font-bold">{commentLength.length}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Feedback;
