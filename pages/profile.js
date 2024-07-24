// import NavigationCard from "../components/NavigationCard";

import Avatar from "@/components/Avatar";
import FriendInfo from "@/components/FriendInfo";
import NavigationCard from "@/components/NavigationCard";
import PostCard from "@/components/PostCard";
import Card from "@/components/card";
import Cover from "@/components/Cover";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProfileTab from "@/components/ProfileTab";
import ProfileContent from "@/components/ProfileContent";
import {UserContextProvider} from "@/context/context"


export default function ProfilePage(){
  const router=useRouter();
  //console.log(router);
  const userId=router.query.id;
  
  // console.log(userId);
  const session=useSession();
  const supabase=useSupabaseClient();
  const [profile,setProfile]=useState();
  const [editMode,setEditMode]=useState(false);
  const [name,setName]= useState("");
  const [place,setPlace]=useState("");
  
  useEffect(()=>{
    if(!userId){

      return;
    }
    fetchUser();
  },[userId])
  function fetchUser(){
    
    supabase.from("profiles").select().eq('id',userId).then(result=>{
      if(result.error){
        return;
      }
      else{  
        setProfile(result.data[0]);
      }
    })
  }
  // console.log(profile);
  // console.log(router);
  // console.log(pathname);
  
  const isMyProfile=session?.user?.id==userId 

  function saveProfile(){
    
      supabase.from('profiles').update({name,place}).eq('id',session.user.id).then((data,err)=>{
        if(err){
          throw err;
        }
        else{
          setProfile(prev=>({...prev,name,place}));
        }
        
      })
   
   
    setEditMode(false);
  }
  
    return (
      <div className="flex max-w-4xl mx-auto gap-6 mt-4">
        <div className=" w-4/12">
          <NavigationCard/>
        </div>
        
        <div className=" w-10/12 rounded-lg overflow-hidden ">
        <UserContextProvider>
          <Card> 
              <div className="relative ">
              <Cover url={profile?.cover} editable={isMyProfile} onChange={fetchUser}/>
              <div className="absolute top-24">
                <div className=" relative">
                  <Avatar size="big" url={profile?.avatar} editable={isMyProfile} onChange={fetchUser}></Avatar>
                </div>
              </div>
              <div className=" pt-5 pb-16 ml-40 flex justify-between">
                <div className=" h-10">
                  {!editMode&&(
                    <div>
                      <h1 className="  text-2xl font-bold">{profile?.name}</h1>
                      <div className="text-gray-500 leading-4">{profile?.place||'internet'}</div>
                    </div>
                  )}
                  {editMode&&(
                    <div>
                      <div >
                        <input type="text"
                          placeholder="Enter Name" 
                          className=" border-2 border-socialBlue rounded-md px-2 py-1" 
                          onChange={ev=>{setName(ev.target.value)}}
                          value={name}
                        ></input>
                      </div>
                      <div>
                      <input type="text"
                        placeholder="Enter Location(Nation, State)" 
                        className=" border-2 border-socialBlue rounded-md px-2 py-1 mt-1"
                        onChange={ev=>{setPlace(ev.target.value);}}
                        value={place}
                      ></input>
                      </div>
                    </div>
                  )}
                  
                </div>
                <div>
                  
                    {isMyProfile && !editMode && (
                      <div className=" shadow-md px-2 py-1 rounded-md hover:bg-socialBlue hover:text-white hover:scale-110 ">
                      <button className="flex items-center gap-1" onClick={()=>{
                        setEditMode(true);
                        setName(profile?.name);
                        setPlace(profile?.place);
                        }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                        Edit Profile
                      </button>
                      </div>
                    )}
                    {isMyProfile && editMode && (
                      <div className=" shadow-md px-2 py-1 rounded-md hover:bg-socialBlue hover:text-white hover:scale-110 ">
                      <div>
                        <button className="flex items-center gap-1" onClick={()=>{
                        
                        saveProfile();
                      }}>
                        <svg className="size-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth={0}>
                          <path d="M20 5H8V9H6V3H22V21H6V15H8V19H20V5Z" fill="currentColor" ></path> 
                          <path d="M13.0743 16.9498L11.6601 15.5356L14.1957 13H2V11H14.1956L11.6601 8.46451L13.0743 7.05029L18.024 12L13.0743 16.9498Z" fill="currentColor"></path>       
                        </svg>
                        Save Profile
                      </button>
                      </div>
                      </div>
                    )}
                  
                  
                  {isMyProfile&&editMode&&( 
                  <div className=" shadow-md px-2 py-1 rounded-md hover:bg-socialBlue hover:text-white hover:scale-110 mt-2" >
                    <button className="flex items-center gap-1 " onClick={()=>{
                        setEditMode(false)
                      }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                      Cancle
                    </button>
                  </div>
                  )}
                </div>
                
              </div>
              
              <ProfileTab userId={profile?.id} activeTab={router?.query?.tab?.[0]}/>
              </div>
          </Card>
                  
          <ProfileContent activeTab={router?.query?.tab?.[0]} userId={profile?.id}/> 
          </UserContextProvider>    
      </div>
      
      
    </div>

    )
}