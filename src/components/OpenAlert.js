import { Button } from "@material-tailwind/react";
import { Dialog, DialogBody, DialogFooter } from "@material-tailwind/react";

export default function OpenAlert(props) {
  const { open, handleOpen } = props;

  return (
    <div>
      <Dialog
        open={open}
        handler={handleOpen}
        dismiss={{ onOutsideClick: false, onEscapeKey: false }}
      >
        <DialogBody>agenda1</DialogBody>
        <DialogFooter className="flex flex-row items-center justify-center gap-3">
          <Button variant="gradient" color="red" onClick={handleOpen}>
            <span>No</span>
          </Button>
          <Button variant="gradient" color="yellow" onClick={handleOpen}>
            <span>Abstain</span>
          </Button>
          <Button variant="gradient" color="green" onClick={handleOpen}>
            <span>Yes</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
