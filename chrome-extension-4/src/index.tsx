import React from "react";
import ReactDOM from "react-dom";
import App, { isValidUrl } from "./App";
import "./index.css";
console.log("Hello from content script");
const pointInRect = (
   { x1, y1, x2, y2 }: { x1: number; x2: number; y1: number; y2: number },
   { x, y }: { x: number; y: number }
) => x > x1 && x < x2 && y > y1 && y < y2;
window.onload = function () {
   const allLinks = document.querySelectorAll("a");
   console.log(allLinks);
   allLinks.forEach((a) => {
      if (isValidUrl(a.href)) {
         const app = document.createElement("div");

         const { x, y, width, height } = a.getBoundingClientRect();
         app.className = "my-extension-root";
         app.style.position = "absolute";
         app.style.top = y + "px";
         app.style.left = x + "px";
         app.style.transform = "translate(0, -100%)";

         ReactDOM.render(
            <>
               <App link={a.href} />
               <div className="close-btn" onClick={() => app.remove()}>
                  X
               </div>
            </>,
            app
         );

         a.onmouseenter = function () {
            document.querySelectorAll(".my-extension-root").forEach((x) => {
               if (x !== app) {
                  x.remove();
               }
            });
            document.body.appendChild(app);
         };
      }
   });
};
