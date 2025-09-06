# Room Service Documentation

This document describes the roomService implementation for managing room availability in the ProRent frontend application.

## Overview

The roomService provides methods to:

- Set bulk availability for rooms/room-types
- Get monthly availability data
- Validate data formats
- Generate availability arrays for date ranges

## API Endpoints

- `POST /api/rooms/:id/availability` - Set bulk availability
- `GET /api/rooms/:id/availability?month=YYYY-MM` - Get monthly availability

## Files Created

### 1. Service (`src/service/roomService.ts`)

Main service with methods:

- `setBulkAvailability(roomId, availability)` - Set multiple dates availability
- `getMonthlyAvailability(roomId, month)` - Get availability for a month
- Validation helpers
- Date utility functions

### 2. Custom Hook (`src/hooks/useRoomAvailability.ts`)

React hook for easier state management:

- `useRoomAvailability({ roomId, onSuccess, onError })`

### 3. Endpoint Constants (`src/constants/endpoint.ts`)

Added ROOM_ENDPOINTS for consistency.

## Usage Examples

### Basic Service Usage

```typescript
import { roomService } from "@/service/roomService";

// Set availability for specific dates
const availability = [
  { date: "2024-01-15", isAvailable: true },
  { date: "2024-01-16", isAvailable: false },
];

try {
  const response = await roomService.setBulkAvailability(
    "room123",
    availability
  );
  console.log("Success:", response.message);
} catch (error) {
  console.error("Error:", error.message);
}

// Get monthly availability
try {
  const response = await roomService.getMonthlyAvailability(
    "room123",
    "2024-01"
  );
  console.log("Availability:", response.data.availability);
} catch (error) {
  console.error("Error:", error.message);
}
```

### Using the Custom Hook

```typescript
import { useRoomAvailability } from "@/hooks/useRoomAvailability";

function RoomAvailabilityComponent({ roomId }: { roomId: string }) {
  const {
    isLoading,
    availabilityData,
    currentMonth,
    getMonthlyAvailability,
    setDateAvailability,
    setDateRangeAvailability,
    goToNextMonth,
    goToPreviousMonth,
    getCurrentMonthFormatted,
  } = useRoomAvailability({
    roomId,
    onSuccess: () => alert("Availability updated!"),
    onError: (error) => alert(`Error: ${error}`),
  });

  useEffect(() => {
    getMonthlyAvailability(roomService.getCurrentMonth());
  }, []);

  return (
    <div>
      <h2>Availability for {getCurrentMonthFormatted()}</h2>

      <div>
        <button onClick={goToPreviousMonth}>Previous Month</button>
        <button onClick={goToNextMonth}>Next Month</button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {availabilityData.map((item) => (
            <div key={item.date}>
              {item.date}: {item.isAvailable ? "Available" : "Not Available"}
              <button
                onClick={() =>
                  setDateAvailability(item.date, !item.isAvailable)
                }
              >
                Toggle
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Utility Functions

### Date Generation

```typescript
// Generate availability for date range
const availability = roomService.generateAvailabilityForDateRange(
  "2024-01-01",
  "2024-01-31",
  true // all dates available
);

// Generate availability for entire month
const monthlyAvailability = roomService.generateMonthlyAvailability(
  2024, // year
  1, // month (1-12)
  false // all dates unavailable
);
```

### Validation

```typescript
// Validate month format
const isValidMonth = roomService.validateMonthFormat("2024-01"); // true
const isInvalid = roomService.validateMonthFormat("2024-13"); // false

// Validate availability array
const validation = roomService.validateAvailabilityArray(availability);
if (!validation.isValid) {
  console.error(validation.error);
}
```

## Error Handling

The service includes comprehensive error handling:

- Format validation (dates, months)
- Array validation
- API error responses
- User-friendly error messages

## TypeScript Interfaces

```typescript
interface AvailabilityItem {
  date: string; // YYYY-MM-DD
  isAvailable: boolean;
}

interface SetBulkAvailabilityResponse {
  success: boolean;
  message: string;
}

interface MonthlyAvailabilityData {
  roomId: string;
  month: string;
  year: number;
  availability: AvailabilityItem[];
}
```
