import Navbar from "../components/Navbar/Navbar";
import "./BaseLayout.css"

const BaseLayout = ({children}) => {
    return (
        <>
            <Navbar />
            <main>{children}</main>
        </>
    )
}

export default BaseLayout;