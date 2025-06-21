import { useState ,useEffect} from "react";
import axios from "axios";
interface FeedbackFormProps {
    name: string;
    email: string;
}

export default function FeedbackForm({ name, email }: FeedbackFormProps) {
    let url = import.meta.env.VITE_BASE_URL
    const [message,setmessage] = useState<string>("")
    const [showPopup, setShowPopup] = useState(false);
    const [PopupMessage,setPopupMessage] =  useState("")

    // Hide popup automatically after 2 seconds
   
    useEffect(() => {
        if (showPopup) {
            const timer = setTimeout(() => setShowPopup(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [showPopup]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${url}/send-feedback`, {
                name,
                email,
                message,
            });
            if (response.data && response.data.success === true) {
                setPopupMessage("Feedback sent successfully!");
                setShowPopup(true);
            } else {
                setPopupMessage("Failed to send feedback. Please try again.");
                setShowPopup(true);
            }
        } catch (error) {
            // handle error if needed
        }
    };

    return (
        <div className="w-screen">
            <div className="flex flex-col justify-center items-center">
                <form onSubmit={handleSubmit} className="flex flex-col mt-15">
                    <label className="p-2 text-2xl text-white">Name :</label>
                    <label className="p-2 rounded-2xl text-2xl text-white">
                        <input
                            className="w-xl border-2 rounded-2xl border-lime-200 hover:border-lime-500 p-2 text-white"
                            type="text"
                            value={name}
                            readOnly
                        />
                    </label>
                    <label className="p-2 text-2xl text-white">Email :</label>
                    <label className="p-2 text-2xl text-white">
                        <input
                            className="w-xl border-2 rounded-2xl border-lime-200 hover:border-lime-500 p-2 text-white"
                            type="email"
                            value={email}
                            readOnly
                        />
                    </label>
                    <label className="p-2 rounded-2xl text-2xl text-white">Feedback :</label>
                    <label className="p-2 rounded-2xl text-2xl text-white">
                        <textarea
                            className="w-xl border-2 rounded-2xl h-40 border-lime-200 hover:border-lime-500 p-2 resize-none text-white"
                            value={message}
                            onChange={e => setmessage(e.target.value)}
                            style={{ minHeight: "10rem", overflow: "hidden" }}
                        />
                    </label>
                    <button
                        className="p-3 ml-2 mt-3 w-xl cursor-pointer rounded-2xl bg-lime-300 hover:bg-lime-500 text-black flex items-center justify-center"
                        type="submit"
                    >
                       
                        Send
                    </button>
                    {showPopup && (
                        <div className="fixed bottom-6 right-6 flex items-end justify-end z-50">
                            <div className="bg-white rounded-xl shadow-lg p-6 min-w-[300px] flex flex-col items-center">
                                <span className="text-lg text-black mb-4">{PopupMessage}</span>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
