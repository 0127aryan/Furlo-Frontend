/**
 * Compresses an image file in the browser using HTML5 Canvas.
 * Resizes images exceeding maxDimension and compresses to webp/jpeg format.
 */
export async function compressImage(
  file: File,
  maxDimension = 1200,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = (err) => reject(err)
    reader.onload = (event) => {
      const img = new Image()
      img.onerror = (err) => reject(err)
      img.onload = () => {
        let width = img.width
        let height = img.height

        // Calculate aspect-ratio-preserved dimensions
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width)
            width = maxDimension
          } else {
            width = Math.round((width * maxDimension) / height)
            height = maxDimension
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          return resolve(event.target?.result as string)
        }

        ctx.drawImage(img, 0, 0, width, height)

        // Prefer webp if supported, fallback to jpeg
        let dataUrl = canvas.toDataURL('image/webp', quality)

        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', quality)
        }

        resolve(dataUrl)
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  })
}
