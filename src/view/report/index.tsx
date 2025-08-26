// 'use client';

// import { useChartReport, useDashboardReport, useExportExcel } from '@/service/report/useReport';
// import { DashboardCard } from './component/cardComponent';
// import { Graph } from './component/graphComponent';
// import { FilterButton } from './component/filterButton';
// import { PropertyCard } from './component/propertyCard';
// import { Pagination } from './component/pagination';
// import { useReportStore } from '@/lib/stores/reportStore';
// import { Button } from '@/components/ui/button';
// import { Download } from 'lucide-react';
// import { Label } from '@/components/ui/label';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Checkbox } from '@/components/ui/checkbox';

// export default function DashboardReport() {
//    const { filters, options, viewMode, days, setFilter, setOption, setViewMode, setDays } = useReportStore();
//    const {  data: report, isLoading: reportLoading } = useDashboardReport();
//    const {  data: chartData, isLoading: chartLoading } = useChartReport();
//    const { exportExcel } = useExportExcel();

//    if (reportLoading || chartLoading) return <div className="p-4">Loading...</div>;

//    return (
//       <div className="space-y-6 p-6">
//          {/* Header */}
//          <div className="flex justify-between items-center">
//             <h1 className="text-2xl font-bold">Dashboard Report</h1>
//             <Button onClick={exportExcel}>
//                <Download className="mr-2 h-4 w-4" />
//                Export Excel
//             </Button>
//          </div>

//          {/* View Mode */}
//          <div className="flex flex-wrap gap-2">
//             <Button
//                variant={viewMode === 'yearly' ? 'default' : 'outline'}
//                onClick={() => setViewMode('yearly')}
//                size="sm"
//             >
//                Yearly
//             </Button>
//             <Button
//                variant={viewMode === 'monthly' ? 'default' : 'outline'}
//                onClick={() => setViewMode('monthly')}
//                size="sm"
//             >
//                Monthly
//             </Button>
//             <Button
//                variant={viewMode === 'daily' ? 'default' : 'outline'}
//                onClick={() => setViewMode('daily')}
//                size="sm"
//             >
//                Last N Days
//             </Button>
//             <Button
//                variant={viewMode === 'custom' ? 'default' : 'outline'}
//                onClick={() => setViewMode('custom')}
//                size="sm"
//             >
//                Custom Date
//             </Button>
//          </div>

//          {/* Daily Days Input */}
//          {viewMode === 'daily' && (
//             <div className="flex items-center gap-2">
//                <Label>Days:</Label>
//                <Input
//                   type="number"
//                   value={days}
//                   onChange={(e) => setDays(Number(e.target.value))}
//                   min={1}
//                   max={90}
//                   className="w-20"
//                />
//             </div>
//          )}

//          {/* Custom Date */}
//          {viewMode === 'custom' && (
//             <div className="flex gap-4 items-center">
//                <div>
//                   <Label>Start Date</Label>
//                   <Input
//                      type="date"
//                      value={filters.startDate ? filters.startDate.toISOString().split('T')[0] : ''}
//                      onChange={(e) => setFilter('startDate', e.target.value ? new Date(e.target.value) : null)}
//                   />
//                </div>
//                <div>
//                   <Label>End Date</Label>
//                   <Input
//                      type="date"
//                      value={filters.endDate ? filters.endDate.toISOString().split('T')[0] : ''}
//                      onChange={(e) => setFilter('endDate', e.target.value ? new Date(e.target.value) : null)}
//                   />
//                </div>
//             </div>
//          )}

//          {/* Other Filters */}
//          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <Input
//                placeholder="Search guest"
//                value={filters.search || ''}
//                onChange={(e) => setFilter('search', e.target.value)}
//             />
//             <Select
//                value={options.sortDir}
//                onValueChange={(value) => setOption('sortDir', value as 'asc' | 'desc')}
//             >
//                <SelectTrigger>
//                   <SelectValue placeholder="Sort" />
//                </SelectTrigger>
//                <SelectContent>
//                   <SelectItem value="asc">Asc</SelectItem>
//                   <SelectItem value="desc">Desc</SelectItem>
//                </SelectContent>
//             </Select>
//             <div className="flex gap-4">
//                <div className="flex items-center gap-1">
//                   <Checkbox
//                      id="confirmed"
//                      checked={filters.status?.includes('CONFIRMED')}
//                      onCheckedChange={(checked) =>
//                         setFilter(
//                            'status',
//                            checked
//                               ? [...(filters.status || []), 'CONFIRMED']
//                               : filters.status?.filter(s => s !== 'CONFIRMED')
//                         )
//                      }
//                   />
//                   <Label htmlFor="confirmed">Confirmed</Label>
//                </div>
//                <div className="flex items-center gap-1">
//                   <Checkbox
//                      id="cancelled"
//                      checked={filters.status?.includes('CANCELLED')}
//                      onCheckedChange={(checked) =>
//                         setFilter(
//                            'status',
//                            checked
//                               ? [...(filters.status || []), 'CANCELLED']
//                               : filters.status?.filter(s => s !== 'CANCELLED')
//                         )
//                      }
//                   />
//                   <Label htmlFor="cancelled">Cancelled</Label>
//                </div>
//             </div>
//          </div>

//          {/* Summary Cards */}
//          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//             <DashboardCard
//                title="Total Revenue"
//                value={`Rp${report?.summary.revenue.actual.toLocaleString()}`}
//             />
//             <DashboardCard
//                title="Confirmed"
//                value={report?.summary.counts.CONFIRMED || 0}
//             />
//             <DashboardCard
//                title="Projected"
//                value={`Rp${report?.summary.revenue.projected.toLocaleString()}`}
//             />
//             <DashboardCard
//                title="Cancelled"
//                value={report?.summary.counts.CANCELLED || 0}
//             />
//          </div>

//          {/* Chart */}
//          <div className="bg-white rounded-lg shadow p-4">
//             <h2 className="text-lg font-semibold mb-4">Revenue Chart</h2>
//             <Graph data={chartData?.data ?? []} />
//          </div>

//          {/* Properties */}
//          <div className="space-y-4">
//             {report?.properties.map((prop) => (
//                <div key={prop.property.id} className="border rounded p-4">
//                   <h3 className="font-semibold">{prop.property.name}</h3>
//                   <p>Revenue: Rp{prop.summary.revenue.actual.toLocaleString()}</p>
//                </div>
//             ))}
//          </div>

//         {/* Pagination */}
//          <Pagination
//             page={options.page}
//             pageSize={options.pageSize}
//             total={report?.pagination.total || 0}
//             onPageChange={(page) => setOption('page', page)}
//          />
//       </div>
//    );
// }