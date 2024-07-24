import Avatar from "./Avatar";

export default function FriendInfo(){
    return(
        <div className="flex items-center gap-2">
                  <div className="mt-2">
                    <Avatar/>
                  </div>  
                  <div>
                    <h3 className="font-bold text-lg">John due</h3>
                    <p className="text-gray-400 leading-3">5 mutual friend</p>
                  </div>
                </div>
    );
}