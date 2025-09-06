export default function RightColumn(props: {
  displayData: any;
  nights: any;
  estimatedTotal: any;
}) {
  return (
    <aside className="md:col-span-1">
      <div className="sticky mt-[3.45rem] space-y-6">
        <div className="bg-white rounded-2xl p-5 shadow-pr-soft border">
          <div className="flex items-start gap-3">
            <div className="w-24 h-16 rounded-lg bg-gray-100 overflow-hidden">
              {props.displayData.mainImageUrl ? (
                // Next/Image optional
                <img
                  src={props.displayData.mainImageUrl}
                  alt={props.displayData.propertyName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-pr-dark">
                {props.displayData.propertyName || "Nama Properti"}
              </h3>
              <p className="text-sm text-gray-500">
                {props.displayData.propertyType || "-"}
              </p>
              <p className="mt-2 text-sm text-pr-mid font-medium">
                {props.displayData.roomTypeName || "-"}
              </p>
            </div>
          </div>

          <div className="mt-4 border-t pt-3 text-sm space-y-2">
            <div className="flex justify-between">
              <span>Per malam</span>
              <span className="font-medium">
                {props.displayData.basePrice
                  ? `Rp ${props.displayData.basePrice.toLocaleString()}`
                  : "Rp -"}{" "}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Durasi</span>
              <span>{props.nights} malam</span>
            </div>
            <div className="flex justify-between text-pr-dark font-semibold">
              <span>Total estimasi</span>
              <span>Rp {props.estimatedTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-pr-soft border">
          <h4 className="text-sm font-medium mb-2 text-pr-dark">Catatan</h4>
          <p className="text-xs text-gray-600">
            Pastikan tanggal yang dipilih sudah benar. Total akan divalidasi
            pada saat checkout.
          </p>
        </div>

        <div className="bg-gradient-to-r from-pr-primary to-pr-mid rounded-xl p-3 text-white text-center">
          <div className="text-sm font-medium">Butuh bantuan?</div>
          <div className="text-xs mt-1">Hubungi support@prorent.id</div>
        </div>
      </div>
    </aside>
  );
}
