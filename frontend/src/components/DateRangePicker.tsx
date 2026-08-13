"use client";

import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";

interface Props {
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  onCheckInChange: (d: Date | undefined) => void;
  onCheckOutChange: (d: Date | undefined) => void;
  disabledDates?: Date[];
  bookedRanges?: { from: Date; to: Date }[];
}

function isDateInRanges(date: Date, ranges: { from: Date; to: Date }[]): boolean {
  return ranges.some(
    (range) => date >= range.from && date < range.to
  );
}

export default function DateRangePicker({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  bookedRanges = [],
}: Props) {
  const range: DateRange | undefined =
    checkIn || checkOut ? { from: checkIn, to: checkOut } : undefined;

  return (
    <DayPicker
      mode="range"
      selected={range}
      numberOfMonths={2}
      disabled={[
        { before: new Date() },
        (date) => isDateInRanges(date, bookedRanges),
      ]}
      onSelect={(selected) => {
        onCheckInChange(selected?.from);
        onCheckOutChange(selected?.to);
      }}
      classNames={{
        root: "rdp-root",
      }}
    />
  );
}
