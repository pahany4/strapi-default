import Nav from "./nav"
import {useFingerprint} from "../hooks/useFingerprint";
import {useTokenUpdate} from "../hooks/useTokenUpdate";
import {useSelector} from "react-redux";

const Layout = ({children, categories}) => {
    const user = useSelector(state => state.user)
    useFingerprint()
    useTokenUpdate()
    return (
        <>
            <Nav categories={categories}/>
            <div style={{textAlign: 'center'}}>
                {user.last_name} {user.first_name}
            </div>
            {children}
        </>
    )
}

export default Layout
