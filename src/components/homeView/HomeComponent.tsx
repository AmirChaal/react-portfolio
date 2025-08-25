import HomeText from "./HomeText";

export default function HomeComponent({ visible }: { visible: boolean }) {
   return (
      <div className="absolute top-0 left-0 h-full w-[calc(100%-10em)] flex items-center ml-[10em]">
         <HomeText visible={visible} />
      </div>
   );
}
