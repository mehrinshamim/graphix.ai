declare module 'dom-to-image-more' {
  export interface DomToImageOptions {
    width?: number;
    height?: number;
    style?: object;
    quality?: number;
    cacheBust?: boolean;
    [key: string]: any;
  }

  export default {
    toBlob: (node: HTMLElement, options?: DomToImageOptions) => Promise<Blob>,
    toPng: (node: HTMLElement, options?: DomToImageOptions) => Promise<string>,
    toJpeg: (node: HTMLElement, options?: DomToImageOptions) => Promise<string>,
    toSvg: (node: HTMLElement, options?: DomToImageOptions) => Promise<string>
  };
}
