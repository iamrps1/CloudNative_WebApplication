import Image from "next/image"

const MainDashboard = () => {
    return <div>Main Dashboard
        <div>
            <Image src='/dashboard.jpeg' className="w-full" width={500} height={300} alt="Main Dashboard" />
        </div>
    </div>
}

export default MainDashboard
