import nineYears from '/illustrations/9_years.png'
import lionheart from '/illustrations/lionheart.png'
import cassetteBoy from '/illustrations/cassette_boy.png'

export function getIllustrationsData() {
   return [
      {
         id: 0,
         path: nineYears
      },
      {
         id: 1,
         path: lionheart
      },
      {
         id: 2,
         path: cassetteBoy
      },
   ]
}

export function getIllustrationFromId(id: number | string) {
   const imageObjects = getIllustrationsData()
   const imageObject = imageObjects.find(imageObject => imageObject.id == id)
   return imageObject
}