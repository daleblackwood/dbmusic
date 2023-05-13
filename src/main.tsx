import React from "react";
import ReactDOM from "react-dom/client";
import "./main.css";
import "./assets/bootstrap.css";
import { useState, useEffect } from "react";
import { initHooks } from "observational/hooks";
import { App } from "./app.tsx";

initHooks({ useState, useEffect });
 
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
