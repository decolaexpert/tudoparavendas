import { getCurrentMember, hasActiveAccess } from "@/lib/member";
import { Header } from "@/components/Header";
import { NoAccess } from "@/components/NoAccess";
import { VideoPromptForm } from "@/components/VideoPromptForm";

export default async function VideoPage() {
  const { email, member } = await getCurrentMember();

  if (!email) return null; // middleware já redireciona para /login

  if (!hasActiveAccess(member)) {
    return (
      <>
        <Header />
        <NoAccess email={email} />
      </>
    );
  }

  return (
    <>
      <Header />
      <VideoPromptForm />
    </>
  );
}
