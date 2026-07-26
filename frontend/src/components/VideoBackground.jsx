import React from 'react'

export default function VideoBackground() {
  // Free stock video of elegant dark luxury background waves / abstract metal flow
  const videoUrl = "https://assets.mixkit.co/videos/preview/mixkit-liquid-gold-swirling-background-41566-large.mp4"
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
        <source src={videoUrl} type="video/mp4" />
      </video>
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
    zIndex: -1,
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
    background: 'radial-gradient(circle, rgba(7,7,8,0.4) 0%, rgba(7,7,8,0.95) 90%)',
  }
}
