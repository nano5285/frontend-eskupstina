import { Button } from '@material-tailwind/react';
import {
    Dialog,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";

export default function CloseAlert(props) {

    const { open, handleOpen, handleClose } = props

    return (
        <div>
            <Dialog open={open} handler={handleOpen} dismiss={false} >
                <DialogBody>
                    glasanje
                </DialogBody>
                <DialogFooter className='flex flex-row items-center justify-center gap-3'>
                    <Button variant="gradient" color="yellow" onClick={() => handleClose(false)}>
                        <span>zatvori</span>
                    </Button>
                </DialogFooter>
            </Dialog>

        </div>
    )
}