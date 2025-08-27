// src/view/report/component/FilterControls.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from 'date-fns';
import { FilterControlsProps } from "@/interface/report/reportInterface";

export function FilterControls({
  searchTerm,
  dateRangeType,
  selectedYear,
  selectedMonth,
  customStartDate,
  customEndDate,
  onSearchChange,
  onSearch,
  onSortChange,
  onSortDirectionChange,
  onResetFilters,
  onDateRangeTypeChange,
  onYearChange,
  onMonthChange,
  onCustomStartDateChange,
  onCustomEndDateChange,
  onApplyDates,
  sortBy,
  sortDir
}: FilterControlsProps) {
  return (
    <div className="px-6 pb-4 space-y-4">
      <DateRangeControls
        dateRangeType={dateRangeType}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        customStartDate={customStartDate}
        customEndDate={customEndDate}
        onDateRangeTypeChange={onDateRangeTypeChange}
        onYearChange={onYearChange}
        onMonthChange={onMonthChange}
        onCustomStartDateChange={onCustomStartDateChange}
        onCustomEndDateChange={onCustomEndDateChange}
        onApplyDates={onApplyDates}
      />
      
      <SearchAndSortControls
        searchTerm={searchTerm}
        sortBy={sortBy}
        sortDir={sortDir}
        onSearchChange={onSearchChange}
        onSearch={onSearch}
        onSortChange={onSortChange}
        onSortDirectionChange={onSortDirectionChange}
        onResetFilters={onResetFilters}
      />
    </div>
  );
}

function DateRangeControls({
  dateRangeType,
  selectedYear,
  selectedMonth,
  customStartDate,
  customEndDate,
  onDateRangeTypeChange,
  onYearChange,
  onMonthChange,
  onCustomStartDateChange,
  onCustomEndDateChange,
  onApplyDates
}: any) {
  return (
    <div className="flex flex-wrap gap-4 items-end">
      <PeriodSelect value={dateRangeType} onChange={onDateRangeTypeChange} />
      <YearInput value={selectedYear} onChange={onYearChange} />
      
      {dateRangeType === 'month' && (
        <MonthSelect value={selectedMonth} onChange={onMonthChange} />
      )}
      
      {dateRangeType === 'custom' && (
        <CustomDateInputs
          startDate={customStartDate}
          endDate={customEndDate}
          onStartDateChange={onCustomStartDateChange}
          onEndDateChange={onCustomEndDateChange}
        />
      )}
      
      <Button onClick={onApplyDates}>Apply Dates</Button>
    </div>
  );
}

function PeriodSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">Period</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="year">Year</SelectItem>
          <SelectItem value="month">Month</SelectItem>
          <SelectItem value="custom">Custom</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function YearInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">Year</label>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min="2000"
        max="2100"
        className="w-[100px]"
      />
    </div>
  );
}

function MonthSelect({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">Month</label>
      <Select value={value.toString()} onValueChange={(v) => onChange(Number(v))}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
            <SelectItem key={m} value={m.toString()}>
              {format(new Date(0, m - 1), 'MMMM')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function CustomDateInputs({ startDate, endDate, onStartDateChange, onEndDateChange }: any) {
  return (
    <>
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Start Date</label>
        <Input
          type="date"
          value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
          onChange={(e) => onStartDateChange(e.target.valueAsDate)}
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">End Date</label>
        <Input
          type="date"
          value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
          onChange={(e) => onEndDateChange(e.target.valueAsDate)}
        />
      </div>
    </>
  );
}

function SearchAndSortControls({
  searchTerm,
  sortBy,
  sortDir,
  onSearchChange,
  onSearch,
  onSortChange,
  onSortDirectionChange,
  onResetFilters
}: any) {
  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div className="flex-1 min-w-[200px]">
        <Input
          placeholder="Search properties..."
          value={searchTerm}
          onChange={onSearchChange}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
        />
      </div>
      
      <div className="flex gap-2 flex-wrap">
        <SortSelect value={sortBy} onChange={onSortChange} />
        <SortDirectionButton direction={sortDir} onClick={onSortDirectionChange} />
        <Button variant="outline" onClick={onSearch}>Search</Button>
        <Button variant="outline" onClick={onResetFilters}>Reset</Button>
      </div>
    </div>
  );
}

function SortSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="paymentAmount">Payment Amount</SelectItem>
        <SelectItem value="startDate">Start Date</SelectItem>
        <SelectItem value="endDate">End Date</SelectItem>
        <SelectItem value="createdAt">Created Date</SelectItem>
      </SelectContent>
    </Select>
  );
}

function SortDirectionButton({ direction, onClick }: { direction: string; onClick: () => void }) {
  return (
    <Button variant="outline" onClick={onClick} className="flex items-center">
      {direction === "asc" ? "↑ Asc" : "↓ Desc"}
    </Button>
  );
}