import React from 'react'

export default function VideoBackground() {
  // Local path so clients can place their own stock video (e.g. from Unsplash or Pexels)
  const localVideoUrl = "/assets/hero_background.mp4"
  // Streaming fallback gold luxury waves loop
  const fallbackVideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-liquid-gold-swirling-background-41566-large.mp4"
  // High quality Unsplash dark slate/gold aesthetic cover photo as final fallback
  const fallbackImage = "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1920"

  return (
    <div style={styles.container}>
      <video
        autoPlay
        loop
        muted
        playsInline
        style={styles.video}
        poster={fallbackImage}
      >
        <source src={localVideoUrl} type="video/mp4" />
        <source src={fallbackVideoUrl} type="video/mp4" />
      </video>
      {/* Premium dark gradient overlay ensuring extreme readability for overlaying white text */}
      <div style={styles.overlay}></div>
    </div>
  )
}

const styles = {
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    zIndex: 1,
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    // High-contrast gradient overlay to ensure text is fully readable under dynamic background videos
    background: 'linear-gradient(180deg, rgba(7, 7, 8, 0.45) 0%, rgba(7, 7, 8, 0.85) 100%)',
    backgroundColor: 'rgba(7, 7, 8, 0.4)', // tint overlay
  }
}
