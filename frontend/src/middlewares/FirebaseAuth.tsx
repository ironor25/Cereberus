// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import axios from "axios";
import { useState } from "react";
import {userStore} from "../store/user/userStore"
import { setUID } from "../store/user/userSlice";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "get-feedback-781ae.firebaseapp.com",
  projectId: "get-feedback-781ae",
  storageBucket: "get-feedback-781ae.firebasestorage.app",
  messagingSenderId: "50037107467",
  appId: "1:50037107467:web:ed12d602274321ad28900e",
  measurementId: "G-CBVKJSZV5G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)

const provider = new GoogleAuthProvider();
const characters = 'abcdefghijklmnopqrstuvwxyz';
const charactersLength = characters.length;

export const signInWithGoogle = async (
    setdetails: (user: any) => void,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
    setLoading(true);
    try {
        let uid ="";
        const result = await signInWithPopup(auth, provider).catch((error) => {
            // If user closes the popup or cancels login, revert loading
            setLoading(false);
            throw error;
        });
        if (!result) return; // If popup was closed, exit
        const user = result.user;
        let url = import.meta.env.VITE_BASE_URL
        const user_details = await axios.get(`${url}/get-user`, { params: { email: user.email } });
        
        if (user_details.data.email == user.email) {
            uid = user_details.data.UID;
            userStore.dispatch(setUID(uid))
            setdetails({
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                UID: uid,
            });
        } 
        else {
            for (let i = 0; i < 2; i++) {
                uid += characters.charAt(Math.floor(Math.random() * charactersLength)) + Math.floor(Math.random() * charactersLength);
            }
            userStore.dispatch(setUID(uid))
            setdetails({
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                UID: uid,
            });

            await axios.post(`${url}/add-user`, {
            name: user.displayName,
            email: user.email,
            UID: uid,
        });

            await axios.post(`${url}/add_update_details`,{
                                
                uid: uid,
                mode: "add",
                fundtype: true,
                cash : 1000000
                

            })
        }

        
    } catch (error: any) {
        
    } finally {
        setLoading(false);
    }
};

interface GoogleAuthProps {
    details: any;
    setdetails: (user: any) => void;
}

function GoogleAuth({ details, setdetails }: GoogleAuthProps) {
    const [loading, setLoading] = useState(false);

    if (loading) {
        return (
            <div className="flex items-center gap-2">
                
<div role="status">
    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-lime-500 mt-2 mr-3" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className="sr-only">Loading...</span>
</div>

                {/* You can use a spinner icon here if you want */}
            </div>
        );
    }

    if (details && details.name) {
        return (
            <div className="flex items-center gap-2">
                {details.photoURL ? (
                    <img
                        src={details.photoURL}
                        alt="profile"
                        className="w-8 h-8 rounded-full border-2 border-white"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white" />
                )}
                <div className="flex flex-col pl-3">
                <span className="text-white">{details.name}</span>
                <span className="text-white">UID: {details.UID}</span>
                </div>
                <button
                    className="ml-2 p-3 w-30 bg-lime-300 hover:bg-lime-500 text-black rounded-3xl text-md font-medium cursor-pointer"
                    onClick={async () => {
                        const { signOut } = await import("firebase/auth");
                        await signOut(auth);
                        setdetails({});
                    }}
                >
                    Logout
                </button>
            </div>
        );
    }
    return (
        <button
            className='bg-lime-300 hover:bg-lime-500 focus:outline-2 text-black rounded-3xl p-2 w-30 border-2  cursor-pointer font-medium'
            onClick={() => signInWithGoogle(setdetails,setLoading)}
        >
            Login
        </button>
    );
}


export default GoogleAuth;

