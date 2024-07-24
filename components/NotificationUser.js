import Link from "next/link";
import Avatar from "./Avatar";

export default function NotificationUser(){
    return(
        <div className="flex items-center gap-2 p-3 border-b border-gray-400 px-5">
            <Link href={"/profile"}>
                <Avatar/>
            </Link>
            <p>
                <Link href={"/profile"} className=" font-semibold  hover:underline underline-offset-4">John due</Link> liked <Link href={""} className="text-socialBlue hover:underline underline-offset-4">your photo</Link>
            </p>
    </div>
    );
}