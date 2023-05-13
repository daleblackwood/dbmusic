import React from "react";
import ReactDOM from "react-dom/client";
import { useState, useEffect } from "react";
import { initHooks } from "observational/hooks";
import { App } from "./app.tsx";
import "./main.css";

initHooks({ useState, useEffect });
 
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
