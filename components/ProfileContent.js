import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import FriendInfo from "./FriendInfo";
import PostCard from "./PostCard";
import Card from "./card";
import { useContext, useEffect, useState } from "react";
import { UserContextProvider } from "@/context/context";

export default function ProfileContent({activeTab,userId}){
  const [post,setPost]=useState();
  const [profile,setProfile]=useState();
  const [editMode,setEditMode]=useState(false);
  const [about,setAbout]=useState();
  const [aboutText,setAboutText]=useState();
  const [totalPhotos,setTotalPhotos]=useState();
  const session=useSession();
  console.log(activeTab);
  const supabase=useSupabaseClient();
  //console.log(MyProfile);


  useEffect(()=>{
    if(!userId){
      return;
    }
    if(activeTab==="photos"){
      supabase.from('post').select('photos').eq('auther',userId).then(result=>{
        console.log(result)
        setTotalPhotos(result.data);
      })
    }
  },[userId])
  
  useEffect(()=>{
    if(!userId){
      return;
    }
    if(activeTab==="about"){
      supabase.from('profiles').select().eq('id',userId).then(result=>{
        setAbout(result?.data?.[0]?.about);
        setAboutText(about);
      })
    }
  },[userId])
  if(!activeTab){
    activeTab='posts'
  }

  useEffect(()=>{
    if(!userId){
      return ;
    }
    // console.log(userId);
    if(activeTab==='posts'){
      loadPost(userId).then({});
    }
  },[userId]);

  function saveAbout(){
    supabase.from('profiles').update({about:about}).eq('id',userId).then(()=>{
      setEditMode(false);
    })
    
  }

  async function loadPost(userId){
    const userPost=await posts(userId);
    const userProfile=await profiles(userId);
    setPost(userPost);
    setProfile(userProfile);
    return {post,profile};
  }

  async function posts(userId){
    const {data}=await supabase.from('post').select("id,content,created_at,photos").eq('auther',userId);
    // console.log(data);
    return data;
  }

  async function profiles(userId){
    const {data}=await supabase.from('profiles').select().eq('id',userId);
    // console.log(data);
    return data?.[0];
  }

    return(
        <div>
          {activeTab==='posts'&&(
            <div>
            {post?.length>0&&post.map(eachPost=>(
              
              <PostCard key={eachPost.created_at} {...eachPost} profiles={profile}/>
            
            ))}
            </div>
          )}
        
        {activeTab==='about'&&(
          <div>
            <Card>
              <div className="flex justify-between items-center">
                <h2 className=" text-3xl mb-2">About</h2>
                {session?.user?.id===userId&&(
                  <div>
                    {!editMode&&(
                      <div>
                      <button className=" bg-socialBlue px-2 py-1 rounded-md shadow-md text-white flex gap-1 items-center" onClick={()=>{setEditMode(true)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                        Change about
                      </button>
                      </div>
                    )}
                    {editMode&&(
                      <div>
                      <button className=" bg-socialBlue px-2 py-1 rounded-md shadow-md text-white flex gap-1 items-center" onClick={saveAbout}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                        </svg>
                        Save about
                      </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            {!editMode&&(
              <div>
                {about}
              </div>
            )}
            {editMode&&(
              <textarea className="text-sm px-2 py-1 w-full border-2 rounded-xl border-socialBlue" placeholder="enter about yourself" value={about} onChange={(ev)=>{setAbout(ev.target.value)}}/>
            )}
              {/* <p className="text-sm mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Convallis tellus id interdum velit laoreet id donec. Maecenas accumsan lacus vel facilisis volutpat est velit egestas. Pulvinar elementum integer enim neque volutpat ac. Eget sit </p>
              <p className="text-sm mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Convallis tellus id interdum velit laoreet id donec. Maecenas accumsan lacus vel facilisis volutpat est velit egestas. Pulvinar elementum integer enim neque volutpat ac. Eget sit </p> */}
            </Card>
          </div>
        )}

        {
         activeTab==='friends'&&(
            <div>
              <Card>
                <h2 className=" text-3xl mb-2 ">Friend</h2>

                

                <div className="p-3 px-4 border-b border-gray-100 -mx-4">
                  <FriendInfo/>
                </div>
                <div className="p-3 px-4 border-b border-gray-100 -mx-4">
                  <FriendInfo/>
                </div>
                <div className="p-3 px-4 border-b border-gray-100 -mx-4">
                  <FriendInfo/>
                </div>
                <div className="p-3 px-4 border-b border-gray-100 -mx-4">
                  <FriendInfo/>
                </div>
                <div className="p-3 px-4 border-b border-gray-100 -mx-4">
                  <FriendInfo/>
                </div>
                <div className="p-3 px-4 border-b border-gray-100 -mx-4">
                  <FriendInfo/>
                </div>
              </Card>
            </div>    
          )
        }

        {
          activeTab==='photos'&&(
            <div>
              <Card>
                  {totalPhotos?.map((eachPostPhotos,index)=>(
                      <div key={index} className="grid item-center grid-cols-2 gap-2">
                        {eachPostPhotos?.photos?.length>0&& eachPostPhotos?.photos.map((eachPhoto,lowIndex)=>(
                          <div key={lowIndex} className="rounded-md overflow-hidden h-48 ">
                            <img className=" rounded-md" src={eachPhoto}/>
                          </div>
                        ))}
                      </div>
                    ))}
              </Card>
            </div>
          )
        }
        </div>
    );
}