import { Session } from "@supabase/supabase-js"
import { handleUserSignOut } from "../backend/handleUser"
import { useMutation } from "react-query"
import { NavLink, useNavigate } from "react-router-dom"

type Props = {
    userSession: Session
}

export const TopBar = (props: Props) => {
    const navigate = useNavigate();
    const { mutate } = useMutation({
        mutationFn: handleUserSignOut,
        mutationKey: ["handleUserSignOut"],
        onSuccess: () => {
            navigate("/signin");
        }
    });

    return (
        <>
            {props && (
                <div className="navbar fixed mt-10">
                    <div className="w-full justify-center">
                        <NavLink to="/chat" className="btn btn-ghost text-xl">CHAT</NavLink>
                        <NavLink to="/groupchat" className="btn btn-ghost text-xl">GROUP CHAT</NavLink>
                        <NavLink to="/mychats" className="btn btn-ghost text-xl">MY CHATS</NavLink>
                    </div>
                    <button className="btn btn-ghost text-xl" onClick={() => mutate()}>LOG-OUT<div className="badge badge-outline">{props.userSession.user.user_metadata.name}</div></button>
                </div>
            )}
        </>
    )
}