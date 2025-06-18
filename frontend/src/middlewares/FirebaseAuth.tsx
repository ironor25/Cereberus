// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import axios from "axios";


const firebaseConfig = {
  apiKey: "AIzaSyBbqyilRUS2wc9HXQsAiaEeIKo4Q5w7jt8",
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

export const signInWithGoogle = async (setdetails: (user: any) => void) => {
    try {
        let uid=''
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log(user)
     
        const user_details = await axios.get('http://127.0.0.1:3000/get-user', { params: { email: user.email } })
        console.log(user_details.data.email)
        if ( user_details.data.email == user.email){
                uid  = user_details.data.UID
                console.log(uid)
                setdetails({
                    name: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    UID: uid
                })
        }
        else{
                for(let i = 0; i < 2; i++) {
                uid += characters.charAt(Math.floor(Math.random() * charactersLength)) + Math.floor(Math.random() * charactersLength);
                }

                setdetails({
                    name: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    UID: uid
                });
                }
                
                await axios.post('http://127.0.0.1:3000/add-user', {
                    name: user.displayName,
                    email: user.email,
                    UID: uid
                } )

    } catch (error: any) {
        console.log(error.code);
    }
    
};

interface GoogleAuthProps {
    details: any;
    setdetails: (user: any) => void;
}

function GoogleAuth({ details, setdetails }: GoogleAuthProps) {
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
                <span className="text-white font-semibold">{details.name}</span>
                <span className="text-white font-semibold">{details.UID}</span>
                <button
                    className="ml-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-2xl text-sm"
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
            className='bg-gray-500 hover:bg-sky-500 focus:outline-2 text-white rounded-3xl p-2 w-30 border-2 cursor-pointer'
            onClick={() => signInWithGoogle(setdetails)}
        >
            Login
        </button>
    );
}


export default GoogleAuth;

