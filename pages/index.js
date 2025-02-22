import NavigationCard from "@/components/NavigationCard";
import PostCard from "@/components/PostCard";
import PostFormCard from "@/components/PostFormCard";
import Login from "./login";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { userContext } from "@/context/context";

export default function Home() {
  const supabase=useSupabaseClient();
  const [posts,setPosts]=useState([]);
  const [profile,setprofile]=useState(null);

  const  session=useSession();

  useEffect(()=>{
    fatchPost()
  },[supabase])
  
  useEffect(()=>{
    
    if(!session?.user?.id){
      return;
    };
    supabase.from('profiles')
        .select()
        .eq("id",session.user.id)
        .then(result=> {
            if(result?.data.length){
                setprofile(result.data[0]);
            }
            // console.log(result.data[0]);
        });
  },[session?.user?.id,supabase]
);

  if(!session){
    return (<Login/>)
  }

  function fatchPost(){
    supabase.from('post')
    .select('id,content,created_at,photos,profiles(id,avatar,name)')
    .is('parent',null)
    .order('created_at',{ascending:false})
    .then((res)=>{
      //  console.log(res.data);
      setPosts(res.data)
    })
  }

  
  // console.log(session);
  return (
    <div className="md:flex custom:max-w-4xl custom:mx-auto gap-6 mt-4 mx-2">
      <div className=" w-1/4">
        <NavigationCard/>
      </div>
      <div className="md:w-3/4 w-full">
        <userContext.Provider value={profile}>
          <PostFormCard onPost={fatchPost}/>
          {posts.length>0 && posts.map(post=>(
            //  console.log(post),
            <PostCard key={post.created_at}  {...post} />
          ))}
        </userContext.Provider>
      </div>
    </div>
  );
}
