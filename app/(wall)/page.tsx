import RedirectHandler from "./redirect-handler.component"
import LandingComponent from "./landing/LandingComponent"

// cache revalidation - 30 minutes
export const revalidate = 1800

export default async function Home() {
  return (
    <>
      <RedirectHandler />
      <LandingComponent />
    </>
  )
}
