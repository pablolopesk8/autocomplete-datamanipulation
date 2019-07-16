import React from "react";
import ReactDOM from "react-dom";
import Autocomplete from "./Autocomplete";

document.addEventListener("DOMContentLoaded", function () {
    ReactDOM.render(
        React.createElement(Autocomplete),
        document.getElementById("mount")
    );
});
