import React from "react";
import { Tag } from "@/components/ui";

interface MintStatusTagProps {
    minted: boolean;
}

const MintStatusTag: React.FC<MintStatusTagProps> = ({ minted }) => {
    const getStatusTextAndColor = (status: boolean ) => {
        if (minted) {
            return { text: "Minted", color: "sky" };
        } else {
            return { text: "Not Minted", color: "amber" };
        }
    };
    const status = getStatusTextAndColor(minted);

    return (
        <Tag className={`text-${status.color}-500 bg-${status.color}-50 h-6 border-0`}>
            {status.text}
        </Tag>
    );
};

export default MintStatusTag;
