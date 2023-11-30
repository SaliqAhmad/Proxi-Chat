import { getUserSession, handleUserSignOut } from "../backend/handleUser"
import { useMutation, useQuery } from "react-query"
import { NavLink, useNavigate } from "react-router-dom"
import { UnauthorizaError } from "../pages/UnauthorizaError"

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
            <div className="navbar fixed mt-5">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                        </div>
                        <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 bg-info/10 backdrop-blur-xl shadow-2xl rounded-box w-52">
                            <NavLink to="/chat" className="btn btn-ghost text-md">CHAT</NavLink>
                            <NavLink to="/groupchat" className="btn btn-ghost text-md">GROUP CHAT</NavLink>
                            <NavLink to="/mychats" className="btn btn-ghost text-md">MY CHATS</NavLink>
                        </ul>
                    </div>
                    <a className="btn btn-ghost hidden lg:block text-xl">Proxi</a>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        <NavLink to="/chat" className="btn btn-ghost text-xl">CHAT</NavLink>
                        <NavLink to="/groupchat" className="btn btn-ghost text-xl">GROUP CHAT</NavLink>
                        <NavLink to="/mychats" className="btn btn-ghost text-xl">MY CHATS</NavLink>
                    </ul>
                </div>
                <div className="navbar-end">
                    <button className="btn btn-ghost text-xl" onClick={() => mutate()}>LOG-OUT<div className="badge badge-outline">{userSession.user.user_metadata.name}</div></button>
                </div>
            </div>

        </>
    )
}