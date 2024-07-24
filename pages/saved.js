import NavigationCard from "@/components/NavigationCard";
import PostCard from "@/components/PostCard";
import { UserContextProvider } from "@/context/context";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

export default function savedPostPage(){
  const [savedPost,setSavedPost]=useState();
    const session=useSession();
    const supabase=useSupabaseClient();
    
    useEffect(()=>{
      if(!session?.user?.id){
        return;
      }
      supabase.from('saved_post').select('*').eq('user_id',session?.user?.id).then((result)=>{
        // console.log(result);
        const postId=result.data.map(item=>item.post_id);
        console.log(postId);
        supabase.from('post').select('*,profiles(*)').in('id',postId).then(result=>{console.log(result);setSavedPost(result.data)})
      })
    },[session?.user?.id])

    return(
        <div className="flex max-w-4xl mx-auto gap-6 mt-4">
      <div className=" w-4/12">
        <NavigationCard/>
      </div>
      <div className="w-10/12">
        <h1 className="text-6xl text-gray-400 pb-3">Saved Posts</h1>
          <UserContextProvider>
            {savedPost?.length>0&&(
              savedPost.map(eachSavePost=>(
                <div>
                  <PostCard {...eachSavePost}/>
                </div>
              ))
            )}
          </UserContextProvider>
        </div>
    </div>
    );
}