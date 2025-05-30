import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react"
import { ReactNode } from "react"

interface ProtectedRouteProps {
    children: ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    return (
        <>
            <SignedIn>{children}</SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
    )
}
