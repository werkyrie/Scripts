"use client"

import { AuthWrapper } from "../components/auth-wrapper"
import ChatScriptsApp from "../components/chat-scripts-app"

export default function Page() {
  return (
    <AuthWrapper>
      <ChatScriptsApp />
    </AuthWrapper>
  )
}
