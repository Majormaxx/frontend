import { Select } from '@/components/ui';

type Option = {
    value: string;
    label: string;
};

const options: Option[] = [
    { value: 'ethereum', label: 'Ethereum' },
    { value: 'arbitrum', label: 'Arbitrum' },
    { value: 'sepolia', label: 'Sepolia' },
];

type ChainSelectorProps = {
    value: string;
    onChange: (option: Option) => void;
}

const ChainSelector = ({ value, onChange }: ChainSelectorProps) => {
    const selectedOption = options.find(option => option.value === value);

    return (
        <Select
            options={options}
            placeholder="Select Chain"
            value={selectedOption}
            onChange={onChange}
        />
    );
};

export default ChainSelector;