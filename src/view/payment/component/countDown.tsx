import moment from "moment-timezone";

export function CountDown({ hours, minutes, seconds }: any) {
  return (
    <div className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#00A6D6]/40 via-[#8297d7] to-[#E0EAFB]/40 p-6 backdrop-blur-sm">
      {/* Grid background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-bold text-white uppercase tracking-wider">
          Time Countdown
        </h2>

        <div className="flex items-center gap-4 text-white">
          {/* Days */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-medium text-white bg-white/10 px-3 py-1 rounded-full mb-2">
              HOURS
            </span>
            <div className="relative w-24 h-24 flex items-center justify-center bg-transparent border-2 border-dashed border-white rounded-2xl shadow-lg">
              <span className="text-3xl font-bold text-white">{hours}</span>
            </div>
          </div>

          {/* Separator */}
          <span className="text-2xl font-bold text-white">:</span>

          {/* Hours */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-medium text-white bg-white/20 px-3 py-1 rounded-full mb-2">
              MINUTES
            </span>
            <div className="relative w-24 h-24 flex items-center justify-center bg-transparent border-2 border-dashed border-white rounded-2xl shadow-lg">
              <span className="text-3xl font-bold text-white">{minutes}</span>
            </div>
          </div>

          {/* Separator */}
          <span className="text-2xl font-bold text-white">:</span>

          {/* Minutes */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-medium text-white bg-white/20 px-3 py-1 rounded-full mb-2">
              SECONDS
            </span>
            <div className="relative w-24 h-24 flex items-center justify-center bg-transparent border-2 border-dashed border-white rounded-2xl shadow-lg">
              <span className="text-3xl font-bold text-white">{seconds}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const tick = (exp: any, setIsExpired: any, setTimeRemaining: any) => {
  const now = moment().tz("Asia/Jakarta");
  const expiry = moment(exp).tz("Asia/Jakarta");
  const diff = expiry.diff(now);

  if (diff <= 0) {
    setIsExpired(true);
    setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    return;
  }

  setIsExpired(false);

  const dur = moment.duration(diff);
  const totalHours = dur.hours() + dur.days() * 24; // Convert days to hours for display if needed
  const days = Math.floor(dur.asDays());
  const hours = dur.hours(); // Remaining hours after days
  const minutes = dur.minutes();
  const seconds = dur.seconds();

  setTimeRemaining({
    days,
    hours,
    minutes,
    seconds,
  });
};
