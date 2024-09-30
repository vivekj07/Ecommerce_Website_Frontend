import { ReactElement } from "react"
import { Navigate, Outlet } from "react-router-dom"

type Props = {
    isAuthenticated: boolean,
    admin?: boolean,
    adminOnly?: boolean,
    redirect?: string,
    children?: ReactElement,

}

const ProtectedRoute = ({
    isAuthenticated,
    admin,
    adminOnly,
    redirect = "/",
    children
}: Props) => {

    if (!isAuthenticated) return <Navigate to={redirect} />;

    if (adminOnly && !admin) return <Navigate to={redirect} />;

    return (
        children ? children : <Outlet />
    )
}

export default ProtectedRoute