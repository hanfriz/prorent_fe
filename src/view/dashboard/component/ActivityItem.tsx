interface Activity {
  id: number;
  type: string;
  message: string;
  time: string;
  status: "pending" | "completed";
}

interface ActivityItemProps {
  activity: Activity;
}

export default function ActivityItem({ activity }: ActivityItemProps) {
  return (
    <div className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div
        className={`w-2 h-2 rounded-full ${
          activity.status === "completed" ? "bg-green-500" : "bg-yellow-500"
        }`}
      />
      <div className="flex-1">
        <p className="text-sm font-medium">{activity.message}</p>
        <p className="text-xs text-muted-foreground">{activity.time}</p>
      </div>
      <div
        className={`px-2 py-1 rounded-full text-xs ${
          activity.status === "completed"
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800"
        }`}
      >
        {activity.status}
      </div>
    </div>
  );
}
