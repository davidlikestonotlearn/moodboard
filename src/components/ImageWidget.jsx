export function ImageWidget({ src, alt, position = 'center', className = '', style }) {
  return (
    <figure className={`image-widget ${className}`} style={style}>
      <img src={src} alt={alt} style={{ objectPosition: position }} draggable="false" />
    </figure>
  );
}
