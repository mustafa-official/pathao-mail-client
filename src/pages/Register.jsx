import { useContext, useState } from "react";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import toast from "react-hot-toast";
import { ImSpinner9 } from "react-icons/im";

const Register = () => {
  const [showPassword, setShowPassword] = useState(true);
  const navigate = useNavigate();
  const { registerUser, updateProfileInfo, setLoading, loading } =
    useContext(AuthContext);

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    try {
      setLoading(true);
      await registerUser(email, password);
      await updateProfileInfo(name, "empty");
      toast.success("Register Successfully");
      navigate("/dashboard");
      form.reset();
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="flex justify-center items-center flex-col min-h-[calc(100vh-66px)]">
        <form
          className="lg:col-span-3 md:col-span-2 max-w-lg w-full px-6 mx-auto"
          onSubmit={handleRegister}
        >
          <div className="mb-6 sm:mb-8">
            <h3 className="text-gray-800 text-3xl sm:text-4xl font-extrabold">
              Register
            </h3>
          </div>

          <div className="relative flex items-center">
            <label className="text-gray-800 text-[13px] bg-white absolute px-2 top-[-9px] left-[18px] font-semibold">
              Name
            </label>
            <input
              required
              type="text"
              placeholder="Enter name"
              name="name"
              className="px-4 py-3.5 bg-white w-full text-sm border border-gray-500 focus:border-black rounded-md outline-none"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#bbb"
              stroke="#bbb"
              className="w-[18px] h-[18px] absolute right-4"
              viewBox="0 0 682.667 682.667"
            >
              <g transform="matrix(1.33 0 0 -1.33 0 682.667)">
                <path
                  fill="none"
                  strokeMiterlimit="10"
                  strokeWidth="40"
                  d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                ></path>
              </g>
            </svg>
          </div>
          <div className="relative flex items-center mt-6">
            <label className="text-gray-800 text-[13px] bg-white absolute px-2 top-[-9px] left-[18px] font-semibold">
              Email
            </label>
            <input
              required
              type="email"
              placeholder="Enter email"
              name="email"
              className="px-4 py-3.5 bg-white w-full text-sm border border-gray-500 focus:border-black rounded-md outline-none"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#bbb"
              stroke="#bbb"
              className="w-[18px] h-[18px] absolute right-4"
              viewBox="0 0 682.667 682.667"
            >
              <g transform="matrix(1.33 0 0 -1.33 0 682.667)">
                <path
                  fill="none"
                  strokeMiterlimit="10"
                  strokeWidth="40"
                  d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                ></path>
              </g>
            </svg>
          </div>

          <div className="relative flex items-center mt-6">
            <label className="text-gray-800 text-[13px] bg-white absolute px-2 top-[-9px] left-[18px] font-semibold">
              Password
            </label>
            <input
              required
              type={showPassword ? "password" : "text"}
              placeholder="Enter password"
              name="password"
              className="px-4 py-3.5 bg-white w-full text-sm border border-gray-500 focus:border-black rounded-md outline-none"
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 cursor-pointer"
            >
              {showPassword ? (
                <IoIosEye size={25} color="#bbb" />
              ) : (
                <IoIosEyeOff size={25} color="#bbb" />
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 shrink-0 text-[#1f1d1d] focus:ring-blue-500 border-gray-300 rounded-md"
              />
              <label
                htmlFor="remember-me"
                className="ml-3 block text-sm  text-gray-800"
              >
                Remember me
              </label>
            </div>
            <div>
              <a
                href="#"
                className="text-[#1f1d1d] font-semibold text-sm hover:underline"
              >
                Forgot Password?
              </a>
            </div>
          </div>

          <div className="mt-7">
            <button
              disabled={loading}
              type="submit"
              className="w-full disabled:cursor-not-allowed h-11 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-[#1f1d1d] hover:bg-black  focus:outline-none"
            >
              {loading ? (
                <ImSpinner9
                  size={16}
                  color="white"
                  className="animate-spin m-auto"
                />
              ) : (
                "Register"
              )}
            </button>
          </div>
        </form>
        <p className="text-sm text-gray-800 mt-3  text-center">
          Already have an account?
          <Link
            to="/"
            className="text-[#1f1d1d] font-semibold hover:underline ml-1 whitespace-nowrap"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
