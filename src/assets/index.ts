// Written by GoodBuild from the files the user uploaded. Don't edit: import from it.
// Use the src paths as they are (also fine as literal strings, e.g. in public/index.html).
export interface Asset {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export const assets = {
  image: { src: "/assets/image.png", width: 490, height: 702, alt: "image" },
} satisfies Record<string, Asset>;
