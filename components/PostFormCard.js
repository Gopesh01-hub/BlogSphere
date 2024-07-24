import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Avatar from "./Avatar";
import Card from "./card";
import { useContext, useEffect, useState } from "react";
import profile from "@/pages/profile/[id]/[...tab]";
import { data } from "autoprefixer";
import { userContext } from "@/context/context";
import Spinner from "./spinner";


export default function PostFormCard({onPost}){
    const [content,setContent]=useState("");
    const supabase=useSupabaseClient();
    const session=useSession();
    const profile=useContext(userContext);
    const [uploads,setUploads]=useState([]);
    const [spinner,setSpinner]=useState(false);
    // console.log(profile);

    function createPost(){
        supabase.from("post")
        .insert({
            auther:session.user.id,
            content,
            photos:uploads,
        }).then(res=>{
            // console.log(res);
            if(!res.error){
                setContent("");
                setUploads([]);
                if(onPost){
                    onPost();
                }
            }
        })
        
    }
    
    
    // console.log(profile);
    async function uplodeImage(ev){
        const files=ev.target.files;
        if(files.length>0){
            setSpinner(true);
            for(const file of files){
                const newName=Date.now() + file.name;
                const result=await supabase.storage.from('photos').upload(newName,file);
                if(result.data){
                    const url=process.env.NEXT_PUBLIC_SUPABASE_URL+'/storage/v1/object/public/photos/'+newName;
                    setUploads(prevUploads=>[...prevUploads,url]);
                }else{
                    console.log(result);
                }
            }
            setSpinner(false);
        }
    }

    //https://afturugdzdfzlwrxzfsj.supabase.co/storage/v1/object/public/photos/1719575530595download.jpeg

    return(
        <Card >
            <div className="flex gap-4">
                <Avatar url={profile?.avatar}/>
                { profile&&(
                    <textarea value={content} onChange={e=>setContent(e.target.value)} className="grow px-2 py-1 h-10" placeholder={`Whats on your mind, ${profile?.name}?`}   />
                )}
                
            </div>
            {spinner && (
                <Spinner/>
            )}
            {uploads.length>0 && (
                <div className="flex gap-2 mt-4 flex-wrap ">
                    {uploads.map(upload  =>(
                        <div className="">
                            <img src={upload} alt="" className="w-auto h-24 rounded-md" />
                        </div>
                        
                    ))}
                </div>
            )}
            <div className="flex gap-5 items-center mt-3">
            <label className="flex gap-1">
                <input type="file" className=" hidden" multiple onChange={uplodeImage}></input>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                    Image
                </label >
                <button className="flex gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                    People
                </button >
                <button className="flex gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                    Check in
                </button>
                <button className="flex gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                </svg>
                    Mood
                </button>
                <div className="grow text-right">
                    <button onClick={createPost} className="bg-socialBlue px-3 py-1 rounded-md text-white">Share</button>
                </div>
            </div>
            
        </Card>
    );
}