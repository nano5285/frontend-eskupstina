import { Button } from "@material-tailwind/react";
import { Dialog, DialogBody, DialogFooter } from "@material-tailwind/react";

export default function ResultAlert(props) {
  const { open, handleClose, resultData } = props;

  return (
    <div>
      <Dialog
        open={open}
        dismiss={{ onOutsideClick: false, onEscapeKey: false }}
      >
        <DialogBody className="w-full flex flex-col items-center">
          Rezultat glasnja
          <div className="w-full flex flex-row gap-5 justify-center mt-[20px]">
            <div className="basis-1/3 bg-[green] p-[10px] rounded-md text-[#FFF] text-center">
              {resultData.yesNum}
            </div>
            <div className="basis-1/3 bg-[blue] p-[10px] rounded-md text-[#FFF] text-center">
              {resultData.abstrainedNum}
            </div>
            <div className="basis-1/3 bg-[red] p-[10px] rounded-md text-[#FFF] text-center">
              {resultData.noNum}
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="flex flex-row items-center justify-center gap-3">
          <Button
            variant="gradient"
            color="yellow"
            onClick={() => handleClose()}
          >
            <span>Zatvori</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
