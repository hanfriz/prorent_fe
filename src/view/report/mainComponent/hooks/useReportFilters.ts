// src/app/dashboard/report/main/hooks/useReportFilters.ts
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { propertyService } from '@/service/propertyService';
import { reportService } from '@/service/report/reportService';
import { toast } from 'sonner';
import { cleanFilters, cleanOptions } from '@/service/report/useReport';
import { Property, ReportFormat, RoomTypeMin } from '@/interface/report/reportInterface';

export const useReportFilters = (ownerId: string | undefined) => {
   const [ dateRange, setDateRange ] = useState({
      startDate: new Date(new Date().getFullYear(), 0, 1),
      endDate: new Date(new Date().getFullYear(), 11, 31)
   });
   const [ dateRangeType, setDateRangeType ] = useState('year');
   const [ selectedPropertyId, setSelectedPropertyId ] = useState('all');
   const [ selectedRoomTypeId, setSelectedRoomTypeId ] = useState('all');
   const [ searchTerm, setSearchTerm ] = useState('');
   const [ appliedSearchTerm, setAppliedSearchTerm ] = useState('');
   const [ sortBy, setSortBy ] = useState<any>('name');
   const [ sortDir, setSortDir ] = useState<'asc' | 'desc'>('asc');
   const [ page, setPage ] = useState(1);
   const [ reservationPageMap, setReservationPageMap ] = useState<Record<string, number>>({});
   const [ reservationFilterMap, setReservationFilterMap ] = useState<Record<string, any>>({});

   // --- Handler Functions ---
   const handlePropertyChange = (value: string) => {
      setSelectedPropertyId(value);
      setSelectedRoomTypeId('all');
      setPage(1);
      setReservationPageMap({});
      setReservationFilterMap({}); // Reset reservation filters
   };

   const handleRoomTypeChange = (value: string) => {
      setSelectedRoomTypeId(value);
      setPage(1);
      setReservationPageMap({});
      setReservationFilterMap({}); // Reset reservation filters
   };

   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
   };

   const handleSearch = () => {
      setAppliedSearchTerm(searchTerm);
      setPage(1);
      setReservationPageMap({});
      setReservationFilterMap({}); // Reset reservation filters
   };

   const handleSortChange = (value: string) => {
      const allowedSortByValues = [
         'startDate',
         'endDate',
         'name',
         'revenue',
         'confirmed',
         'pending',
         'city',
         'address',
         'province',
         'createdAt',
         'paymentAmount'
      ];
      if (allowedSortByValues.includes(value)) {
         setSortBy(value as any);
         setPage(1);
         setReservationPageMap({});
         setReservationFilterMap({}); // Reset reservation filters
      } else {
         console.error(`Invalid sort by value: ${value}`);
      }
   };

   const handleSortDirectionChange = () => {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
      setPage(1);
      setReservationPageMap({});
      setReservationFilterMap({}); // Reset reservation filters
   };

   const handleDateRangeTypeChange = (value: string) => {
      setDateRangeType(value);
      setPage(1);
      setReservationPageMap({});
      setReservationFilterMap({}); // Reset reservation filters
   };

   const handleYearChange = (year: number) => {
      const newStart = new Date(year, 0, 1);
      const newEnd = new Date(year, 11, 31);
      setDateRange({ startDate: newStart, endDate: newEnd });
      setPage(1);
      setReservationPageMap({});
      setReservationFilterMap({}); // Reset reservation filters
   };

   const handleMonthChange = (month: number) => {
      const year = dateRange.startDate?.getFullYear() ?? new Date().getFullYear();
      const newStart = new Date(year, month - 1, 1);
      const newEnd = new Date(year, month, 0);
      setDateRange({ startDate: newStart, endDate: newEnd });
      setPage(1);
      setReservationPageMap({});
      setReservationFilterMap({}); // Reset reservation filters
   };

   const handleCustomStartDateChange = (date: Date | null) => {
      setDateRange(prev => ({ ...prev, startDate: date ?? new Date() }));
      setPage(1);
      setReservationPageMap({});
      setReservationFilterMap({}); // Reset reservation filters
   };

   const handleCustomEndDateChange = (date: Date | null) => {
      setDateRange(prev => ({ ...prev, endDate: date ?? new Date() }));
      setPage(1);
      setReservationPageMap({});
      setReservationFilterMap({}); // Reset reservation filters
   };

   const handleApplyDates = () => {
      setPage(1);
      setReservationPageMap({});
      setReservationFilterMap({}); // Reset reservation filters
   };

   const handleResetFilters = () => {
      setDateRangeType('year');
      setDateRange({
         startDate: new Date(new Date().getFullYear(), 0, 1),
         endDate: new Date(new Date().getFullYear(), 11, 31)
      });
      setSelectedPropertyId('all');
      setSelectedRoomTypeId('all');
      setSearchTerm('');
      setAppliedSearchTerm('');
      setSortBy('name');
      setSortDir('asc');
      setPage(1);
      setReservationPageMap({});
      setReservationFilterMap({}); // Reset reservation filters
   };

   // Handle reservation filter changes - this will trigger a new API call
   const handleReservationFilterChange = (roomTypeId: string, filters: any) => {
      setReservationFilterMap(prev => ({
         ...prev,
         [roomTypeId]: filters
      }));

      // Reset to page 1 for this room type
      setReservationPageMap(prev => ({
         ...prev,
         [roomTypeId]: 1
      }));

      // This will trigger a re-render and new API call with updated options
      setPage(prev => prev); // Force re-render
   };

   // --- Data Fetching ---
   const { data: allPropertiesData, isLoading: isLoadingProperties } = useQuery({
      queryKey: [ 'allPropertiesForReport', ownerId ],
      queryFn: async () => {
         const res = await propertyService.getMyProperties();
         return res?.data || [];
      },
      enabled: !!ownerId
   });

   const allProperties = allPropertiesData || [];

   const { data: roomTypesForSelectedPropertyData, isLoading: isLoadingRoomTypes } = useQuery({
      queryKey: [ 'roomTypesForSelectedProperty', selectedPropertyId, ownerId ],
      queryFn: async () => {
         if (selectedPropertyId === 'all' || !selectedPropertyId) {
            return [];
         }
         try {
            const res = await propertyService.getPropertyById(selectedPropertyId);
            return res?.data?.roomTypes || [];
         } catch (error) {
            console.error('Room types fetch error:', error);
            return [];
         }
      },
      enabled: !!ownerId && selectedPropertyId !== 'all' && !!selectedPropertyId
   });

   const roomTypesForSelectedProperty = roomTypesForSelectedPropertyData || [];

   // --- Prepare Filters and Options for useDashboardReportCore ---
   const filtersForReportHook = useMemo(() => {
      if (!ownerId) {
         return {};
      }

      const filters: any = {
         ownerId,
         startDate: dateRange.startDate,
         endDate: dateRange.endDate
      };

      if (selectedPropertyId !== 'all' && selectedPropertyId) {
         filters.propertyId = selectedPropertyId;
      }

      if (selectedRoomTypeId !== 'all' && selectedRoomTypeId) {
         filters.roomTypeId = selectedRoomTypeId;
      }

      if (appliedSearchTerm) {
         filters.search = appliedSearchTerm;
      }

      return cleanFilters(filters);
   }, [ ownerId, selectedPropertyId, selectedRoomTypeId, dateRange.startDate, dateRange.endDate, appliedSearchTerm ]);

   const optionsForReportHook = useMemo(() => {
      // Build reservation page map with filters
      const reservationOptions: any = {};

      Object.keys(reservationPageMap).forEach(roomTypeId => {
         reservationOptions[roomTypeId] = {
            page: reservationPageMap[roomTypeId] || 1,
            ...(reservationFilterMap[roomTypeId] || {})
         };
      });

      // Also include filters for room types that have filters but no page set
      Object.keys(reservationFilterMap).forEach(roomTypeId => {
         if (!reservationOptions[roomTypeId]) {
            reservationOptions[roomTypeId] = {
               page: 1,
               ...(reservationFilterMap[roomTypeId] || {})
            };
         }
      });

      return cleanOptions({
         page,
         pageSize: 10,
         reservationPage: reservationOptions,
         reservationPageSize: 10,
         sortBy,
         sortDir,
         fetchAllData: false
      });
   }, [ page, sortBy, sortDir, reservationPageMap, reservationFilterMap ]);

   const handleReservationPageChange = (roomTypeId: string, newPage: number) => {
      setReservationPageMap(prev => ({ ...prev, [roomTypeId]: newPage }));
      setPage(1);
   };

   const handleDownloadRoomTypeReport = async (propertyId: string, roomTypeId: string) => {
      if (!ownerId) {
         toast.error('User not authenticated.');
         return;
      }

      try {
         const exportFilters = {
            ownerId,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            propertyId,
            roomTypeId,
            search: appliedSearchTerm || undefined
         };

         const exportFormat: ReportFormat = ReportFormat.ROOM_TYPE;

         await reportService.exportExcel(exportFilters, {
            fetchAllData: true,
            format: exportFormat
         });

         toast.success('Room type report download started!');
      } catch (err) {
         console.error('Download failed:', err);
         toast.error('Failed to download room type report.');
      }
   };

   // Update the existing handleDownloadReport to handle property-level downloads
   const handleDownloadReport = async (propertyId?: string) => {
      if (!ownerId) {
         toast.error('User not authenticated.');
         return;
      }

      try {
         const exportFilters = {
            ownerId,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            propertyId: propertyId !== 'all' ? propertyId : undefined,
            roomTypeId: selectedRoomTypeId !== 'all' ? selectedRoomTypeId : undefined,
            search: appliedSearchTerm || undefined
         };

         let exportFormat: ReportFormat = ReportFormat.ALL;

         if (propertyId && propertyId !== 'all') {
            exportFormat = ReportFormat.PROPERTY;
         } else if (selectedPropertyId !== 'all') {
            exportFormat = ReportFormat.PROPERTY;
         }

         await reportService.exportExcel(exportFilters, {
            fetchAllData: true,
            format: exportFormat || ReportFormat.ALL
         });

         toast.success('Report download started!');
      } catch (err) {
         console.error('Download failed:', err);
         toast.error('Failed to download report.');
      }
   };

   return {
      // Filters and options
      filters: filtersForReportHook,
      options: optionsForReportHook,
      // State values
      dateRange,
      dateRangeType,
      selectedPropertyId,
      selectedRoomTypeId,
      searchTerm,
      appliedSearchTerm,
      sortBy,
      sortDir,
      reservationPageMap,
      isLoadingProperties,
      roomTypesForSelectedProperty,
      allProperties,
      // Handler functions
      handlePropertyChange,
      handleRoomTypeChange,
      handleSearchChange,
      handleSearch,
      handleSortChange,
      handleSortDirectionChange,
      handleDateRangeTypeChange,
      handleYearChange,
      handleMonthChange,
      handleCustomStartDateChange,
      handleCustomEndDateChange,
      handleApplyDates,
      handleReservationPageChange,
      handleDownloadReport,
      handleDownloadRoomTypeReport,
      handleResetFilters,
      handleReservationFilterChange
   };
};
