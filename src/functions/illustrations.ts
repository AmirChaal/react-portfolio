export function getIllustrationsData() {
   const illustrations = [
      "/illustrations/9_years.webp",
      "/illustrations/lionheart.webp",
      "/illustrations/cassette_boy.webp",
      "/illustrations/confrontation.webp",
      "/illustrations/emile.webp",
      "/illustrations/kris.webp",
      "/illustrations/lizard.webp",
      "/illustrations/mysoul.webp",
      "/illustrations/omori.webp",
      "/illustrations/set.webp",
      "/illustrations/gavroche.webp",
   ].map((path, id) => ({ id, path }))

   return illustrations
}

export function getIllustrationFromId(id: number | string) {
   const imageObjects = getIllustrationsData()
   const imageObject = imageObjects.find(imageObject => imageObject.id == id)
   return imageObject
}

export function getIllustrationName(imageObject: ReturnType<typeof getIllustrationsData>[number]) {
   const path = imageObject.path
   const split = path.split('/')
   const lastParticle = split[split.length - 1]
   return lastParticle
}