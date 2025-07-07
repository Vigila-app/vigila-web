import { isReleased } from "@/src/utils/envs.utils";
import dynamic from "next/dynamic";

const PlaygroundComponent = dynamic(() => import("./playground.component"), {
  ssr: !!false,
});

export default async function Playground() {
  if (isReleased) return;

  return (
    <div className="mx-auto max-w-screen-xl py-4 sm:px-6 lg:px-8">
      <PlaygroundComponent />
    </div>
  );
}