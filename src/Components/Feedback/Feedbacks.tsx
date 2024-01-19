import arrowDown from "../../assets/shared/icon-arrow-down.svg";
import Feedback from "./Feedback";
import AddFeedback from "../AddingButton";
import { useQuery } from "@tanstack/react-query";
import fetchData from "../../Utilities/Fetch";
import Loading from "../Loading/Loading";
import { Link } from "react-router-dom";
import styles from "../../styles/Feedbacks.module.css";
import { useEffect, useState } from "react";

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

type Suggestions = {
  planned: number;
  inProgress: number;
  live: number;
  suggestion: number;
};

function Feedbacks({ filterValue, setFilterValue }: any) {
  const [filteredArray, setFilteredArray] = useState<any>([]);
  const [sumOfSuggestions, setSumOfSuggestions] = useState<number>();

  //REACT QUERRY FETCH
  const { data, isLoading } = useQuery({
    queryKey: ["myData"],
    queryFn: () => fetchData(),
  });

  useEffect(() => {
    const suggestions: Suggestions = {
      planned: 0,
      inProgress: 0,
      live: 0,
      suggestion: 0,
    };

    if (data && data[0]) {
      data[0].productRequests.forEach((item: any) => {
        if (item.status === "planned") {
          suggestions.planned += 1;
        } else if (item.status === "in-progress") {
          suggestions.inProgress += 1;
        } else if (item.status === "live") {
          suggestions.live += 1;
        } else if (item.status === "suggestion") {
          suggestions.suggestion += 1;
        }
      });
    }

    const sumSuggestions = Object.values(suggestions).reduce((acc, curr) => {
      return acc + curr;
    }, 0);

    setSumOfSuggestions(sumSuggestions);
  }, [data]);

  // data array from supa
  useEffect(() => {
    if (data && data[0]) {
      setFilteredArray(data[0].productRequests);
      filterFeedbackData();
    }
  }, [data, filterValue]);

  const filterArrayFunction = (e: any) => {
    setFilterValue(e.target.value);
  };

  function filterFeedbackData() {
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
    } else if (
      filterValue === "bug" ||
      filterValue === "feature" ||
      filterValue === "enhancement" ||
      filterValue === "ui" ||
      filterValue === "ux"
    ) {
      const newArr = [...(data[0]?.productRequests || [])].filter((item) => {
        return item.category === filterValue;
      });
      setFilteredArray(newArr);
    }
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex  justify-between items-center bg-blue-950 text-white p-5 sm:mx-5 sm:rounded-lg">
        <div className="flex items-center ">
          <div className="sm:flex sm:justify-between">
            <div className="hidden sm:flex sm:pr-10">
              <p>
                <span className="pr-2">{sumOfSuggestions}</span>Suggestions
              </p>
            </div>
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
