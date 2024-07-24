import uploadUserProfileImage from "@/helpers/user";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";
import Spinner from "./spinner";

export default function Avatar({size,url,editable,onChange}){
    let width,hight;
    if(size=="big"){
        width=" w-36";
        hight="h-36"
    }
    else{
        width="w-10";
        hight="h-10";
    }
    const supabase=useSupabaseClient();
    const session=useSession();
    const [spinner,SetSpinner]=useState(false);

    async function uploadAvatar(ev){
        const file=ev.target.files?.[0];
        
        if(file){
            SetSpinner(true);
            await uploadUserProfileImage(supabase,session.user.id,file,'Avatars','avatar');
            if(onChange){
                await onChange();
            }
            SetSpinner(false);
        }
    }
    return (
        <div>
            <div className={` ${width} fill rounded-full overflow-hidden relative`}>
                <div>
                    <img className={`${width} ${hight}`} src={url} ></img>
                </div>
                
                {spinner&&(
                    <div className="w-full h-full inset-0 flex items-center justify-center bg-white opacity-70 absolute">
                        <Spinner/>
                    </div>
                )}
            </div>
            {
                editable&&(
                    <label className="absolute right-0 bottom-1 shadow-md rounded-full p-2 bg-white cursor-pointer">
                        <input type="file" className="hidden" onChange={uploadAvatar}></input>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                        </svg>
                    </label>
                )
            }
        </div>
    );
}