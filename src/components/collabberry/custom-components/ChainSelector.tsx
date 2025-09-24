import { Select } from '@/components/ui';

type Option = {
    value: string;
    label: string;
    chainId: number;
};

const options: Option[] = [
    { value: 'ethereum', label: 'Ethereum', chainId: 1 },
    { value: 'arbitrum', label: 'Arbitrum', chainId: 42161 },
    { value: 'sepolia', label: 'Sepolia', chainId: 11155111 },
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