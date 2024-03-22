import { Button } from "@material-tailwind/react";
import { Dialog, DialogBody, DialogFooter } from "@material-tailwind/react";

export default function CloseAlert(props) {
  const { open, data, handleOpen, handleClose } = props;
  const { yesNum, notVotedNum, abstrainedNum, noNum } = data;

  return (
    <div>
      <Dialog
        open={open}
        handler={handleOpen}
        dismiss={{ onOutsideClick: false, onEscapeKey: false }}
      >
        <DialogBody>
          <div className="flex flex-row w-full justify-between bg-[#f5f5f5] rounded-[20px] p-[10px]">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-[40px] h-[40px] md:w-[60px] md:h-[60px] rounded-full bg-[#D9D9D9] border-[2px] border-[#5B5B5B] text-[#5B5B5B]">
                {notVotedNum}
              </div>
              <div className="w-[40px] md:w-[70px] text-[12px] text-center break-words">
                Ukupno
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-[40px] h-[40px] md:w-[60px] md:h-[60px] text-[white] rounded-full bg-[#4AD527] border-[#5B5B5B] ">
                {yesNum}
              </div>
              <div className="w-[40px] md:w-[70px] text-[12px] text-center break-words">
                Za
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-[40px] h-[40px] md:w-[60px] md:h-[60px] text-[white] rounded-full bg-[#377AFC] border-[#5B5B5B] ">
                {abstrainedNum}
              </div>
              <div className="w-[40px] md:w-[70px] text-[12px] text-center break-words">
                Suzdržano
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-[40px] h-[40px] md:w-[60px] md:h-[60px] text-[white] rounded-full bg-[#EF4343] border-[#5B5B5B] ">
                {noNum}
              </div>
              <div className="w-[40px] md:w-[70px] text-[12px] text-center break-words">
                Protiv
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="flex flex-row items-center justify-center gap-3">
          <Button
            variant="gradient"
            color="yellow"
            onClick={() => handleClose(false)}
          >
            <span>zatvori</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
