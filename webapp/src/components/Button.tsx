import React from "react";

interface ButtonProps {
  //form: string;
  text: string;
  //type: "submit";
  onClick: React.MouseEventHandler<HTMLElement>;
}

const Button = (props: ButtonProps) => {
  return (
    <div>
      <button
        className="btn"
        //form={props.form}
        //type={props.type}
        onClick={props.onClick}
      >
        {props.text}
      </button>
    </div>
  );
};

export default Button;
