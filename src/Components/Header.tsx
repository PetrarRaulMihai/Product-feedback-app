import styles from "../styles/Header.module.css";
import hamburgerMenu from "../assets/shared/mobile/icon-hamburger.svg";
import closeMenu from "../assets/shared/mobile/icon-close.svg";
import { useEffect, useReducer, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import fetchData from "../Utilities/Fetch";

function Header({ setFilterValue }: any) {
  const [inProgressCounter, setInProgressCounter] = useState(null);
  const [liveCounter, setLiveCounter] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [planned, setPlanned] = useState(null);
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [selectedFilter, setSelectedFilter] = useState<string>("");

  // for the useReducer hook

  //  1. importam hookul useReducer
  //  2. creeam o functie reducer- nu stiu sigur dar tin minte ca un best practice e sa se scrie reducer ca nume de functie.
  //Functia ia 2 parametrii, obligatoriu, un state (ca in useState) si un action care la randul ei modifica state-ul cum vrem
  //3. folosim hook-ul useReducer, care ia din nou 2 parametrii, functia reducer pe care am creat-o si initial state.
  //4. Dupa asta, creem functiile ne trebuie (openModal, closeModal)
  //5. Punem aceste functii unde avem nevoie,

  const reducer = (state: boolean, action: { type: string }): boolean => {
    switch (action.type) {
      case "OPEN_MODAL":
        return true;
      case "CLOSE_MODAL":
        return false;

      default:
        return state;
    }
  };
  //teoretic, astea se pun intr-un fisier separat, si se da export/import - o sa facem si noi asta dupa ce intelegem pe deplin useReducer ( e mai usor sa-l avem in fata)

  const [isModalMenuOpen, dispatch] = useReducer(reducer, false);

  const openModal = () => {
    dispatch({ type: "OPEN_MODAL" });
  };

  const closeModal = () => {
    // Trigger the slide-out animation by adding a class
    dispatch({ type: "CLOSE_MODAL" });
  };

  // filtering function
  const handleClickFilter = (e: any) => {
    setFilterValue(e.target.id);
    closeModal();

    // color change
    setSelectedFilter(e.target.innerText);
  };

  // ${styles["tablet-size-background"]}

  const { data } = useQuery({
    queryKey: ["myData"],
    queryFn: () => fetchData(),
  });

  useEffect(() => {
    if (data) {
      const inProgressNumber = data[0]?.productRequests?.filter((item: any) => {
        return item.status === "in-progress";
      });
      setInProgressCounter(inProgressNumber.length);

      const liveNumber = data[0]?.productRequests?.filter((item: any) => {
        return item.status === "live";
      });
      setLiveCounter(liveNumber.length);

      const suggestionNumber = data[0].productRequests.filter((item: any) => {
        return item.status === "suggestion";
      });
      setSuggestion(suggestionNumber.length);

      const plannedNumber = data[0].productRequests.filter((item: any) => {
        return item.status === "planned";
      });
      setPlanned(plannedNumber.length);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      console.log(screenWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    //header built - background is changing depending the screen size
    <div>
      <div>
        <div
          className={`flex justify-between items-center px-5 py-2 sm:grid sm:grid-cols-3 sm:justify-between sm:gap-6 sm-h-36 ${
            window.innerWidth < 640
              ? styles["mobile-size-background"]
              : "bg-none"
          }`}
        >
          {/* de continuat aici */}
          <div
            className={`flex flex-col text-white sm:h-40 sm:basis-1/3 ${
              window.innerWidth > 640
                ? styles["tablet-size-background"]
                : "bg-none"
            }  sm:justify-end pb-6 px-4 h-full rounded-lg`}
          >
            <p className="font-bold text-lg">Frontend Mentor</p>
            <p>Feedback Board</p>
          </div>

          <div onClick={openModal} className="sm:hidden">
            <img src={hamburgerMenu}></img>
          </div>

          {/* categories */}
          <div className="hidden sm:block sm:bg-white h-full rounded-lg">
            <div className="">
              <div className="sm:flex sm:basis-1/3 justify-center items-center">
                <div
                  className={`flex flex-wrap sm:gap-2 sm:p-2 sm:font-semibold sm:text-sm sm:rounded-lg sm:justify-start `}
                >
                  <div
                    className={`${
                      selectedFilter === "All" ? "bg-blue-600" : "bg-blue-100"
                    } flex  items-center p-2 rounded-lg cursor-pointer`}
                  >
                    <p id="all" onClick={handleClickFilter} className="">
                      All
                    </p>
                  </div>

                  <div
                    className={`${
                      selectedFilter === "UI" ? "bg-blue-600" : "bg-blue-100"
                    } flex  items-center p-2 rounded-lg cursor-pointer`}
                  >
                    <p id="ui" onClick={handleClickFilter}>
                      UI
                    </p>
                  </div>

                  <div
                    className={`${
                      selectedFilter === "UX" ? "bg-blue-600" : "bg-blue-100"
                    } flex  items-center p-2 rounded-lg cursor-pointer`}
                  >
                    <p id="ux" onClick={handleClickFilter}>
                      UX
                    </p>
                  </div>
                  <div
                    className={`${
                      selectedFilter === "Enhancement"
                        ? "bg-blue-600"
                        : "bg-blue-100"
                    } flex  items-center p-2 rounded-lg cursor-pointer`}
                  >
                    <p id="enhancement" onClick={handleClickFilter}>
                      Enhancement
                    </p>
                  </div>
                  <div
                    className={`${
                      selectedFilter === "Bug" ? "bg-blue-600" : "bg-blue-100"
                    } flex  items-center p-2 rounded-lg cursor-pointer`}
                  >
                    <p id="bug" onClick={handleClickFilter}>
                      Bug
                    </p>
                  </div>
                  <div
                    className={`${
                      selectedFilter === "Feature"
                        ? "bg-blue-600"
                        : "bg-blue-100"
                    } flex  items-center p-2 rounded-lg cursor-pointer`}
                  >
                    <p id="feature" onClick={handleClickFilter}>
                      Feature
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* roadmap */}

          <div className="hidden sm:block sm:bg-white sm:rounded-lg sm:py-2 sm:px-4 sm:basis-1/3 h-full">
            <div className="flex justify-between pb-5 items-center">
              <p className="text-black font-bold">Roadmap</p>
              <p className="underline text-blue-600 text-sm font-semibold">
                View
              </p>
            </div>

            {/* Planned */}
            <div className="flex flex-col list-disc list-inside font-semibold text-gray-500">
              <div className="flex justify-between item-center">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-[#f49e85] rounded-full"></div>
                  <p>Planned</p>
                </div>
                <p>{planned}</p>
              </div>

              {/* In-progress */}
              <div className="flex justify-between item-center">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-[#ae1feb] rounded-full"></div>
                  <p>In-progress</p>
                </div>
                <p>{inProgressCounter}</p>
              </div>

              {/* Live */}
              <div className="flex justify-between item-center">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-[#62bdf9] rounded-full"></div>
                  <p>Live</p>
                </div>
                <p>{liveCounter}</p>
              </div>

              {/* Suggestion */}
              <div className="flex justify-between item-center">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-[#36ff61] rounded-full"></div>
                  <p>Suggestion</p>
                </div>
                <p>{suggestion}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* modal menu  */}

      {isModalMenuOpen && (
        <div
          className={`absolute bg-[#90a0e6] px-3 top-0 right-0 left-40 h-screen ${
            isModalMenuOpen
              ? styles["animate-slide-in"]
              : styles["animate-slide-out"]
          }`}
        >
          {/* //close button */}
          <button onClick={closeModal}>
            <img src={closeMenu} className={`pl-1 py-3 `}></img>
          </button>

          {/* container that holds the 2 blocks of menu like in the photo */}
          <div className="flex flex-col px-1 gap-3">
            {/* left block with all the filters */}
            <div
              className={`flex gap-1 flex-wrap sm:gap-2 sm:p-2 sm:font-semibold sm:text-sm sm:rounded-lg sm:justify-start `}
            >
              <div
                className={`${
                  selectedFilter === "All" ? "bg-blue-600" : "bg-blue-200"
                } flex  items-center p-1 rounded-lg cursor-pointer`}
              >
                <p id="all" onClick={handleClickFilter} className="">
                  All
                </p>
              </div>

              <div
                className={`${
                  selectedFilter === "UI" ? "bg-blue-600" : "bg-blue-200"
                } flex  items-center p-1 rounded-lg cursor-pointer`}
              >
                <p id="ui" onClick={handleClickFilter}>
                  UI
                </p>
              </div>

              <div
                className={`${
                  selectedFilter === "UX" ? "bg-blue-600" : "bg-blue-200"
                } flex  items-center p-1 rounded-lg cursor-pointer`}
              >
                <p id="ux" onClick={handleClickFilter}>
                  UX
                </p>
              </div>
              <div
                className={`${
                  selectedFilter === "Enhancement"
                    ? "bg-blue-600"
                    : "bg-blue-200"
                } flex  items-center p-1 rounded-lg cursor-pointer`}
              >
                <p id="enhancement" onClick={handleClickFilter}>
                  Enhancement
                </p>
              </div>
              <div
                className={`${
                  selectedFilter === "Bug" ? "bg-blue-600" : "bg-blue-200"
                } flex  items-center p-1 rounded-lg cursor-pointer`}
              >
                <p id="bug" onClick={handleClickFilter}>
                  Bug
                </p>
              </div>
              <div
                className={`${
                  selectedFilter === "Feature" ? "bg-blue-600" : "bg-blue-200"
                } flex  items-center p-1 rounded-lg cursor-pointer`}
              >
                <p id="feature" onClick={handleClickFilter}>
                  Feature
                </p>
              </div>
            </div>
            {/* left block with roadmap etc */}
            <div className="bg-white rounded-lg py-2 px-4">
              <div className="flex justify-between pb-5 items-center">
                <p className="text-black font-bold">Roadmap</p>
                <p className="underline text-blue-600 text-sm font-semibold">
                  View
                </p>
              </div>

              {/* Planned */}
              <div className="flex flex-col list-disc list-inside font-semibold text-gray-500">
                <div className="flex justify-between item-center">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-[#f49e85] rounded-full"></div>
                    <p>Planned</p>
                  </div>
                  <p>{planned}</p>
                </div>

                {/* In-progress */}
                <div className="flex justify-between item-center">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-[#ae1feb] rounded-full"></div>
                    <p>In-progress</p>
                  </div>
                  <p>{inProgressCounter}</p>
                </div>

                {/* Live */}
                <div className="flex justify-between item-center">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-[#62bdf9] rounded-full"></div>
                    <p>Live</p>
                  </div>
                  <p>{liveCounter}</p>
                </div>

                {/* Suggestion */}
                <div className="flex justify-between item-center">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-[#36ff61] rounded-full"></div>
                    <p>Suggestion</p>
                  </div>
                  <p>{suggestion}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
