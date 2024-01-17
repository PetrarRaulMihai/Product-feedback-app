import arrowDown from "../../assets/shared/icon-arrow-down.svg";
import Feedback from "./Feedback";
import AddFeedback from "../AddingButton";
import { useQuery } from "@tanstack/react-query";
import fetchData from "../../Utilities/Fetch";
import Loading from "../Loading/Loading";
import { Link } from "react-router-dom";
import styles from "../../styles/Feedbacks.module.css";
import { useEffect, useState } from "react";
import { filter } from "lodash";

export type FeedbackProps = {
  category: string;
  description: string;
  id: number;
  status: string;
  title: string;
  upvotes: number;
  comments: any;
  usersUpvoted: string[];
};

function Feedbacks({ filterValue, setFilterValue }: any) {
  const [filteredArray, setFilteredArray] = useState<any>([]);

  //REACT QUERRY FETCH
  const { data, isLoading } = useQuery({
    queryKey: ["myData"],
    queryFn: () => fetchData(),
  });

  // data array from supa
  useEffect(() => {
    if (data && data[0]) {
      setFilteredArray(data[0].productRequests);
    }
  }, [data]);

  const filterArrayFunction = (e: any) => {
    setFilterValue(e.target.value);
  };

  useEffect(() => {
    if (filterValue === "most-upvotes") {
      const newArr = [...filteredArray].sort((a, b) => {
        return b.upvotes - a.upvotes;
      });
      setFilteredArray(newArr);
    } else if (filterValue === "most-commented") {
      const newArr = [...filteredArray].sort((a, b) => {
        return (b.comments?.length || 0) - (a.comments?.length || 0);
      });
      setFilteredArray(newArr);
    } else if (filterValue === "filter") {
      const newArr = [...filteredArray].sort((a, b) => a.id - b.id);
      setFilteredArray(newArr);
    } else if (filterValue === "bug") {
      const newArr = [...data[0].productRequests].filter((item) => {
        return item.category === filterValue;
      });
      setFilteredArray(newArr);
    } else if (filterValue === "feature") {
      const newArr = [...data[0].productRequests].filter((item) => {
        return item.category === filterValue;
      });
      setFilteredArray(newArr);
    } else if (filterValue === "enhancement") {
      const newArr = [...data[0].productRequests].filter((item) => {
        return item.category === filterValue;
      });
      setFilteredArray(newArr);
    } else if (filterValue === "ux") {
      const newArr = [...data[0].productRequests].filter((item) => {
        return item.category === filterValue;
      });
      setFilteredArray(newArr);
    } else if (filterValue === "ui") {
      const newArr = [...data[0].productRequests].filter((item) => {
        return item.category === filterValue;
      });
      setFilteredArray(newArr);
    } else if (filterValue === "all") {
      const newArr = [...data[0].productRequests].filter((item) => {
        return item;
      });
      setFilteredArray(newArr);
    }
  }, [filterValue]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex  justify-between items-center bg-blue-950 text-white p-5">
        <div className="flex  items-center">
          <div>
            <label htmlFor="votes">Sort by: </label>
            <select
              onChange={filterArrayFunction}
              id="votes"
              name="votes"
              className={`bg-blue-950 ${styles["select"]} outline-none`}
            >
              <option value="filter" defaultValue="filter">
                Filter
              </option>
              <option value="most-upvotes">Most Upvotes</option>
              <option value="most-commented">Most Comments</option>
            </select>
          </div>

          <div>
            <img src={arrowDown}></img>
          </div>
        </div>
        <div className="bg-[#ae1feb] rounded-lg">
          <Link to="/new-feedback" state={data[0]}>
            <AddFeedback>+ Add feedback</AddFeedback>
          </Link>
        </div>
      </div>
      {/* Single Feedback adding */}
      {filteredArray?.map((item: FeedbackProps) => {
        return (
          <Feedback
            key={item.id}
            item={item}
            prodReqArr={data[0].productRequests}
            rowUser={data[0].currentUser.username}
          />
        );
      })}
    </>
  );
}

export default Feedbacks;
