import { useRef, useState } from "react";
import DisplayMessage from "../components/DisplayMessage";
import { useUpdateUserMutation } from "../redux/authApi";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { ChevronLeftCircle } from "lucide-react";
import Loader from "../components/Loader";

const EditProfile = () => {
    type formStateType = {
        firstname: string,
        lastname: string,
        profilephoto: Blob | string
    }
    type displayMessageType = {
        message: string | null,
        type: "error" | "success" | "email" | null
    }
    const [isUpdating, setIsUpdating] = useState<boolean>(false)

    const user = useSelector((state: RootState) => state.user.user);
    
    const profilephotoInputRef = useRef<HTMLInputElement>(null);
    const profilephotoRef = useRef<HTMLImageElement>(null);
    const [displayMessage, setDisplayMesage] = useState<displayMessageType>({message: null, type: null});
    const [formState, setFormState] = useState<formStateType>({
        firstname: user?.firstname || "",
        lastname: user?.lastname || "",
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

    const [updateUser] = useUpdateUserMutation();
    const navigate = useNavigate()
    const updateUserProfile = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        const formData: FormData = new FormData();
        formData.append("firstname", formState.firstname);
        formData.append("lastname", formState.lastname);
        formData.append("id", user?._id ?? "");
        if(formState.profilephoto !== "") formData.append("profilephoto", formState.profilephoto);
        try{
            setIsUpdating(true)
            const result = await updateUser(formData) as {data: {message: string}, error?: {data: {message: string}}};
            if (result.error) { 
                setIsUpdating(false)
                setDisplayMesage({message: result.error?.data?.message, type: "error"});
                return
            }
            if(result.data){
                setIsUpdating(false)
                navigate(-1)
            }
        } catch(err) {
            setIsUpdating(false)
            console.log(err);
        }
    };

    return (
        <main className="w-full h-[100vh] flex flex-col justify-center items-center gap-1 bg-[#f0ffff]">
            {displayMessage.message &&
            <DisplayMessage displayMessage={displayMessage} setDisplayMessage={setDisplayMesage}/>
            }
            <h1 className="mb-4 font-bold text-2xl text-[#170000]">Edit Profile</h1>
            <form onSubmit={updateUserProfile} className="flex flex-col items-center gap-[0.8rem] min-w-80">
            <div className="flex flex-col items-center -mt-2">
                <img ref={profilephotoRef} className="w-[100px] h-[100px] object-cover rounded-full mb-1" src={user ? `${user.imageUrl}` : "/profileplaceholder.jpg"} alt="" />
                <label htmlFor="profilephoto" className="bg-[#da0009] p-2 rounded-sm text-[#fff1fc] font-bold cursor-pointer transition-all hover:opacity-85">
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
                className="peer w-full border border-[#170000] focus:border-[#da0009] rounded-sm text-lg outline-none px-3 py-2"
                onChange={(e:React.ChangeEvent<HTMLInputElement>) => handleFormState(e)}
            />
            <label
                htmlFor="firstname"
                className={`bg-[#f0ffff] pointer-events-none  absolute left-3 w-fit cursor-text ${formState.firstname === "" && "top-[0.5rem] text-lg text-[#9ca3af]"}  transition-all peer-focus:text-[12px] peer-focus:-top-2.5 peer-focus:px-1 peer-focus:text-[#da0009] ${formState.firstname && "text-[12px] -top-2.5 px-1 text-[#170000]"}`}
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
                className="peer w-full border border-[#170000] focus:border-[#da0009] rounded-sm text-lg outline-none px-3 py-2"
                onChange={(e:React.ChangeEvent<HTMLInputElement>) => handleFormState(e)}
            />
            <label
                htmlFor="lastname"
                className={`bg-[#f0ffff] pointer-events-none  absolute left-3 w-fit cursor-text ${formState.lastname === "" && "top-[0.5rem] text-lg text-[#9ca3af]"}  transition-all peer-focus:text-[12px] peer-focus:-top-2.5 peer-focus:px-1 peer-focus:text-[#da0009] ${formState.lastname && "text-[12px] -top-2.5 px-1 text-[#170000]"}`}
            >
                Lastname
            </label>
            </div>

            <button type="submit" className="bg-[#da0009] w-full py-2 text-lg font-black text-[#fff1fc] rounded-sm -mt-1 cursor-pointer transition-all hover:opacity-85 flex items-center justify-center">{isUpdating ? <Loader /> : "Update"}</button>
        </form>
        <div className='w-full flex justify-center'>
            <button onClick={() => navigate(-1)} className='bg-[#170000] text-[#fff1fc] px-4 rounded-sm font-bold py-2 flex w-fit items-center justify-center gap-1 hover:opacity-90 mt-5'>
                <ChevronLeftCircle size={17} color='#fff1fc' strokeWidth={3} className='mt-[2px]' /> 
                <p>Go Back</p>
            </button>
        </div>
        </main>
    );
    };

    export default EditProfile;
