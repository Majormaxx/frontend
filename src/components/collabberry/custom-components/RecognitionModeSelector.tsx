import { Select } from '@/components/ui';

type Option = {
    value: string;
    label: string;
};

const options: Option[] = [
    { value: 'hours-based', label: 'Hours-based' },
    { value: 'discretionary', label: 'Discretionary' },
];

type RecognitionModeSelectorProps = {
    value: string;
    onChange: (option: Option) => void;
}

const RecognitionModeSelector = ({ value, onChange }: RecognitionModeSelectorProps) => {
    const selectedOption = options.find(option => option.value === value);

    return (
        <Select
            options={options}
            placeholder="Select Recognition Mode"
            value={selectedOption}
            onChange={onChange}
        />
    );
};

export default RecognitionModeSelector;