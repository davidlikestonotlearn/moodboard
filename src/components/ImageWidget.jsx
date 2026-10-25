import { WidgetFrame } from './WidgetFrame';

export function ImageWidget({ src, alt, position = 'center', className = '', style, isEditing = false, onLongPress, onDelete, onMove }) {
  return (
    <WidgetFrame as="figure" className={`image-widget ${className}`} style={style} isEditing={isEditing} onLongPress={onLongPress} onDelete={onDelete} onMove={onMove} deleteLabel={alt}>
      <img src={src} alt={alt} style={{ objectPosition: position }} draggable="false" />
    </WidgetFrame>
  );
}
