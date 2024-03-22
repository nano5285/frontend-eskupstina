import { Button } from "@material-tailwind/react";
import { Dialog, DialogHeader, DialogFooter } from "@material-tailwind/react";

export default function VoteAlert(props) {
  const { open, handleOpen, agenda } = props;

  return (
    <div>
      <Dialog
        open={open}
        dismiss={{ onOutsideClick: false, onEscapeKey: false }}
      >
        <DialogHeader>
          <>{agenda?.name}</>
        </DialogHeader>
        <DialogFooter className="grid grid-cols-3 gap-5">
          <Button
            variant="gradient"
            color="green"
            onClick={() => handleOpen(1)}
          >
            <span>DA</span>
          </Button>
          <Button variant="gradient" color="blue" onClick={() => handleOpen(2)}>
            <span>Suzdržan</span>
          </Button>
          <Button variant="gradient" color="red" onClick={() => handleOpen(0)}>
            <span>NE</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
