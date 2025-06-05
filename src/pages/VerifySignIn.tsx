import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useVerifyUserQuery, useSignInUserMutation } from "../redux/authApi";
import DisplayMessage from "../components/DisplayMessage";
import { useDispatch } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import Loader from "../components/Loader";
import { setCredentials } from "../redux/authSlice";
import type { SignInResponseType } from "../components/types";

const VerifySignIn = () => {
    const {token} = useParams<string>();
        const result = useVerifyUserQuery(token)

        useEffect(() => {;
            if(result.isSuccess){
                console.log(result)
                setDisplayMesage({message: result.data["message"], type: "success"});
            }
        }, [result])
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
  const [formState, setFormState] = useState<formStateType>({
    email: "",
    password: ""
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleFormState = (e:React.ChangeEvent<HTMLInputElement>): void => {
    setFormState({...formState, [e.target.name]: e.target.value});
  }

  const [signInUser] = useSignInUserMutation();
  const signInFunction = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const formData: FormData = new FormData();
    formData.append("email", formState.email);
    formData.append("password", formState.password);
    try{
      setIsLoading(true)
      const result = await signInUser(formState) as SignInResponseType;
      console.log(result)
      if(result.error){
        setIsLoading(false);
        setDisplayMesage({message: result.error?.data.message, type: "error"})
        return
      }
      if(result.data){
        setIsLoading(false)
        dispatch(setCredentials({user: result.data.user, token: result.data.token}))
        
        setFormState({ email: "", password: "" });
        navigate("/");
      }
    } catch (err) {
        if(err instanceof Error){
            setIsLoading(false)
            setDisplayMesage({message: err.message, type: "error"})
        }
    }
  };

  return (
    <>
    <main className="w-full h-[100vh] flex flex-col justify-center items-center gap-1 bg-[#f0ffff]">
      {displayMessage.message && <DisplayMessage displayMessage={displayMessage} setDisplayMessage={setDisplayMesage} />}
      <form onSubmit={signInFunction} className="flex flex-col items-center gap-3 min-w-80">
        <div>
          <h1 className="mb-1 text-4xl text-center font-black text-[#170000]">filmpulse</h1>
          <p className="text-sm">Sign in to your filmpulse account!</p>
        </div>
        <div className="w-full relative">
            <input
                type="email"
                id="email"
                name="email"
                value={formState.email}
                className="peer w-full border border-[#170000] focus:border-[#da0009] rounded-sm text-lg outline-none px-3 py-2"
                onChange={(e:React.ChangeEvent<HTMLInputElement>) => handleFormState(e)}
            />
            <label
                htmlFor="email"
                className={`bg-[#f0ffff] pointer-events-none  absolute left-3 w-fit cursor-text ${formState.email === "" && "top-[0.5rem] text-lg text-[#9ca3af]"}  transition-all peer-focus:text-[12px] peer-focus:-top-2.5 peer-focus:px-1 peer-focus:text-[#da0009] ${formState.email && "text-[12px] -top-2.5 px-1 text-[#170000]"}`}
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
                    className="peer w-full border border-[#170000] focus:border-[#da0009] rounded-sm text-lg outline-none px-3 py-2 bg-transparent"
                    onChange={(e:React.ChangeEvent<HTMLInputElement>) => handleFormState(e)}
                />
                <label
                    htmlFor="password"
                    className={`bg-[#f0ffff] pointer-events-none  absolute left-3 w-fit cursor-text ${formState.password === "" && "top-[0.5rem] text-lg text-[#9ca3af]"}  transition-all peer-focus:text-[12px] peer-focus:-top-2.5 peer-focus:px-1 peer-focus:text-[#da0009] ${formState.password && "text-[12px] -top-2.5 px-1 text-[#170000]"}`}
                >
                    Password
                </label>
                <button type="button" className="absolute top-[0.7rem] right-3 cursor-pointer" onClick={() => setShowPassword(prev => !prev)}>
                    {showPassword ? <EyeOff color="#170000" /> : <Eye />}
                </button>
            </div>

        <button type="submit" className="bg-[#da0009] w-full py-2 text-lg font-black text-[#fff1fc] rounded-sm -mt-1 cursor-pointer transition-all hover:opacity-85 flex items-center justify-center">{isLoading ? <Loader /> : "SignIn"}</button>
      </form>
      <div className="flex gap-2 text-[#170000]">
        <p>Don't have an account?</p>
        <Link to='/signup' className="font-bold underline">Signup</Link>
      </div>
      <div className="text-[#170000] -mt-1">
        <Link to='/signup' className="font-bold underline">Forgot password?</Link>
      </div>
    </main>
    </>
  );
};

export default VerifySignIn;
