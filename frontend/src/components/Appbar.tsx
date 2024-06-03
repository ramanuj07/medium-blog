import { Link, useNavigate } from "react-router-dom";
import { MEDIUM_LOGO } from "../utils/constants";
import Avatar from "./ui/Avatar";

const Appbar = () => {
  const navigate = useNavigate();
  return (
    <div className="border-b flex justify-between px-10 py-2 items-center">
      <div>
        <Link to={"/blogs"}>
          <img src={MEDIUM_LOGO} alt="applogo" height={30} width={30} />
        </Link>
      </div>

      <div className="flex items-center">
        <div>
          <button
            onClick={() => navigate("/publish")}
            type="button"
            className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            New
          </button>
        </div>
        <div className="pl-4">
          <Avatar authorChar="ramanuj" />
        </div>
      </div>
    </div>
  );
};

export default Appbar;
