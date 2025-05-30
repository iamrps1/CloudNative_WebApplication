"use client"

import dynamic from "next/dynamic"
import Loading from "../ui/loading"

import { CirclePlay } from "lucide-react"

const ReactPlayer = dynamic(() => import("react-player").then((mod) => mod.default), {
    ssr: false,
    loading: () => (
        <div className="flex h-full items-center justify-center">
            <Loading size="size-14" />
        </div>
    ),
})

const VideoPlayer = ({ url }) => {
    return (
        <div className="mx-auto block aspect-video max-w-[1000px] overflow-hidden rounded-lg object-cover shadow-xl">
            <ReactPlayer
                className="overflow-hidden rounded-lg object-cover [&>video]:rounded-lg"
                url={url}
                controls
                playing={false}
                //light="/videos/thumbnail-video.jpg"
                playIcon={
                    <CirclePlay className="z-10 rounded-full text-5xl text-white/80 lg:text-7xl" />
                }
                width="100%"
                height="100%"
            />
        </div>
    )
}

export default VideoPlayer
