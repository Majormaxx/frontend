function formatNumber(number: number) {
  if (number < 10) {
    return "0" + number.toString();
  } else {
    return number.toString();
  }
}

interface CustomCountdownProps {
  days: number;
  hours: number;
  minutes: number;
  completed: boolean;
}

export const CustomCountdown = ({
  days,
  hours,
  minutes,
  completed,
}: CustomCountdownProps) => {
  return (
    <div className="flex gap-2">
      <div className="flex flex-row items-end">
        <div className="text-lg font-bold text-berrylavender-500">{days}</div>
        <div className="text-lg text-gray-400">D</div>
      </div>
      <div className="flex flex-row items-end">
        <div className="text-lg font-bold text-berrylavender-500">
          {formatNumber(hours)}
        </div>
        <div className="text-lg text-gray-400">h</div>
      </div>
      <div className="flex flex-row items-end">
        <div className="text-lg font-bold text-berrylavender-500">
          {formatNumber(minutes)}
        </div>
        <div className="text-lg text-gray-400">m</div>
      </div>
    </div>
  );
};
