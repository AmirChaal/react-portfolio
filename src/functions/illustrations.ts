import nineYears from '/illustrations/9_years.png'
import lionheart from '/illustrations/lionheart.png'
import cassetteBoy from '/illustrations/cassette_boy.png'
import confrontation from '/illustrations/confrontation.jpg'
import emile from '/illustrations/emile.jpg'
import kris from '/illustrations/kris.jpg'
import lizard from '/illustrations/lizard.jpg'
import mysoul from '/illustrations/mysoul.jpg'
import omori from '/illustrations/omori.jpg'
import set from '/illustrations/set.jpg'
import gavroche from '/illustrations/gavroche.png'

export function getIllustrationsData() {
   const illustrations: { id: number, path: string }[] = []
   let id = 0
   const addIllustration = (path: string) => {
      illustrations.push({ id: id, path: path })
      id = id + 1
   }

   addIllustration(nineYears)
   addIllustration(lionheart)
   addIllustration(cassetteBoy)
   addIllustration(confrontation)
   addIllustration(emile)
   addIllustration(kris)
   addIllustration(lizard)
   addIllustration(mysoul)
   addIllustration(omori)
   addIllustration(set)
   addIllustration(gavroche)

   // addIllustration(horizontal)
   // addIllustration(vertical)

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