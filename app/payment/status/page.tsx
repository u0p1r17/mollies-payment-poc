'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { PaymentStatusResponse } from '@/types/mollie';

function PaymentStatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlPaymentId = searchParams.get('id');

  const [payment, setPayment] = useState<PaymentStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Déterminer quel ID utiliser
    let paymentId = urlPaymentId;

    // Si l'ID dans l'URL est manquant ou est le placeholder {id},
    // utiliser l'ID du localStorage
    if (!paymentId || paymentId === '{id}') {
      const storedId = localStorage.getItem('lastPaymentId');
      if (storedId) {
        console.log('✅ ID récupéré depuis le localStorage:', storedId);
        paymentId = storedId;
        // Nettoyer le localStorage après utilisation
        localStorage.removeItem('lastPaymentId');
      } else {
        setError('ID de paiement manquant. Veuillez créer un nouveau paiement.');
        setLoading(false);
        return;
      }
    }

    const fetchPaymentStatus = async () => {
      try {
        const response = await fetch(`/api/payments/status?id=${paymentId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors de la récupération du statut');
        }

        setPayment(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentStatus();
  }, [urlPaymentId]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'paid':
        return {
          title: 'Paiement réussi !',
          message: 'Votre paiement a été traité avec succès.',
          icon: '✅',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          textColor: 'text-green-800 dark:text-green-300',
        };
      case 'open':
      case 'pending':
        return {
          title: 'Paiement en attente',
          message: 'Votre paiement est en cours de traitement.',
          icon: '⏳',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          textColor: 'text-yellow-800 dark:text-yellow-300',
        };
      case 'failed':
        return {
          title: 'Paiement échoué',
          message: 'Votre paiement n\'a pas pu être traité.',
          icon: '❌',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          textColor: 'text-red-800 dark:text-red-300',
        };
      case 'canceled':
        return {
          title: 'Paiement annulé',
          message: 'Vous avez annulé le paiement.',
          icon: '🚫',
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
          borderColor: 'border-gray-200 dark:border-gray-700',
          textColor: 'text-gray-800 dark:text-gray-300',
        };
      case 'expired':
        return {
          title: 'Paiement expiré',
          message: 'Le délai de paiement a expiré.',
          icon: '⏰',
          bgColor: 'bg-orange-50 dark:bg-orange-900/20',
          borderColor: 'border-orange-200 dark:border-orange-800',
          textColor: 'text-orange-800 dark:text-orange-300',
        };
      default:
        return {
          title: 'Statut du paiement',
          message: `Statut: ${status}`,
          icon: 'ℹ️',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          textColor: 'text-blue-800 dark:text-blue-300',
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Vérification du statut du paiement...
          </p>
        </div>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Erreur
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {error || 'Impossible de récupérer le statut du paiement'}
            </p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Retour à l accueil
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(payment.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{statusConfig.icon}</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {statusConfig.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {statusConfig.message}
          </p>
        </div>

        <div
          className={`${statusConfig.bgColor} ${statusConfig.borderColor} border rounded-lg p-6 mb-6`}
        >
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                ID de transaction:
              </span>
              <span className="font-mono text-sm text-gray-900 dark:text-white">
                {payment.id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Montant:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {payment.amount.value} {payment.amount.currency}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Description:
              </span>
              <span className="text-gray-900 dark:text-white">
                {payment.description}
              </span>
            </div>
            {payment.paidAt && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Payé le:
                </span>
                <span className="text-gray-900 dark:text-white">
                  {new Date(payment.paidAt).toLocaleString('fr-FR')}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push('/')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Retour à l accueil
          </button>
          {payment.status !== 'paid' && (
            <button
              onClick={() => router.push('/checkout')}
              className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              Réessayer le paiement
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Chargement...
          </p>
        </div>
      </div>
    }>
      <PaymentStatusContent />
    </Suspense>
  );
}
