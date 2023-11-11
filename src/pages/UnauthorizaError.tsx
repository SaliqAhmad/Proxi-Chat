export const UnauthorizaError = () => {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center">
            <img src="/src/assets/SignIn.svg" alt="..." />
            <div className="flex flex-col items-center justify-center">
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-600 mt-12">You are not signed in</p>
                <p className="md:text-lg xl:text-xl text-gray-500 mt-6">Please sign in to continue.</p>
            </div>
        </div>
    )
}