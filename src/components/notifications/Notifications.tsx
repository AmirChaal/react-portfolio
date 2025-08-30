import { useGlobal } from "../../stores/global"
import Notification from "./Notification"
import { motion, AnimatePresence } from "framer-motion"

export default function Notifications() {
   const global = useGlobal()

   return (
      <div className="absolute top-0 left-0 h-full w-full z-300 pointer-events-none font-jersey10">
         <div className="absolute bottom-[1.5em] left-0 right-0 flex flex-col justify-center items-center gap-[0.5em]">
            <AnimatePresence>
               {global.notifications.map(notification => (
                  <motion.div
                     key={notification.id}
                     layout   // <-- this makes siblings animate their new positions
                     initial={{ opacity: 0, y: 20, scale: 0.95 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 20, scale: 0.95 }}
                     transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                     <Notification 
                        icon={notification.icon} 
                        text={notification.text} 
                     />
                  </motion.div>
               ))}
            </AnimatePresence>
         </div>
      </div>
   )
}
