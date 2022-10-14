import React from "react";

const Form = (props) => {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <form id={props.id} onSubmit={handleSubmit}>
        <input
          type={props.type}
          className="form-95 w-full"
          value={props.value}
          onChange={(e) => {
            props.onChange(e.target.value);
          }}
          placeholder={props.placeholder}
        />
      </form>
    </div>
  );
};

export default Form;
