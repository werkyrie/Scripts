import { db } from "./firebase"
import { doc, updateDoc } from "firebase/firestore"

// Increase the maximum size for base64 storage from 100KB to 500KB
const MAX_BASE64_SIZE = 500 * 1024

/**
 * Stores an image using the most appropriate method
 * For images (<500KB): Converts to base64 and stores directly in Firestore
 * For larger images: Returns null (we'll use placeholder)
 */
export async function storeImage(file: File): Promise<string | null> {
  try {
    // Check if file is small enough for base64
    if (file.size <= MAX_BASE64_SIZE) {
      return await convertToBase64(file)
    }

    // For larger files, we'll try to compress first
    const compressedFile = await compressImage(file, 1200)

    // Check if compression made it small enough
    if (compressedFile.size <= MAX_BASE64_SIZE) {
      return await convertToBase64(compressedFile)
    }

    console.log("Image too large for base64 storage, even after compression")
    return null
  } catch (error) {
    console.error("Error storing image:", error)
    return null
  }
}

/**
 * Converts a file to base64 string
 */
function convertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

/**
 * Compresses an image to reduce size
 */
export function compressImage(file: File, maxWidth = 1200): Promise<File> {
  return new Promise((resolve) => {
    // For non-image files, don't compress
    if (!file.type.startsWith("image/")) {
      resolve(file)
      return
    }

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string

      img.onload = () => {
        const canvas = document.createElement("canvas")
        let width = img.width
        let height = img.height

        // Scale down if needed
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        ctx?.drawImage(img, 0, 0, width, height)

        // Convert to blob with reduced quality (0.6 for more compression)
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file)
              return
            }

            const newFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            })

            resolve(newFile)
          },
          "image/jpeg",
          0.6,
        )
      }

      img.onerror = () => resolve(file)
    }

    reader.onerror = () => resolve(file)
  })
}

/**
 * Updates a script's image in Firestore
 */
export async function updateScriptImage(scriptId: string, imageData: string | null): Promise<void> {
  try {
    const scriptRef = doc(db, "scripts", scriptId)
    await updateDoc(scriptRef, { imageUrl: imageData })
  } catch (error) {
    console.error("Error updating script image:", error)
    throw new Error("Failed to update image")
  }
}
