import React from 'react'

const Loading = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-white">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-xl font-medium">Loading...</p>
            </div>
        </div>
    )
}

export default Loading
