import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignInUserMutation } from "../redux/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/authSlice";
import { Eye, EyeOff } from "lucide-react";
import DisplayMessage from "../components/DisplayMessage";
import Loader from "../components/Loader";
import type { SignInResponseType } from "../components/types";

const SignIn = () => {
  type displayMessageType = {
    message: string | null,
    type: "error" | "success" | "email" | null
  }
  type formStateType = {
    email: string,
    password: string
  }
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [displayMessage, setDisplayMesage] = useState<displayMessageType>({message: null, type: null});
  const [signInUser] = useSignInUserMutation();
  const [formState, setFormState] = useState<formStateType>({
    email: "",
    password: ""
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleFormState = (e:React.ChangeEvent<HTMLInputElement>): void => {
    setFormState({...formState, [e.target.name]: e.target.value});
  }

  const signInFunction = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const formData: FormData = new FormData();
    formData.append("email", formState.email);
    formData.append("password", formState.password);
    try{
      setIsLoading(true)
      const result = await signInUser(formState) as SignInResponseType;
      if(result.error){
        setIsLoading(false)
        setDisplayMesage({message: result.error.data.message, type: "error"})
        return
      }
      if(result.data){
        setIsLoading(false)
        dispatch(setCredentials({user: result.data.user, token: result.data.token}))
        
        setFormState({ email: "", password: "" });
        // setDisplayMesage({message: "Verification email sent!", type: "email"})
        navigate("/");
      }
    } catch (err) {
      setIsLoading(false)
      if(err instanceof Error){
        setDisplayMesage({message: err.message, type: "error"})
      }
    }
  };

  return (
    <>
    <main className="w-full h-[100vh] flex flex-col justify-center items-center gap-1 bg-[#f0ffff]">
      {displayMessage.message && <DisplayMessage displayMessage={displayMessage} setDisplayMessage={setDisplayMesage} />}
      <form onSubmit={signInFunction} className="flex flex-col items-center gap-2 min-w-70">
        <div>
          <h1 className="text-2xl text-center font-black text-[#170000]">filmpulse</h1>
          <p className="text-sm">Sign in to your filmpulse account!</p>
        </div>
        <div className="w-full relative">
            <input
                type="email"
                id="email"
                name="email"
                value={formState.email}
                className="peer w-full text-[0.9rem] border border-[#ddd] inset-shadow-sm focus:border-[#da0009] rounded-sm outline-none px-3 py-2"
                onChange={(e:React.ChangeEvent<HTMLInputElement>) => handleFormState(e)}
            />
            <label
                htmlFor="email"
                className={`bg-[#f0ffff] pointer-events-none  absolute left-3 w-fit cursor-text ${formState.email === "" && "top-[0.5rem] text-[0.9rem] text-[#9ca3af]"}  transition-all peer-focus:text-[12px] peer-focus:-top-2.5 peer-focus:px-1 peer-focus:text-[#da0009] ${formState.email && "text-[12px] -top-2.5 px-1 text-[#170000]"}`}
            >
                Email
            </label>
            </div>

            <div className="w-full relative">
                <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formState.password}
                    className="peer w-full text-[0.9rem] border border-[#ddd] inset-shadow-sm focus:border-[#da0009] rounded-sm outline-none px-3 py-2 bg-transparent"
                    onChange={(e:React.ChangeEvent<HTMLInputElement>) => handleFormState(e)}
                />
                <label
                    htmlFor="password"
                    className={`bg-[#f0ffff] pointer-events-none  absolute left-3 w-fit cursor-text ${formState.password === "" && "top-[0.5rem] text-[0.9rem] text-[#9ca3af]"}  transition-all peer-focus:text-[12px] peer-focus:-top-2.5 peer-focus:px-1 peer-focus:text-[#da0009] ${formState.password && "text-[12px] -top-2.5 px-1 text-[#170000]"}`}
                >
                    Password
                </label>
                <button type="button" className="absolute top-[0.7rem] right-3 cursor-pointer" onClick={() => setShowPassword(prev => !prev)}>
                    {showPassword ? <EyeOff color="#170000" size={18}/> : <Eye color="#170000" size={18}/>}
                </button>
            </div>

        <button type="submit" className="bg-[#da0009] w-full py-2 text-[1rem] font-black text-[#fff1fc] rounded-sm -mt-[0.15] cursor-pointer transition-all hover:opacity-85 flex items-center justify-center">{isLoading ? <Loader /> : "Signin"}</button>
      </form>
      <div className="flex gap-2 text-[#170000] text-[0.9rem]">
        <p>Don't have an account?</p>
        <Link to='/signup' className="font-bold underline">Signup</Link>
      </div>
      <div className="text-[#170000] -mt-1 text-[0.9rem]">
        <Link to='/signup' className="font-bold underline">Forgot password?</Link>
      </div>
    </main>
    </>
  );
};

export default SignIn;
