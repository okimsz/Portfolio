export default function PhotoGallery({ photos, compact = false }) {
  return <div className={compact ? 'photo-gallery compact-gallery' : 'photo-gallery'}>
    {photos.map(photo => <figure key={photo.src}>
      <a href={photo.src} target="_blank" rel="noopener noreferrer" aria-label={`${photo.alt} — open full photo in a new tab`}>
        <img src={photo.src} alt={photo.alt} loading="lazy" width={photo.width} height={photo.height} />
      </a>
      <figcaption>{photo.caption}</figcaption>
    </figure>)}
  </div>;
}
