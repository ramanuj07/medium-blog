import { MEDIUM_LOGO } from "../utils/constants";
import Avatar from "./ui/Avatar";

const Appbar = () => {
  return (
    <div className="border-b flex justify-between px-10 py-2 items-center">
      <div>
        <img src={MEDIUM_LOGO} alt="applogo" height={30} width={30} />
      </div>

      <div>
        <Avatar authorChar="ramanuj" />
      </div>
    </div>
  );
};

export default Appbar;
