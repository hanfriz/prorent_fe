"use client";

import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import PriceCalendar from "@/components/myUi/customCalender";
import { createReservation } from "@/service/reservationService";
import { useReservationStore } from "@/lib/stores/reservationStore";
import { useRouter } from "next/navigation";
import moment from "moment-timezone";
import { PaymentType } from "@/interface/reservationInterface";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data testing (sementara)
const mockReservationData = {
  userId: "GTrOzXbTNxts",
  propertyId: "48312158",
  propertyName: "Villa Sejuk Puncak",
  propertyType: "Room by Room",
  roomTypeId: "541253415",
  roomTypeName: "Deluxe Room",
  basePrice: 100000,
  paymentType: PaymentType.MANUAL_TRANSFER,
  payerEmail: "ashtin.lorin@doodrops.org",
};

export default function CreateReservationPage() {
  const router = useRouter();
  const { setReservation, setField, setReservationId } = useReservationStore();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [priceMap, setPriceMap] = useState<Record<string, number>>({});

  useEffect(() => {
    // Simulate fetching price data based on property/room type
    // In a real app, you'd do an API call here
    const fetchedPriceMap: Record<string, number> = {
      "2025-08-23": 120000,
      "2025-08-24": 135000,
      "2025-08-25": 110000,
      "2025-08-26": 150000,
      // Add more dates...
    };
    setPriceMap(fetchedPriceMap);
  }, []);

  const isFormValid = () => {
    return (
      startDate !== undefined && endDate !== undefined && startDate < endDate
    );
  };

  const form = useForm({
    defaultValues: {
      ...mockReservationData,
      startDate: "",
      endDate: "",
    },
    onSubmit: async ({ value }) => {
      if (!isFormValid() || !startDate || !endDate) return;

      try {
        const startDateToSend = moment
          .tz(startDate, "Asia/Jakarta")
          .startOf("day")
          .toDate();
        const endDateToSend = moment
          .tz(endDate, "Asia/Jakarta")
          .startOf("day")
          .toDate();

        const payload = {
          ...value,
          startDate: startDateToSend,
          endDate: endDateToSend,
          PaymentType: value.paymentType as PaymentType,
        };
        console.log("Payload:", payload);
        const res = await createReservation(payload);
        const data = res.reservation;
        console.log("Reservation Data:", data);
        setReservationId(data.id);
        router.push(`/payment/${data.id}`);
      } catch (err) {
        console.error(err);
      }
    },
  });

  return (
    <div className="max-w-lg mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Create Reservation</h1>

      {/* Informasi Properti */}
      <div className="p-4 border rounded-lg space-y-1 bg-gray-50">
        <p>
          <strong>Nama Properti:</strong> {mockReservationData.propertyName}
        </p>
        <p>
          <strong>Tipe Kamar:</strong> {mockReservationData.roomTypeName}
        </p>
      </div>

      {/* Informasi Pembayaran */}
      <div className="p-4 border rounded-lg space-y-1 bg-gray-50">
        <p>
          <strong>Email Pembayar:</strong> {mockReservationData.payerEmail}
        </p>
        <p>
          <strong>Metode Pembayaran:</strong> {mockReservationData.paymentType}
        </p>
      </div>

      {/* Kalender */}
      <div className="">
        <h2 className="text-lg font-medium mb-2">Pilih Tanggal Reservasi</h2>
        <div className="flex flex-col gap-6">
          {" "}
          <div className="flex-1">
            <label
              htmlFor="start-date-calendar"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Check-in
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    moment(startDate).tz("Asia/Jakarta").format("YYYY-MM-DD")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <ChevronDownIcon className="ml-auto h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 max-h-[80vh] overflow-y-auto"
                align="start"
              >
                <div id="start-date-calendar">
                  <PriceCalendar
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date);
                      // Opsional: Reset endDate jika startDate baru lebih besar atau sama
                      if (endDate && date && date >= endDate) {
                        setEndDate(undefined);
                      }
                    }}
                    priceMap={priceMap}
                    basePrice={mockReservationData.basePrice}
                    // Opsional: Atur defaultMonth ke startDate yang dipilih atau hari ini
                    defaultMonth={startDate ?? new Date()}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
          {/* Kalender End Date */}
          <div className="flex-1">
            <label
              htmlFor="end-date-calendar"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Check-out
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? (
                    moment(endDate).tz("Asia/Jakarta").format("YYYY-MM-DD")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <ChevronDownIcon className="ml-auto h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <div id="end-date-calendar">
                  <PriceCalendar
                    selected={endDate}
                    onSelect={setEndDate}
                    priceMap={priceMap}
                    basePrice={mockReservationData.basePrice}
                    // Nonaktifkan pemilihan tanggal sebelum startDate
                    // Tanggal minimum yang bisa dipilih adalah startDate + 1 hari
                    // Modifikasi komponen Calendar jika perlu, atau handle di onSelect
                    // Untuk sementara, kita bisa menambahkan validasi di submit
                    // Opsional: Atur defaultMonth ke startDate atau endDate yang dipilih
                    defaultMonth={endDate ?? startDate ?? new Date()}
                    // Jika Calendar mendukung disabled prop berdasarkan date, gunakan:
                    // disabled={(date) => startDate ? date <= startDate : false}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {/* Tampilkan pesan error jika tanggal tidak valid */}
        {startDate && endDate && startDate >= endDate && (
          <p className="mt-2 text-sm text-red-600">
            Tanggal Check-out harus setelah Check-in.
          </p>
        )}
      </div>

      {/* Tombol Submit */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <button
          type="submit"
          disabled={!isFormValid()}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-300"
        >
          Buat Reservasi
        </button>
      </form>
    </div>
  );
}
