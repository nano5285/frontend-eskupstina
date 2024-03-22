import { useEffect } from "react";
import LockSvg from "../assets/Lock.svg";

export default function CustomButton({
  selected,
  onClick,
  name,
  index,
  locked,
}) {
  useEffect(() => {}, [selected]);

  return (
    <div>
      <div
        className={`${
          selected === true ? "bg-[#D5D5D5]" : "bg-[#fff]"
        } flex flex-row items-center w-full  rounded-md border-[#000] mt-[0px] p-[10px]`}
        onClick={onClick}
      >
        <div className="flex items-center justify-center min-w-[50px] min-h-[50px] rounded-full bg-[#D9D9D9] border-[2px] border-[#5B5B5B]">
          {locked ? <img alt="" src={LockSvg} width={30} height={30} /> : index}
        </div>
        <div className="text-[#000] text-left ml-2">{name}</div>
      </div>
    </div>
  );
}
