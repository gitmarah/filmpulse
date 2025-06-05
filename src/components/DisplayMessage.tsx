import React, { useEffect, useState } from 'react';
import { CircleAlert, CircleCheck, MailCheck } from 'lucide-react';

type displayMessageType = {
        message: string | null,
        type: "error" | "success" | "email" | null
    }

type PropType = {
    displayMessage: displayMessageType
    setDisplayMessage: React.Dispatch<React.SetStateAction<displayMessageType>>
}

const DisplayMessage = ({displayMessage, setDisplayMessage}: PropType): React.ReactElement | null => {
  const [isDisplaying, setIsDisplaying] = useState<boolean>(true);

  useEffect(() => {
    const displayTimeout: number = setTimeout(() => {
      setIsDisplaying(false)
      setDisplayMessage({message: null, type: null})
    }, 4000);
    return () => clearTimeout(displayTimeout);
  }, [setDisplayMessage])
  
  if(isDisplaying) return <div className='max-w-96 flex gap-2 items-center justify-center bg-[#170000] text-[#fff1fc] text-sm font-medium py-1 px-2 rounded-sm absolute top-5 animate-bounce'>
      {displayMessage.type === "error" ? <CircleAlert strokeWidth={3} size={18} /> : displayMessage.type === "email" ? <MailCheck strokeWidth={3} size={18}/> : <CircleCheck strokeWidth={3} size={18}/>}
      <p>{displayMessage.message}</p>
    </div>
  return null
}

export default DisplayMessage