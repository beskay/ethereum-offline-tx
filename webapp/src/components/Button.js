import React from "react";

const Button = (props) => {
  return (
    <div>
      <button
        className="btn"
        form={props.form}
        type={props.type}
        onClick={props.onClick}
      >
        {props.text}
      </button>
    </div>
  );
};

export default Button;
