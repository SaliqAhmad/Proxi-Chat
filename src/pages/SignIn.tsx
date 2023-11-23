import { FormEvent, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { handleUserSignIn } from "../backend/handleUser";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useGeolocated } from "react-geolocated";
import { useMutation, useQueryClient } from "react-query";
import { LocationError } from "./LocationError";

export const SignIn = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [signing, setSigning] = useState<boolean>(false);

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
    });

  const { mutate, isSuccess } = useMutation({
    mutationKey: 'user',
    mutationFn: (e: FormEvent) => handleUserSignIn(email, password, coords?.latitude, coords?.longitude, e),
    onSuccess: (res) => {
      if (res) {
        setSigning(true);
        setTimeout(() => {
          navigate('/chat');
        }
          , 1000);
      }
    },
  });

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries('user');
    }
  }
    , [isSuccess, queryClient]);

  if (!isGeolocationAvailable) {
    return (
      <LocationError />
    )
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
      <div className=" w-full flex lg:w-1/2 justify-center items-center">
        <form onSubmit={async (e) => { mutate(e) }
        }
        >
          <h1 className="font-bold text-4xl text-center mb-12" style={{ fontFamily: "Audiowide" }}>WELCOME TO PROXI-CHAT</h1>
          <div className="flex justify-center py-2 px-3 mb-4">
            <input type="email" placeholder="Email" className="input bg-transparent rounded-full input-bordered input-lg" value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
          </div>
          <div className="flex justify-center py-2 px-3">
            <input type="password" placeholder="Password" className="input bg-transparent rounded-full input-bordered input-lg" value={password} onChange={(e) => setPassword(e.currentTarget.value)} />
          </div>
          <div className="flex py-2 px-3 justify-center">
            <button type="submit" className="w-40 btn btn-outline btn-lg rounded-full mt-4 mb-2">{signing ? <span className="loading loading-dots loading-lg"></span> : "SIGN IN"}</button>
          </div>
          <div className="flex justify-center py-2 px-3">
            <p className="text-gray-500">Don't have an account? <Link to="/" className="text-blue-500">Sign Up</Link></p>
          </div>
        </form>
      </div>
      <div className="hidden lg:flex w-1/2 justify-center items-center">
        <div>
          <img src="/src/assets/SignIn.svg" alt="..." />
        </div>
      </div>
    </div>
  )
}