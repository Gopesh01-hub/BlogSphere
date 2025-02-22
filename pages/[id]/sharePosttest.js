import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import NavigationCard from "@/components/NavigationCard";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import PostCard from "@/components/PostCard";
import { userContext } from "@/context/context";
import Login from "../login";

export default function SharePost1(){
    const route=useRouter();
    const [id,setId]=useState();
    const [flag,setFlag]=useState(true);
    const supabase=useSupabaseClient();
    const session=useSession();
    const [created_at,setCreated_at]=useState(null);
    const [content,setContent]=useState();
    const [photos,setPhotos]=useState();
    const [profiles,setProfile]=useState();

    const [myProfile,setMyProfile]=useState(null);
   

    if(route.query.id&&flag){
        setId(route.query.id);
        setFlag(false);
    }
    useEffect(()=>{
    
        if(!session?.user?.id){
          return;
        };
        supabase.from('profiles')
            .select()
            .eq("id",session.user.id)
            .then(result=> {
                if(result?.data.length){
                    setMyProfile(result.data[0]);
                }
            });
      },[session?.user?.id]
    );
    

    useEffect(()=>{
        if(!id){
            return;
        }
        supabase.from('post').select('*,profiles(*)').eq('id',id).then(result=>{
            if(result.data){
                
                if(result?.data?.length===0){
                    return null;
                }
                else{
                    setContent(result?.data?.[0].content);
                    setCreated_at(result?.data?.[0].created_at);
                    setPhotos(result?.data?.[0].photos);
                    setProfile(result?.data?.[0].profiles);
                }
            }
            else if(result.error){
                return result ;
            }
        })
    },[id])

    if(!session){
        return (<Login/>)
    }

    return(
        <div>
            { created_at===null &&(
                <div>404 error!</div>
            )}

            {created_at!==null &&(
                <div className="md:flex custom:max-w-4xl custom:mx-auto gap-6 mt-4 mx-2">
                    <div className=" w-1/4">
                        <NavigationCard/>
                    </div>
                    <div className="md:w-3/4 w-full">
                        <userContext.Provider value={myProfile}>
                            <PostCard id={id} content={content} created_at={created_at} photos={photos} profiles={profiles}/>
                        </userContext.Provider>
                    </div>
                </div>
            )}
            
        </div>
            
    )

}
