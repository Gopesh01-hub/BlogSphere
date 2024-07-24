'use client';
import Link from 'next/link'; 
import { useContext, useEffect, useState } from 'react';
import Avatar from "./Avatar";
import Card from "./card";
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import ReactTimeAgo from 'react-time-ago';
import { userContext, UserContextProvider } from '@/context/context';



export default function PostCard({id,content,created_at,photos,profiles:authProfile}){
  const [dropdown, setDropdown] = useState(false);
  const dropdownToggle = () => {setDropdown(!dropdown);}
  const createdAtTimestamp = new Date(created_at).getTime();
  const isValidDate = !isNaN(createdAtTimestamp);
  const myProfile=useContext(userContext);
  const supabase=useSupabaseClient();
  const [likes,setLikes]=useState();
  const [commentText,setCommentText]=useState();
  const [comment,setComment]=useState();
  const [isSaved,setIsSaved]=useState(false);
  useEffect(()=>{
    if(!id||!myProfile){
      return;
    }
    fetctLike();
    fetchComment();
    fetchSavedPost();
  },[id,myProfile]);

  function fetchSavedPost(){

    supabase.from('saved_post').select().eq('user_id',myProfile?.id).eq('post_id',id).then((result)=>{
      if(result.data?.length>0){
        setIsSaved(true);
      }
      else{
        setIsSaved(false);
      }
      
    })
  }

  function fetctLike(){
    supabase.from('likes').select().eq('post_id',id).then(result=>{setLikes(result.data);});
  }

  const isLikedByMe =!!likes?.find(like=>like.user_id===myProfile.id);
  
  function likePost(){
    
    if(isLikedByMe){
      supabase.from('likes').delete().eq('post_id',id).eq('user_id',myProfile.id).then(()=>{fetctLike()});
      return;
    }
    supabase.from('likes').insert({
      post_id:id,
      user_id:myProfile.id,
      
    }).then(()=>{fetctLike()});
  }


  function submitComment(ev){
    if(commentText===null||commentText===''||commentText===""){
      return;
    }
    
    ev.preventDefault();
    supabase.from('post').insert({
      parent:id,
      auther:myProfile.id,
      content:commentText
    }).then((result)=>{
      fetchComment();
      setCommentText('');
    })
  }

  function fetchComment(){
    supabase.from('post').select('*,profiles(*)').eq('parent',id).then((result)=>{setComment(result.data)})
  }

  function toggleSave(){
    if(!isSaved){
      supabase.from('saved_post').insert({
        user_id:myProfile?.id,
        post_id:id,
      }).then(()=>{setIsSaved(false); fetchSavedPost();})
    }
    else{
      supabase.from('saved_post').delete().eq('user_id',myProfile?.id).eq('post_id',id).then((result)=>{setIsSaved(false);fetchSavedPost();})
    }
  }
  
  function sharePost(){
    const postUrl=`localhost:3000/${id}/sharePosttest`
    // if(navigator.share){
    //   navigator.share({
    //       title:'title',
    //       url:postUrl,
    //       text: content,
    //   })
    // }else{
      navigator.clipboard.writeText(postUrl);
      alert(`${postUrl} is copied suceessfully`)
    //}

  }
  
    return (
        <Card>
          <div className="flex gap-4 ">
            <div>
              <Link href={"/profile/"+authProfile?.id}>
                <Avatar url={authProfile?.avatar}/>
              </Link>     
            </div>
            <div className="leading-5 grow">
              <p><Link href={"/profile/"+authProfile?.id} className="hover:underline font-semibold">{authProfile?.name}</Link> shared a <a className=" text-socialBlue">Album</a></p>
              {isValidDate?<ReactTimeAgo date={createdAtTimestamp}/>:<span>Invalid date</span>}
            </div>
            
            <button onClick={dropdownToggle} className=" text-gray-500 relative mb-3 ">
              <svg  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              <div  className='absolute -mx-48 shadow-md shadow-gray-300 w-56 bg-white rounded-lg z-10'>
                <div style={{display: dropdown ? 'block' : 'none' }}>
                  <div className='-mr-16'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  </div>
                  <div className='mx-2 my-1'>
                  <span onClick={toggleSave} className=' flex w-full my-1 gap-2 py-1 px-1 hover:scale-105  hover:shadow-md hover:bg-socialBlue hover:text-white   rounded-md  transition-all' >
                    {!isSaved&&(
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mt-0.5 ">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                      </svg>
                    )}
                    {isSaved&&(
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m3 3 1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 0 1 1.743-1.342 48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664 19.5 19.5" />
                    </svg>
                    
                    )}
                    
                    <div >
                      {isSaved?'Un save post':'Save post'}
                    </div>
                  </span>
                  <div className=' flex gap-2 my-1 py-1 px-1 hover:scale-105 hover:shadow-md hover:bg-socialBlue hover:text-white   rounded-md  transition-all'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
                    </svg>
                    Turn notification
                  </div>
                  <div className=' flex gap-2 my-1 py-1 px-1 hover:scale-105 hover:shadow-md hover:bg-socialBlue hover:text-white   rounded-md  transition-all'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                    Hide post
                  </div>
                  <div className='flex gap-2 my-1 py-1 px-1 hover:scale-105 hover:shadow-md hover:bg-socialBlue hover:text-white   rounded-md  transition-all'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                    Delete post
                  </div>
                  <div className=' flex gap-2 my-1 py-1 px-1 hover:scale-105 hover:shadow-md hover:bg-socialBlue hover:text-white   rounded-md  transition-all'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                    Report
                  </div>
                </div>
                </div>
            </div>
            </button>
            
            
          </div>
          <div className=" my-3 text-sm">
            <p>{content} </p>
            {photos?.length>0&&(
              <div className='flex gap-2 flex-wrap'>
                {photos.map(photo=>(
                  <div key={photo}>
                    <img src={photo} className='rounded-md h-48 fill-transparen mt-3'/>
                  </div>
                ))}
              </div>
            )}
            {/* <div className=" rounded-md overflow-hidden fill-transparen mt-3">
              <img className=" rounded-md" src="https://media.istockphoto.com/id/1707972776/photo/santorini-island-greece.webp?b=1&s=170667a&w=0&k=20&c=eMUnhNL0LeyW6eOxtqaL0qJrLWdjgkY7_8L3Xnjv0s0="></img>
            </div> */}
          </div>

          <div className="flex gap-5">
            <button className="flex items-center gap-1" onClick={likePost} >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={"size-5 mt-0.5 "+(isLikedByMe?'fill-red-500 text-red-500':'')}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
              {likes?.length}
            </button>
            <button className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mt-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>
              {comment?.length}
            </button>
            <button className="flex items-center gap-1" onClick={sharePost}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mt-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
            </svg>
              72
            </button>
          </div>

          <div className="flex gap-3 mt-2">
            <Avatar url={myProfile?.avatar}/>
            
            <div className="w-full relative ">
              <form onSubmit={submitComment} >
              <input className=" border h-11 px-3 py-2 w-full rounded-3xl overflow-hiddenborder" placeholder='Comment' value={commentText} onChange={(ev)=>{setCommentText(ev.target.value)}}></input>
              <div className="absolute  top-2 right-2 ">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              </div>
              </form>
            </div>
              
            
          </div>
          
          {comment?.length>0 && (
              <div >
                {comment.map(eachComment=>(
                  <div key={eachComment.created_at} className='flex items-center gap-2 mt-3'>
                    <Avatar  url={eachComment?.profiles.avatar}/>
                    <div className='bg-gray-200 rounded-3xl px-4 py-2'>
                      <div className='flex gap-2 justify-between text-sm text-gray-500'>
                        <Link href={'/profile/'+ eachComment?.profiles.id}  className=' text-sm font-bold  hover:underline h-1/4'>{eachComment?.profiles.name}  </Link>
                        {isValidDate?<ReactTimeAgo timeStyle={'twitter'} date={(new Date(eachComment.created_at)).getTime()}/>:<span>Invalid date</span>}
                      </div>
                      
                      <p >{eachComment.content} </p>
                    </div>
                    
                  </div>
                ))}
              </div>
            )}
        </Card>
         
    );
}