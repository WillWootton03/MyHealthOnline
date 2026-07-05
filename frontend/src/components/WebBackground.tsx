import { type ReactNode } from "react";

type WebBackgroundProps = {
  children : ReactNode
}

export default function WebBackground({children} : WebBackgroundProps ) {
    return(
      <div
          className="min-h-screen w-full flex items-center justify-center relative overflow-hidden page-bg-light">
            {children}
       </div>
    );
}