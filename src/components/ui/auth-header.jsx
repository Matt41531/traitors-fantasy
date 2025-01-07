import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'

function AuthHeader() {
  return (
    <header>
      <h1 className='mb-3'>Traitors Fantasy</h1>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  )
}

export default AuthHeader;