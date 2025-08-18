import TextButton from "../TextButton";

export default function WorkButton({ text }: { text: string,  }) {

   return (
      <TextButton className="py-[0.5em] text-[0.7em] tracking-[0.05em] w-full" text={text} />
   )
}