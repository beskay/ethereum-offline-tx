import React from "react";
import { useState } from "react";

const Form = (props) => {
  const [value, setValue] = useState(1);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(`The value you want to mint is: ${value}`);
  };

  return (
    <div>
      <form id={props.id} onSubmit={handleSubmit}>
        <input
          type={props.number}
          className="form-95 w-full"
          onChange={(e) => setValue(e.target.value)}
          placeholder={props.placeholder}
        />
      </form>
    </div>
  );
};

export default Form;
