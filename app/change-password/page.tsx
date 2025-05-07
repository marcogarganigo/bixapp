'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axiosInstance from '@/utils/axiosInstance';
import { toast, Toaster } from 'sonner';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import LoadingComp from '@/components/loading';
import axiosInstanceClient from '@/utils/axiosInstanceClient';

const ChangePasswordForm = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    // Validazione lato client
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
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        toast.error("Errore nel cambio della password: " + error.response?.data?.message);
      } else {
        toast.error("Errore nella verifica della password");
      }
    }
  };

  // Utility per ottenere il CSRF token dai cookie
  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <Toaster position='top-center' richColors />
      <Card className="w-full max-w-sm shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-center">Cambia Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium block">Password Attuale</label>
              <Input  
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className="h-10 text-base"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium block">Nuova Password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="h-10 text-base"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium block">Conferma Nuova Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-10 text-base"
              />
            </div>

            <Button 
              type="submit"
              className="w-full text-white bg-bixcolor-default hover:bg-bixcolor-light mt-4 h-12 text-base font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Elaborazione...' : 'Cambia Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
      {isLoading && (
        <div className="mt-4">
          <LoadingComp />
        </div>
      )}
    </div>
  );
};

export default ChangePasswordForm;