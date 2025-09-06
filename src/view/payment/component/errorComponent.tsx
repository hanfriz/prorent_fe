export function ErrorMessage({ message }: { message: string }) {
  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="p-4 text-red-500 text-center">{message}</div>
        </div>
      </div>
    </section>
  );
}

export function getErrorDisplayMessage(error: any): string {
  return error instanceof Error
    ? error.message
    : "Failed to load reservation details";
}
