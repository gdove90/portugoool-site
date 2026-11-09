import type { ReactNode } from "react";
import { Strike } from "./Brand";

export default function HelpPageHeading({ title, children }: { title: string; children: ReactNode }) {
  return <header className="help-heading">
    <p className="help-eyebrow"><Strike /> Help</p>
    <h1>{title}</h1>
    <p className="help-lead">{children}</p>
  </header>;
}
