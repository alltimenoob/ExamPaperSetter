import "../App.css";
import {
  VscChromeClose,
  VscChromeMaximize,
  VscChromeMinimize,
} from "react-icons/vsc";

function TitleBar(props) {
  return (
    <div className="TitleBar">
      <span>{props.name}</span>
      {/* Frame Name */}

      <div className="flex">
        {" "}
        {/* Minimize Maximize Close Icons */}
        {props.min && (
          <VscChromeMinimize
            className="TitleBarIcons"
            onClick={() => {
              window.api.minimize(); /* API Call To Minimize The Window */
            }}
          />
        )}
        {props.max && (
          <VscChromeMaximize
            className="TitleBarIcons"
            onClick={() => {
              window.api.maximize(); /* API Call To Maximize The Window */
            }}
          />
        )}
        {props.close && (
          <VscChromeClose
            className="TitleBarIcons"
            onClick={() => {
              window.api.close(props.window); /* API Call To Close The Window */
            }}
          />
        )}
      </div>
    </div>
  );
}

export default TitleBar;
