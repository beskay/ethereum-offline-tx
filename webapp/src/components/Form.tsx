import React from "react";

interface FormProps {
  type: string;
  value: string;
  onChange: any;
  placeholder: string;
}

const Form = (props: FormProps) => {
  return (
    <div>
      <input
        type={props.type}
        className="form-95 w-full"
        value={props.value}
        onChange={(e) => {
          props.onChange(e.target.value);
        }}
        placeholder={props.placeholder}
      />
    </div>
  );
};

export default Form;
