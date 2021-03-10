import React, { useEffect, useState } from "react";

//This is for the first api which will use the "POST" method.
const getUid = async (userName: string) => {
   const response = await fetch(
      "https://ratings-api.dev.reputationaire.com/api/request-rating",
      {
         method: "POST",
         mode: "cors",
         cache: "no-cache",
         credentials: "same-origin",
         headers: {
            "Content-Type": "application/json",
         },
         redirect: "follow",
         referrerPolicy: "no-referrer",
         body: JSON.stringify({ githubId: userName }),
      }
   );

   const data = await response.json();
   return data.message.uuid_github;
};

//The is second api call. which will be get request.
const getRating = async (uid: string) => {
   const response = await fetch(
      `https://ratings-api.dev.reputationaire.com/api/result?id=${uid}&access=f62345e8-9378-425b-b122-ecb4a9610a38`
   );
   const data = await response.json();
   return data;
};
export const isValidUrl = (url: string) => {
   return url && url.match(/github.com\/.+/);
};

//This code will get the userName from the link.
const getUserName = (url: string) => {
   return new Promise((res, rej) => {
      if (url) {
         if (url.match(/github.com\/.+/)) {
            const userName = url.split("github.com/")[1].split("/")[0];

            console.log(userName);
            res(userName);
         } else {
            rej("The url doesn't contain name of any github user");
         }
      } else {
         rej("The url doesn't contain name of any github user");
      }
   });
};

const App: React.FC<{ link: string }> = ({ link }) => {
   //Creating  the basic state variables.
   const [appClose, setAppClose] = useState(false);
   //Show result is a boolean which will determine whether we will show the result(rating percentage) or not.
   const [showResult, setShowResult] = useState(false);

   //result is a state variable which will contain the data which will get afte calling all the apis
   const [result, setResult] = useState({
      rating: 0,
      userName: "",
      credits: 1000,
   });

   //Error is varible which will check if there is some error. If there is no error it will be empty string
   const [error, setError] = useState("");

   //loading is a boolean which will determine whether the app is loading or not. If it will be true "Crunching 50 million developers..." will show.
   const [loading, setLoading] = useState(false);

   //This is a function which will be called when we will click the main button of find Ranking.
   const onButtonClick = () => {
      //Whenver the button is clicked we set loading to true so the "Crunching 50 million developers..." will show.
      setLoading(true);

      //Now we call the getUserName function
      //NOTE: The callback defined inside then is when the promise is fulfilled. (means "res" is called and we get a user name successfully)
      //NOTE: The callback inside catch is called when promise is rejected means it has some kind of error.(means rej will be called and)

      getUserName(link)
         .then((userName: any) => {
            //We are inside then which means we get the userName from url successfuly.
            //Now we need to get the uid and then get the rating

            //Ok now we call the getUid function
            getUid(userName).then((uid) => {
               //Now we are inside then of `getUid` so it means that we get the uid successfully.

               //Now we use that uid to get the rating(The last api)

               getRating(uid).then((data) => {
                  //We are inside then which means we getRating is called successfully
                  //'data' is the final variable which will contain the average and remaining credits
                  if (data.error === true) {
                     setError("Unable to get the rating of this user");
                     setLoading(false);
                  } else {
                     //We set that data as a result in out state variable
                     setResult({
                        rating: data.message.average * 100,
                        userName: userName,
                        credits: data.message.remaining_credits,
                     });

                     //We set show result to true so now our result will be shown too.
                     setShowResult(true);

                     //It will remove any previous errors.
                     setError("");

                     //End the loading because all the apis are called and we get the result
                     setLoading(false);
                  }
               });
            });
         })
         .catch((err) => {
            console.log(err);
            setError(err);
            setLoading(false);
         });
   };
   if (appClose) {
      return null;
   }

   //We check if the loading is true then we return the "Crunching 50 million developers..." text only
   if (loading === true) {
      return (
         <div className="App">
            {/* <div onClick={() => setAppClose(true)} className="close-btn"></div> */}
            <div id="loading-text" className="text">
               Crunching 50 million developers...
            </div>
         </div>
      );
   }

   //We check if the credits are less than 0 or equal to zero we return "You have no credits left." text with a button "Buy more credits".
   if (result.credits <= 0) {
      return (
         <div className="App">
            {/* <div onClick={() => setAppClose(true)} className="close-btn"></div> */}
            <div className="text">You have no credits left.</div>
            <button className="btn">Buy more credits</button>
         </div>
      );
   }

   //If none of the above conditions are true we return out main app.
   return (
      <div className="App">
         {/* <div onClick={() => setAppClose(true)} className="close-btn"></div> */}
         {/* If error contains any value we show that error */}
         {error ? (
            <div className="text" id="error">
               {error}
            </div>
         ) : (
            <></>
         )}
         {/* If showResult is true we show our result */}
         {showResult ? (
            <div style={{ textAlign: "center", marginBottom: "25px" }}>
               <div style={{ marginBottom: "20px", fontSize: "22px" }}>
                  Rating of <b>{result.userName}</b> is
               </div>
               <div id="percentage">{result.rating.toFixed(4)}%</div>
            </div>
         ) : (
            ""
         )}
         {/* Render the main button of which will find ranking. We set its onClick to "onButtonClick" function which is created above */}
         <button onClick={onButtonClick} className="btn">
            Find Ranking
         </button>
      </div>
   );
};

export default App;
