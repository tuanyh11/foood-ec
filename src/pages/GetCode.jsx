import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { checkCode, getNewCode } from "../assets/Api";
import { useAuthSlice } from "../redux/hooks";

const GetCode = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const [user] = useAuthSlice();

  const nav = useNavigate();

  const handleOnSubmit = async (data) => {
    try {
      console.log(data?.email)
      const newCode = await getNewCode({ email: data?.email });
      alert(newCode.data?.message)
      nav("/verify_code")
    } catch (error) {
        alert("error: " + error?.response?.data.message)
    }
  };
  return (
    <div className="relative h-[100vh] w-full bg-center bg-no-repeat pt-[100vh] bg-cover" style={{backgroundImage: `url(${'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'})`}}>
      <div className="absolute top-1/2 bg-white left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg p-10 rounded-md">
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <div className="mb-5">
            <span className="mb-3 block text-base font-medium text-[#07074D]">
              Email
            </span>
            {errors?.email?.message && (
              <div
                className="p-2 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
                role="alert"
              >
                <span className="font-medium">Alert!</span>{" "}
                {errors.email.message}
              </div>
            )}
            <input
              type="text"
              {...register("email", {
                pattern: {
                  value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                  message: "invalid email type",
                },
                required: {
                  value: true,
                  message: "Email is required",
                },
              })}
              placeholder="Your Email"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
          </div>

          <div className="flex items-center gap-4 ">
            <button
              type="submit"
              className="hover:shadow-form rounded-md !bg-main !py-3 px-8 text-base font-semibold text-white outline-none"
            >
              Send
            </button>
            <Link to={"/login"}>
                    go to {" "}
                  <span className="font-bold text-xl">Login </span>
            </Link>

          </div>
        </form>
      </div>
    </div>
  );
};

export default GetCode;
