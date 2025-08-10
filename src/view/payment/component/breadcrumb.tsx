import { CheckCircle } from "lucide-react";

export default function Breadcrumb() {
  return (
    <>
      <ol className="flex w-full items-center text-center text-sm font-medium text-gray-500 dark:text-gray-400 sm:text-base">
        <li className="after:border-1 flex items-center text-primary-600 after:mx-4 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 dark:text-primary-500 dark:after:border-gray-700 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-4">
          <span className="flex items-center whitespace-nowrap after:mx-2 after:text-gray-200 after:content-['/'] dark:after:text-gray-500 sm:after:hidden">
            <CheckCircle className="me-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Cart
          </span>
        </li>

        <li className="after:border-1 flex items-center text-primary-600 after:mx-4 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 dark:text-primary-500 dark:after:border-gray-700 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-4">
          <span className="flex items-center whitespace-nowrap after:mx-2 after:text-gray-200 after:content-['/'] dark:after:text-gray-500 sm:after:hidden">
            <CheckCircle className="me-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Checkout
          </span>
        </li>

        <li className="after:border-1 hidden items-center text-primary-600 after:mx-4 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 dark:text-primary-500 dark:after:border-gray-700 sm:flex sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-4">
          <span className="flex items-center whitespace-nowrap after:mx-2 after:text-gray-200 after:content-['/'] dark:after:text-gray-500 sm:after:hidden">
            <CheckCircle className="me-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Order summary
          </span>
        </li>

        <li className="flex items-center text-primary-600 dark:text-primary-500">
          <CheckCircle className="me-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Payment
        </li>
      </ol>
    </>
  );
}
