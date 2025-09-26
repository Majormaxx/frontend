import { Card } from "@/components/ui";

const TextInfoBlock: React.FC<{ title: string; value: string }> = ({
    title,
    value,
}) => {
    return (
        <div className="flex flex-col">
            <h3 className="font-bold text-berrylavender-600">{value}</h3>
            <span className="text-sm">{title}</span>
        </div>
    );
};

export const StatisticCard: React.FC<{ title: string; value: string }> = ({
    title,
    value,
}) => {
    return (
        <Card>
            <h6 className="mb-4 text-sm font-semibold text-gray-500">{title}</h6>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-gray-600">
                        {value}
                    </h3>
                </div>
            </div>
        </Card>
    )
}