export default function manifest() {
  return {
    name: "Know actual selling prices & user reviews - Projects across Pune",
    short_name: "Propviewz",
    description: "Har property ki sacchai",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/apple-icon.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
