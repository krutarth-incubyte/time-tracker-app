interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  placeholder?: string;
  "data-testid"?: string;
}

export function TimePicker({
  value,
  onChange,
  placeholder = "Select time",
  "data-testid": testId,
}: TimePickerProps) {
  // Generate time options in 1-hour intervals
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      const timeString = `${hour.toString().padStart(2, "0")}:00`;
      options.push(timeString);
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      data-testid={testId}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {timeOptions.map((time) => (
        <option key={time} value={time}>
          {time}
        </option>
      ))}
    </select>
  );
}
