import VideoPlayer from "@/components/sections/video-player"

const TrainingPage = () => {
    return (
        <div>
            Training Page
            <div className="my-2">
                <VideoPlayer url="https://www.youtube.com/watch?v=m85SZRh9Swc&list=PLLOZumLvUu-UqLdmbdF7-wz6YGEn3VHFR&index=4" />
            </div>
            <div className="my-2">
                <VideoPlayer url="https://youtu.be/kSK84VA6w7U?si=IW4KfkCAPTT4xC-z" />
            </div>
        </div>
    )
}

export default TrainingPage
