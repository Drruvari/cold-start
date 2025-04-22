import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { ClerkProvider } from '@clerk/clerk-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from './components/ui/sonner.tsx'

const queryClient = new QueryClient()

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) throw new Error('Missing Clerk Key')

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ClerkProvider
            publishableKey={PUBLISHABLE_KEY}
            signUpFallbackRedirectUrl="/upload"
            signInFallbackRedirectUrl="/upload"
        >
            <BrowserRouter>
                <QueryClientProvider client={queryClient}>
                    <Toaster />
                    <App />
                </QueryClientProvider>
            </BrowserRouter>
        </ClerkProvider>
    </React.StrictMode>
)
