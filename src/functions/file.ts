export async function copyImageIntoClipboard(path: string) {
   try {
      // Fetch the image as a blob
      const response = await fetch(path)
      let blob = await response.blob()

      // If it's JPEG, convert to PNG since clipboard doesn't support JPEG
      if (blob.type === "image/jpeg") {
         const bitmap = await createImageBitmap(blob)
         const canvas = document.createElement("canvas")
         canvas.width = bitmap.width
         canvas.height = bitmap.height
         const ctx = canvas.getContext("2d")
         ctx?.drawImage(bitmap, 0, 0)

         blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((b) => resolve(b!), "image/png")
         })
      }

      // Create a clipboard item
      const clipboardItem = new ClipboardItem({ [blob.type]: blob })

      // Write it to the clipboard
      await navigator.clipboard.write([clipboardItem])
   } catch (err) {
      console.error("Failed to copy image:", err)
   }
}