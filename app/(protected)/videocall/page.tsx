"use client"
import Link from "next/link";
import { useState } from "react";
import { Navbar } from "../_components/navbar";

const VideoCall = () => {
    const [roomID, setRoomID] = useState('');

    return (
        <div className="flex h-screen">
            <div className="w-3/4 flex items-center flex-col justify-center">
                <h1 className="text-[32px] mb-[1rem] md:text-[35px] lg:text-[50px] text-center font-bold leading-[4rem] text-black">
                    Connect With Your Patient
                </h1>
                <input 
                    type="text" 
                    placeholder="Enter room ID" 
                    className="px-8 py-3 w-[50%] rounded-lg outline-none bg-secondary" 
                    onChange={(e) => setRoomID(e.target.value)}
                />
                <Link href={`room/${roomID}`}>
                    <button className="px-8 py-2 rounded-lg bg-primary text-primary-foreground shadow hover:bg-primary/90 text-white mt-[1rem]">
                        Join
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default VideoCall;