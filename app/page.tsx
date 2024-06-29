import SignIn from "@/components/own/login/loginForm";
import SessionProviderComp from "@/components/own/sessionProviderComp";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>HELLO</h1>
      <SessionProviderComp>
        <SignIn />
      </SessionProviderComp>
    </main>
  );
}
