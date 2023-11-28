// import { Session } from "@supabase/supabase-js"
import { getUserSession, handleUserSignOut } from "../backend/handleUser"
import { useMutation, useQuery } from "react-query"
import { NavLink, useNavigate } from "react-router-dom"
import { UnauthorizaError } from "../pages/UnauthorizaError"

// type Props = {
//     userSession: Session
// }

export const TopBar = () => {
    const navigate = useNavigate();
    const { data: userSession } = useQuery({
        queryFn: getUserSession,
        queryKey: ["userSession"],
    });
    const { mutate } = useMutation({
        mutationFn: handleUserSignOut,
        mutationKey: ["handleUserSignOut"],
        onSuccess: () => {
            navigate("/signin");
        }
    });
    if (!userSession) {
        return <UnauthorizaError />;
    }

    return (
        <>

            <div className="navbar fixed mt-10">
                <div className="w-full justify-center">
                    <NavLink to="/chat" className="btn btn-ghost text-xl">CHAT</NavLink>
                    <NavLink to="/groupchat" className="btn btn-ghost text-xl">GROUP CHAT</NavLink>
                    <NavLink to="/mychats" className="btn btn-ghost text-xl">MY CHATS</NavLink>
                </div>
                <button className="btn btn-ghost text-xl" onClick={() => mutate()}>LOG-OUT<div className="badge badge-outline">{userSession.user.user_metadata.name}</div></button>
            </div>
        </>
    )
}