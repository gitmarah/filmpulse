import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import DisplayMessage from "../components/DisplayMessage";
import { EyeOff, Eye } from "lucide-react";
import { useSignUpUserMutation } from "../redux/authApi";
import Loader from "../components/Loader";
import type { SignUpResponseType } from "../components/types";
// import { setCredentials } from "../redux/authSlice";

const SignUp = () => {
    type formStateType = {
        firstname: string,
        lastname: string,
        email: string,
        password: string,
        confirmpassword: string,
        profilephoto: Blob | string
    }
    type displayMessageType = {
        message: string | null,
        type: "error" | "success" | "email" | null
    }
    
    const profilephotoInputRef = useRef<HTMLInputElement>(null);
    const profilephotoRef = useRef<HTMLImageElement>(null);
    const [displayMessage, setDisplayMesage] = useState<displayMessageType>({message: null, type: null})
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
    const [formState, setFormState] = useState<formStateType>({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmpassword: "",
        profilephoto: ""
    });

    const handleFormState = (e:React.ChangeEvent<HTMLInputElement>): void => {
        if(e.target.name === "profilephoto"){
            if(!profilephotoRef.current || !e.target.files) return
            console.log(URL.createObjectURL(e.target.files[0]))
            profilephotoRef.current.src = URL.createObjectURL(e.target.files[0])
            setFormState({...formState, [e.target.name]: e.target.files[0]});
            return
        }
        setFormState({...formState, [e.target.name]: e.target.value});
    }

    const [signUpUser] = useSignUpUserMutation();

    const signUpFunction = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        console.log(formState)
        if(formState.password !== formState.confirmpassword){
            setDisplayMesage({message: "Password & Confirm Password are different!", type: "error"})
            return
        }
        const formData: FormData = new FormData();
        formData.append("email", formState.email);
        formData.append("password", formState.password);
        formData.append("firstname", formState.firstname);
        formData.append("lastname", formState.lastname);
        formData.append("profilephoto", formState.profilephoto);
        console.log(formData.get("profilephoto"));
        try{
            setIsLoading(true)
            const result = await signUpUser(formData) as SignUpResponseType;
            console.log(result)
            if (result.error) { 
                setIsLoading(false)
                setDisplayMesage({message: result.error?.data?.message, type: "error"});
                return
            }
            if(result.data){
                setIsLoading(false)
                if(
                    profilephotoInputRef.current &&
                    profilephotoRef.current
                ){
                    profilephotoInputRef.current.files = null
                    profilephotoRef.current.src = "/profileplaceholder.jpg"
                }
                
                setFormState({
                    firstname: "",
                    lastname: "",
                    email: "",
                    password: "",
                    confirmpassword: "",
                    profilephoto: ""
                });
                setDisplayMesage({message: "Verification email sent!", type: "email"})
            }
        } catch(err) {
            setIsLoading(false)
            console.log(err);
        }
    };

    return (
        <main className="w-full h-[100vh] flex flex-col justify-center items-center gap-1 bg-[#f0ffff]">
            {displayMessage.message &&
            <DisplayMessage displayMessage={displayMessage} setDisplayMessage={setDisplayMesage}/>
            }
            <form onSubmit={signUpFunction} className="flex flex-col items-center gap-[0.5rem] min-w-70">
            <div>
            <h1 className="text-[1rem] mb-2">Create your <span className="font-extrabold">filmpulse</span> account!</h1>
            </div>
            <div className="flex flex-col items-center -mt-2">
                <img ref={profilephotoRef} className="w-[80px] h-[80px] rounded-full mb-1" src="/profileplaceholder.jpg" alt="" />
                <label htmlFor="profilephoto" className="bg-[#da0009] p-2 rounded-sm text-[#fff1fc] font-bold cursor-pointer transition-all hover:opacity-85 text-[0.9rem]">
                    Upload Photo
                </label>
                <input type="file" name="profilephoto" id="profilephoto" 
                ref={profilephotoInputRef}
                className="hidden" onChange={(e:React.ChangeEvent<HTMLInputElement>) => handleFormState(e)}/>
            </div>
            <div className="w-full relative"> 
            <input
                type="firstname"
                id="firstname"
                name="firstname"
                value={formState.firstname}
                autoFocus={true}
                className="peer w-full border border-[#ddd] inset-shadow-sm text-[0.9rem] focus:border-[#da0009] rounded-sm outline-none px-3 py-2"
                onChange={(e:React.ChangeEvent<HTMLInputElement>) => handleFormState(e)}
            />
            <label
                htmlFor="firstname"
                className={`bg-[#f0ffff] pointer-events-none  absolute left-3 w-fit cursor-text ${formState.firstname === "" && "top-[0.5rem] text-[0.9rem] text-[#9ca3af]"}  transition-all peer-focus:mt-1 peer-focus:text-[12px] peer-focus:-top-2.5 peer-focus:px-1 peer-focus:text-[#da0009] ${formState.firstname && "text-[12px] -top-2.5 px-1 text-[#170000]"}`}
            >
                Firstname
            </label>
            </div>
            <div className="w-full relative">
            <input
                type="lastname"
                id="lastname"
                name="lastname"
                value={formState.lastname}
                className="peer w-full border border-[#ddd] inset-shadow-sm text-[0.9rem] focus:border-[#da0009] rounded-sm outline-none px-3 py-2"
                onChange={(e:React.ChangeEvent<HTMLInputElement>) => handleFormState(e)}
            />
            <label
                htmlFor="lastname"
                className={`bg-[#f0ffff] pointer-events-none  absolute left-3 w-fit cursor-text ${formState.lastname === "" && "top-[0.5rem] text-[0.9rem] text-[#9ca3af]"}  transition-all peer-focus:mt-1 peer-focus:text-[12px] peer-focus:-top-2.5 peer-focus:px-1 peer-focus:text-[#da0009] ${formState.lastname && "text-[12px] -top-2.5 px-1 text-[#170000]"}`}
            >
                Lastname
            </label>
            </div>
            <div className="w-full relative">
            <input
                type="email"
                id="email"
                name="email"
                value={formState.email}
                className="peer w-full border border-[#ddd] inset-shadow-sm text-[0.9rem] focus:border-[#da0009] rounded-sm outline-none px-3 py-2"
                onChange={(e:React.ChangeEvent<HTMLInputElement>) => handleFormState(e)}
            />
            <label
                htmlFor="email"
                className={`bg-[#f0ffff] pointer-events-none  absolute left-3 w-fit cursor-text ${formState.email === "" && "top-[0.5rem] text-[0.9rem] text-[#9ca3af]"}  transition-all peer-focus:mt-1 peer-focus:text-[12px] peer-focus:-top-2.5 peer-focus:px-1 peer-focus:text-[#da0009] ${formState.email && "text-[12px] -top-2.5 px-1 text-[#170000]"}`}
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
                    className="peer w-full border border-[#ddd] inset-shadow-sm text-[0.9rem] focus:border-[#da0009] rounded-sm outline-none px-3 py-2 bg-transparent"
                    onChange={(e:React.ChangeEvent<HTMLInputElement>) => handleFormState(e)}
                />
                <label
                    htmlFor="password"
                    className={`bg-[#f0ffff] pointer-events-none  absolute left-3 w-fit cursor-text ${formState.password === "" && "top-[0.5rem] text-[0.9rem] text-[#9ca3af]"}  transition-all peer-focus:mt-1 peer-focus:text-[12px] peer-focus:-top-2.5 peer-focus:px-1 peer-focus:text-[#da0009] ${formState.password && "text-[12px] -top-2.5 px-1 text-[#170000]"}`}
                >
                    Password
                </label>
                <button type="button" className="absolute top-[0.7rem] right-3 cursor-pointer" onClick={() => setShowPassword(prev => !prev)}>
                    {showPassword ? <EyeOff color="#170000" size={18}/> : <Eye color="#170000" size={18}/>}
                </button>
            </div>
            <div className="w-full relative">
                <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmpassword"
                    name="confirmpassword"
                    value={formState.confirmpassword}
                    className="peer w-full border border-[#ddd] inset-shadow-sm text-[0.9rem] focus:border-[#da0009] rounded-sm outline-none px-3 py-2 z-50"
                    onChange={(e:React.ChangeEvent<HTMLInputElement>) => handleFormState(e)}
                />
                <label
                    htmlFor="confirmpassword"
                    className={`bg-[#f0ffff] absolute left-3 pointer-events-none w-fit cursor-text ${formState.confirmpassword === "" && "top-[0.5rem] text-[0.9rem] text-[#9ca3af]"}  transition-all peer-focus:mt-1 peer-focus:text-[12px] peer-focus:-top-2.5 peer-focus:px-1 peer-focus:text-[#da0009] ${formState.confirmpassword && "text-[12px] -top-2.5 px-1 text-[#170000]"}`}
                >
                    Confirm Password
                </label>
                <button type="button" className="absolute top-[0.7rem] right-3 cursor-pointer" onClick={() => setShowConfirmPassword(prev => !prev)}>
                    {showConfirmPassword ? <EyeOff color="#170000" size={18}/> : <Eye color="#170000" size={18}/>}
                </button>
            </div>

            <button type="submit" className="bg-[#da0009] w-full py-2 text-lg font-black text-[#fff1fc] rounded-sm -mt-1 cursor-pointer transition-all flex justify-center hover:opacity-85 text-[1rem]">{isLoading ? <Loader /> : "SignUp"}</button>
        </form>
        <div className="flex gap-2 text-[#170000] text-[0.9rem]">
            <p>Already have an account?</p>
            <Link to='/signin' className="font-bold underline">Signin</Link>
        </div>
        {/* <div className="text-[#170000] -mt-1">
            <Link to='/signup' className="font-bold underline">Forgot password?</Link>
        </div> */}
        </main>
    );
    };

    export default SignUp;
