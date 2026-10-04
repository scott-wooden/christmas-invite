import { event } from "@/config/event";

export default function Home() {
  return <main><h1>{event.title}</h1><p>The invitation is coming together.</p></main>;
}
