export const conferenceLogo = {
  src: '/brand/conference-logo.png',
  srcSet: [64,128,256,512,900].map(width => `/brand/conference-logo-${width}.webp ${width}w`).concat('/brand/conference-logo.png 1254w').join(', '),
  heroSizes: '(max-width:700px) 38vw, (max-width:1279px) 30vw, (max-width:1599px) 23vw, 368px',
}

export function ConferenceLogo({sizes, alt, priority = false}: {sizes:string; alt:string; priority?:boolean}) {
  return <img src={conferenceLogo.src} srcSet={conferenceLogo.srcSet} sizes={sizes}
    width="1254" height="1254" alt={alt} fetchPriority={priority ? 'high' : undefined}/>
}
