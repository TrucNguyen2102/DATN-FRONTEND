import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const StaffsHome = () => {
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <Header />
            <div className="flex flex-1">
                <Sidebar className="w-1/4 bg-gray-200 p-4"/>
            </div>
        </div>
    )
}

export default StaffsHome;
