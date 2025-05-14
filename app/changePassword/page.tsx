'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'sonner';
import axios from 'axios';
import LoadingComp from '@/components/loading';
import axiosInstanceClient from '@/utils/axiosInstanceClient';
import Image from 'next/image';

const ChangePasswordForm = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  interface HandleSubmitEvent extends React.FormEvent<HTMLFormElement> {}

  const handleSubmit = async (e: HandleSubmitEvent): Promise<void> => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Le password non coincidono');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('La nuova password deve essere lunga almeno 8 caratteri');
      return;
    }

    setIsLoading(true);
    changePassword();
  };

  const changePassword = async () => {
    try {
      console.info('Cambio password in corso...');
      
      const response = await axiosInstanceClient.post("/postApi", {
        apiRoute: "changePassword",
        old_password: oldPassword,
        new_password: newPassword,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
    
      toast.success(response.data.message);
      setIsLoading(false);
      router.push('/login');
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        toast.error("Errore nel cambio della password: " + error.response?.data?.message);
      } else {
        toast.error("Errore nella verifica della password");
      }
    }
  };

  return (
    <>
      <Toaster position='top-center' richColors />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white">
        <div className="block sm:mx-auto sm:w-full sm:max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-white-800 dark:border-gray-200 mx-auto">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <Image
              src={`/imgs/swissbix.png`}
              alt="Swissbix Logo"
              width={1000}
              height={1000}
              className="h-14 w-auto mx-auto bg-white"
              priority
            />
            <h2 className="mt-6 text-center text-xl font-bold leading-9 tracking-tight text-gray-900">
              Cambia Password
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm/6 font-medium text-gray-900">
                  Password Attuale
                </label>
                <div className="mt-2">
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-bixcolor-light sm:text-sm/6 p-4"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm/6 font-medium text-gray-900">
                  Nuova Password
                </label>
                <div className="mt-2">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-bixcolor-light sm:text-sm/6 p-4"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm/6 font-medium text-gray-900">
                  Conferma Nuova Password
                </label>
                <div className="mt-2">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-bixcolor-light sm:text-sm/6 p-4"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-gray-600 focus:bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm"
                  disabled={isLoading}
                >
                  Cambia Password
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-6">
          {isLoading && <LoadingComp />}
        </div>
      </div>
    </>
  );
};

export default ChangePasswordForm;