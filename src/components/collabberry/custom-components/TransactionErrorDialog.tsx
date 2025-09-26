import React, { useMemo } from 'react'
import { Dialog } from '@/components/ui'
import LottieAnimation from '../LottieAnimation';
import * as animationData from "@/assets/animations/error.json";


interface ErrorDialogProps {
    dialogVisible: boolean;
    errorMessage?: string;
    handleDialogClose: () => void;
}

const ErrorDialog: React.FC<ErrorDialogProps> = ({
    dialogVisible,
    errorMessage,
    handleDialogClose,
}) => {

    return (
        <Dialog isOpen={dialogVisible} onClose={handleDialogClose} shouldCloseOnOverlayClick>
            <div className=" flex min-h-[200px] flex-col items-center justify-center p-2">
                <div className="flex flex-col items-center">
                    <h2 className="mb-3 mt-3 text-center text-xl font-bold">
                        Oops, looks like something went wrong!
                    </h2>
                    <div className="text-md mb-2 flex flex-col items-center text-center">
                        <p>{errorMessage}</p>
                    </div>

                    <div className="pointer-events-none select-none">
                        {animationData && (
                            <LottieAnimation animationData={animationData} height={150}
                                width={150} />
                        )}
                    </div>
                    {/* <div className="flex justify-end mt-4 gap-4">
                        <Button type="button" onClick={handleDialogClose}>
                            Close
                        </Button>
                    </div> */}
                </div>
            </div>
        </Dialog>
    )
}

export default ErrorDialog
