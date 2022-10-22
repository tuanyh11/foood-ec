import React from "react";
import { useForm } from "react-hook-form";

const Register = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch
  } = useForm({
    defaultValues: {
      email: "",
      userName: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const handleOnSubmit = (data) => {
    console.log(data);
  };

  console.log(errors);

  return (
    <div className="relative">
      <div>
        <div className="flex items-center justify-center p-12">
          <div className="mx-auto w-full max-w-[550px]">
            <form onSubmit={handleSubmit(handleOnSubmit)}>
              <div className="mb-5">
                <span className="mb-3 block text-base font-medium text-[#07074D]">
                  Email
                </span>
                {errors?.email?.message && (
                  <div
                    class="p-2 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
                    role="alert"
                  >
                    <span class="font-medium">Alert!</span>{" "}
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
                  placeholder="Full Name"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>

              <div className="mb-5">
                <span className="mb-3 block text-base font-medium text-[#07074D]">
                  User Name
                </span>
                {errors?.userName?.message && (
                  <div
                    class="p-2 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
                    role="alert"
                  >
                    <span class="font-medium">Alert!</span>{" "}
                    {errors.userName.message}
                  </div>
                )}
                <input
                  type="text"
                  {...register("userName", {
                    required: {
                      value: true,
                      message: "User Name is required",
                    },
                  })}
                  placeholder="Full Name"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>

              <div className="mb-5">
                <span className="mb-3 block text-base font-medium text-[#07074D]">
                  Password
                </span>
                {errors?.password?.message && (
                  <div
                    class="p-2 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
                    role="alert"
                  >
                    <span class="font-medium">Alert!</span>{" "}
                    {errors.password.message}
                  </div>
                )}
                <input
                  type="password"
                  {...register("password", {
                    required: {
                      value: true,
                      message: "Password is required",
                    },
                  })}
                  placeholder="Your password"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>

              <div className="mb-5">
                <span className="mb-3 block text-base font-medium text-[#07074D]">
                  Password Confirm
                </span>
                {errors?.passwordConfirm?.message && (
                  <div
                    class="p-2 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
                    role="alert"
                  >
                    <span class="font-medium">Alert!</span>{" "}
                    {errors.passwordConfirm.message}
                  </div>
                )}
                <input
                  type="password"
                  {...register("passwordConfirm", {
                    validate: value => value === watch("password") || "The passwords do not match",
                
                  })}
                  placeholder="Your password"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>


              <div>
                <button
                  type="submit"
                  className="hover:shadow-form rounded-md !bg-main py-3 px-8 text-base font-semibold text-white outline-none"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
