import React, { MouseEventHandler } from "react";

type ButtonProps = {
  type: "signup" | "signin";
  onClick?: MouseEventHandler<HTMLButtonElement>;
};
const Button: React.FC<ButtonProps> = ({ type, onClick }) => {
  return (
    <div>
      <button
        type="button"
        className="text-white w-full mt-6 bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
        onClick={onClick}
      >
        {type === "signup" ? "Sign Up" : "Sign In"}
      </button>
    </div>
  );
};

export default Button;
