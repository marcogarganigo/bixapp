'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'sonner';
import Image from 'next/image';
import { loginUserApi } from '@/utils/auth';
import LoadingComp from '@/components/loading';
import axiosInstanceClient from '@/utils/axiosInstanceClient';

export default function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const getCsrfToken = async () => {
    const payload = {
      apiRoute: 'getCsrf',
    }; // Define payload as an empty object or with required data
    const response = await axiosInstanceClient.post('/postApi/', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: false,
    });
    const data = await response.data;
    return data.csrftoken;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const csrfToken = await getCsrfToken();
    const result = await loginUserApi(username, password);
    if (result.success) {
      router.push('/home');
    } else {
      setIsLoading(false);
      toast.error(result.detail || 'Errore durante il login');
    }
  };

  return (
    <>
      <Toaster richColors position='top-center' />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white">
        <div className="block sm:mx-auto sm:w-full sm:max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-white-800 dark:border-gray-200 mx-auto">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <Image
              src={`/imgs/swissbix.png`}
              alt="SwissBix Logo"
              width={1000}
              height={1000}
              className="h-14 w-auto mx-auto bg-white"
              priority
            />
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Username
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="on"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-bixcolor-light sm:text-sm/6 p-4"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="on"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-bixcolor-light sm:text-sm/6 p-4"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-gray-600 focus:bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm"
                >
                  Accedi
                </button>
              </div>
            </form>
            <div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          {isLoading && <LoadingComp />}
        </div>
      </div>
    </>
  );
}