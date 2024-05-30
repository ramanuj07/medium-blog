import { useState } from "react";
import { Link } from "react-router-dom";
import { LabelledInput } from "./ui/LabelledInput";
import { SignupInput } from "@ramanuj07/medium-common";
import Button from "./ui/Button";

const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const [postInputs, setPostInputs] = useState<SignupInput>({
    email: "",
    password: "",
    name: "",
  });

  return (
    <div className="h-screen flex flex-col justify-center">
      <div className="flex justify-center">
        <div>
          <div className="px-10 text-center">
            <div className="font-extrabold text-3xl ">
              {type === "signup"
                ? "Create your account"
                : "Login to your account"}
            </div>
            <div className="mt-2 text-slate-500">
              {type === "signup"
                ? "Already have an account?"
                : "Don't have an account?"}
              <Link
                className="pl-2 underline"
                to={type === "signup" ? "/signin" : "/signup"}
              >
                {type === "signup" ? "Signin" : "Signup"}
              </Link>
            </div>
          </div>

          <div className="mt-8">
            {type === "signup" && (
              <LabelledInput
                label="Name"
                placeholder="Enter your name"
                onChange={(e) =>
                  setPostInputs((c) => ({
                    ...c,
                    name: e.target.value,
                  }))
                }
              />
            )}

            <LabelledInput
              label="Email"
              placeholder="Enter your email"
              onChange={(e) =>
                setPostInputs((c) => ({
                  ...c,
                  email: e.target.value,
                }))
              }
            />

            <LabelledInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              onChange={(e) =>
                setPostInputs({
                  ...postInputs,
                  password: e.target.value,
                })
              }
            />
          </div>

          <Button type={type} />
        </div>
      </div>
    </div>
  );
};

export default Auth;
