import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
  CreditCard,
  Calendar,
  User,
  ArrowUpRight,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { useOwnerReservations } from "@/service/useReservation";
import { useMemo } from "react";
import { ReservationWithPayment } from "@/interface/paymentInterface";

interface Transaction {
  id: string;
  type: "booking" | "payment" | "cancellation";
  propertyName: string;
  amount: number;
  status: "completed" | "pending" | "cancelled";
  date: string;
  guestName?: string;
  paymentMethod?: string;
}

export default function RecentTransactions() {
  const router = useRouter();

  // Fetch owner reservations with TanStack Query
  const {
    data: reservationsData,
    isLoading,
    error,
  } = useOwnerReservations({
    limit: 3,
    page: 1,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Transform reservations to transactions
  const transactions: Transaction[] = useMemo(() => {
    if (!reservationsData?.reservations) {
      return [];
    }

    return reservationsData.reservations
      .slice(0, 3)
      .map((reservation: ReservationWithPayment) => {
        // Determine transaction type
        let type: "booking" | "payment" | "cancellation" = "booking";
        if (reservation.orderStatus === "CANCELLED") {
          type = "cancellation";
        } else if (reservation.PaymentProof) {
          type = "payment";
        }

        // Determine status
        let status: "completed" | "pending" | "cancelled" = "pending";
        if (reservation.orderStatus === "CONFIRMED") {
          status = "completed";
        } else if (reservation.orderStatus === "CANCELLED") {
          status = "cancelled";
        }

        // Get guest name
        const guestName =
          reservation.User?.firstName ||
          reservation.User?.email?.split("@")[0] ||
          "Guest";

        // Get payment method
        const paymentMethod = reservation.payment?.method
          ? reservation.payment.method.toLowerCase().replace("_", " ")
          : undefined;

        return {
          id: reservation.id,
          type,
          propertyName:
            reservation.RoomType?.property?.name || "Unknown Property",
          amount: reservation.payment?.amount || 0,
          status,
          date: reservation.createdAt,
          guestName,
          paymentMethod,
        };
      });
  }, [reservationsData]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <Calendar className="h-4 w-4 text-blue-600" />;
      case "payment":
        return <CreditCard className="h-4 w-4 text-green-600" />;
      case "cancellation":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Latest 3 transactions from your properties
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" disabled>
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg animate-pulse"
              >
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-20 h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Failed to load transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <XCircle className="h-8 w-8 mx-auto mb-2 text-red-400" />
            <p>Unable to load recent transactions</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Latest 3 transactions from your properties
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/dashboard/reservations")}
          className="flex items-center gap-2 cursor-pointer"
        >
          View All
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CreditCard className="h-8 w-8 mx-auto mb-2" />
              <p>No recent transactions found</p>
              <p className="text-sm mt-1">
                Transactions will appear here once you start receiving bookings
              </p>
            </div>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => router.push(`/reservation/${transaction.id}`)}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getTypeIcon(transaction.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {transaction.propertyName}
                      </p>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${getStatusColor(
                          transaction.status
                        )}`}
                      >
                        <span className="flex items-center gap-1">
                          {getStatusIcon(transaction.status)}
                          {transaction.status}
                        </span>
                      </Badge>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 space-x-2">
                      {transaction.guestName && (
                        <>
                          <User className="h-3 w-3" />
                          <span>{transaction.guestName}</span>
                          <span>•</span>
                        </>
                      )}
                      <span>
                        {formatDistanceToNow(new Date(transaction.date), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatPrice(transaction.amount)}
                    </p>
                    {transaction.paymentMethod && (
                      <p className="text-xs text-gray-500 capitalize">
                        {transaction.paymentMethod.replace("_", " ")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
