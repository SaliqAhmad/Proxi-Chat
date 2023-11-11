import { useState } from "react";
import { handleUserSignUp } from "../backend/handleUser";
import { useGeolocated } from "react-geolocated";
import { Link, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { LocationError } from "./LocationError";

export const SignUp = () => {
    const [fullName, setFullName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [signing, setSigning] = useState<boolean>(false);

    const navigate = useNavigate();

    const { coords, isGeolocationAvailable, isGeolocationEnabled } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: false,
            },
            userDecisionTimeout: 5000,
        });

    if (!isGeolocationAvailable) {
        return <div>Your browser does not support Geolocation</div>;
    }

    if (!isGeolocationEnabled) {
        return (
            <LocationError />
        );
    }

    if (!coords) {
        return <div>Getting the location data&hellip; </div>;
    }

    return (

        <div className="h-screen flex bg-gradient-to-t from-[#202C32] to-[#101619]">
            <Toaster />
            <div className="hidden lg:flex w-1/2 justify-center items-center">
                <div>
                    <img src="/src/assets/SignUp.svg" alt="..." />
                </div>
            </div>
            <div className=" w-full flex lg:w-1/2 justify-center items-center">
                <form onSubmit={(e) => {
                    handleUserSignUp(email, password, fullName, coords.latitude, coords.longitude, e).then((res) => {
                        if (res == true) {
                            setSigning(true);
                            setTimeout(() => {
                                navigate('/signin');
                            }
                                , 1000);
                        }
                    });
                }
                }
                >
                    <h1 className="font-bold text-4xl text-center mb-12" style={{ fontFamily: "Audiowide" }}>WELCOME TO PROXI-CHAT</h1>
                    <div className="flex justify-center py-2 px-3">
                        <input type="text" placeholder="Full Name" className="input bg-transparent rounded-full input-bordered input-lg" value={fullName} onChange={(e) => setFullName(e.currentTarget.value)} />
                    </div>
                    <div className="flex justify-center py-2 px-3 mb-4">
                        <input type="email" placeholder="Email" className="input bg-transparent rounded-full input-bordered input-lg" value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
                    </div>
                    <div className="flex justify-center py-2 px-3">
                        <input type="password" placeholder="Password" className="input bg-transparent rounded-full input-bordered input-lg" value={password} onChange={(e) => setPassword(e.currentTarget.value)} />
                    </div>
                    <div className="flex py-2 px-3 justify-center">
                        <button type="submit" className="w-40 btn btn-outline btn-lg rounded-full mt-4 mb-2">{signing ? <span className="loading loading-dots loading-lg"></span> : "SIGN UP"}</button>
                    </div>
                    <div className="flex justify-center py-2 px-3">
                        <p className="text-gray-500">Already have an account? <Link to="/signin" className="text-blue-500">Sign In</Link></p>
                    </div>
                </form>
            </div>
        </div>
    )
}