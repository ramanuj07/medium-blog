const Button = ({ type }: { type: "signup" | "signin" }) => {
  return (
    <div>
      <button
        type="button"
        className="text-white w-full mt-6 bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
      >
        {type === "signup" ? "Sign Up" : "Sign In"}
      </button>
    </div>
  );
};

export default Button;
