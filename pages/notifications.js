import Avatar from "@/components/Avatar";
import NavigationCard from "@/components/NavigationCard";
import NotificationUser from "@/components/NotificationUser";
import Card from "@/components/card";
import Link from "next/link";

export default function notifications(){
    return(
        <div className="flex max-w-4xl mx-auto gap-6 mt-4">
            <div className=" w-4/12">
                <NavigationCard/>
            </div>
            <div className="w-10/12">
                <h1 className="text-6xl text-gray-400 pb-3">Notifications</h1>

                <Card>
                    <div className="-mx-4 ">
                        <NotificationUser/>
                        <NotificationUser/>
                        <NotificationUser/>
                    </div>
                </Card>
            </div>
        </div>
    )
}