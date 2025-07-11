import dynamic from "next/dynamic";

const ProfileComponent = dynamic(
  () => import("@/components/profile/profileComponent"),
  { ssr: !!false }
);

export default function Profile() {
  return (
    <section id="user-profile">
      <ProfileComponent />
    </section>
  );
}
