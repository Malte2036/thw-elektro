import { inject } from "@vercel/analytics";
import FlowPage from "./FlowPage";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    inject();
  }, []);

  return <FlowPage />;
}
