import React, { useMemo } from 'react'
import { Dialog } from '@/components/ui'
import LottieAnimation from '../LottieAnimation';
import * as animationData from "@/assets/animations/clock.json";


interface LoadingDialogProps {
    dialogVisible: boolean;
    title?: string;
    message?: string;
    handleDialogClose: () => void;
}

const ErrorDialog: React.FC<LoadingDialogProps> = ({
    dialogVisible,
    message,
    title = 'Loading...',
    handleDialogClose,
}) => {

    return (
        <Dialog isOpen={dialogVisible} onClose={handleDialogClose} closable={false}> 
            <div className=" flex min-h-[200px] flex-col items-center justify-center p-2">
                <div className="flex flex-col items-center">
                    <h2 className="mb-3 mt-3 text-center text-xl font-bold">
                        {title}
                    </h2>
                    <div className="text-md mb-2 flex flex-col items-center text-center">
                        <p>{message}</p>
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
