"use client";
import { useEffect, useState, useCallback } from "react";
import { PaymentCustom } from "@/lib/types";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export default function Page() {
  const [payments, setPayments] = useState<PaymentCustom[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(initFilter());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);

  function initFilter() {
    return {
      officeId: "0",
      tenantId: "0",
      productId: "0",
    };
  }

  const getAllFilteredPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/mollie/payments/getAll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...filter,
          page: currentPage,
          limit: pageSize,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch payments");
      }
      const data = await response.json();
      console.log("Fetched payments:", data);
      setPayments(data.data);
      setPagination(data.pagination);
      setLoading(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setError("Failed to fetch payments" + message);
    } finally {
      setLoading(false);
    }
  }, [filter, currentPage, pageSize]);

  useEffect(() => {
    getAllFilteredPayments();
  }, [getAllFilteredPayments]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [filter]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { bg: string; text: string; label: string }
    > = {
      paid: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-400",
        label: "Payé",
      },
      open: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-400",
        label: "En attente",
      },
      pending: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-700 dark:text-yellow-400",
        label: "En cours",
      },
      failed: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-400",
        label: "Échoué",
      },
      canceled: {
        bg: "bg-gray-100 dark:bg-gray-700",
        text: "text-gray-700 dark:text-gray-400",
        label: "Annulé",
      },
      expired: {
        bg: "bg-orange-100 dark:bg-orange-900/30",
        text: "text-orange-700 dark:text-orange-400",
        label: "Expiré",
      },
    };

    const config = statusConfig[status] || statusConfig.open;
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const displayPayments = payments.map((payment) => (
    <div
      key={payment.id}
      className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition duration-200"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              📅 {formatDate(payment.createdAt)}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            ID de transaction
          </p>
          <p className="font-mono text-sm text-gray-900 dark:text-white">
            {payment.id}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {getStatusBadge(payment.status)}
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {payment.amount.value} {payment.amount.currency}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Description
          </p>
          <p className="text-sm text-gray-900 dark:text-white">
            {payment.description}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Bureau
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {payment.metadata.officeId}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Locataire
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {payment.metadata.tenantId}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Produit
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {payment.metadata.productId}
            </p>
          </div>
        </div>
      </div>
    </div>
  ));

  const handleSelectChange = (value: string, subject: string) => {
    setFilter((prev) => ({
      ...prev,
      [subject]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gestion des paiements
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Consultez et filtrez tous vos paiements Mollie
          </p>
        </div>

        {/* Filtres */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Filtres
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="officeId"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Bureau
              </label>
              <select
                required
                name="officeId"
                id="officeId"
                onChange={(e) => handleSelectChange(e.target.value, "officeId")}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                value={filter.officeId ?? "no_selection"}
              >
                <option value="no_selection" disabled>
                  -- Sélectionner un bureau --
                </option>
                <option value="0">-- Tous les bureaux --</option>
                <option value="1">-- Bureau 1 --</option>
                <option value="2">-- Bureau 2 --</option>
                <option value="3">-- Bureau 3 --</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="tenantId"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Locataire
              </label>
              <select
                required
                name="tenantId"
                id="tenantId"
                onChange={(e) => handleSelectChange(e.target.value, "tenantId")}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                value={filter.tenantId ?? "no_selection"}
              >
                <option value="no_selection" disabled>
                  -- Sélectionner un locataire --
                </option>
                <option value="0">-- Tous les locataires --</option>
                <option value="1">-- Locataire 1 --</option>
                <option value="2">-- Locataire 2 --</option>
                <option value="3">-- Locataire 3 --</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="productId"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Produit
              </label>
              <select
                required
                name="productId"
                id="productId"
                onChange={(e) => handleSelectChange(e.target.value, "productId")}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                value={filter.productId ?? "no_selection"}
              >
                <option value="no_selection" disabled>
                  -- Sélectionner un produit --
                </option>
                <option value="0">-- Tous les produits --</option>
                <option value="1">-- Produit 1 --</option>
                <option value="2">-- Produit 2 --</option>
                <option value="3">-- Produit 3 --</option>
              </select>
            </div>
          </div>
        </div>

        {/* Résultats */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          {/* Stats et contrôles de pagination */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Résultats ({pagination?.total ?? 0})
              </h2>
              {pagination && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Affichage de {(pagination.page - 1) * pagination.limit + 1} à{" "}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} sur{" "}
                  {pagination.total} paiements
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                Par page:
              </label>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* Liste des paiements */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Chargement des paiements...
              </p>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Aucun paiement trouvé
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayPayments}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  disabled={!pagination.hasPreviousPage || loading}
                  className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold transition duration-200 ${
                    !pagination.hasPreviousPage || loading
                      ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  }`}
                >
                  ← Précédent
                </button>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      const current = pagination.page;
                      return (
                        page === 1 ||
                        page === pagination.totalPages ||
                        (page >= current - 2 && page <= current + 2)
                      );
                    })
                    .map((page, index, array) => {
                      const prevPage = array[index - 1];
                      const showEllipsis = prevPage && page - prevPage > 1;

                      return (
                        <div key={page} className="flex items-center gap-2">
                          {showEllipsis && (
                            <span className="text-gray-500 dark:text-gray-400 px-2">
                              ...
                            </span>
                          )}
                          <button
                            onClick={() => setCurrentPage(page)}
                            disabled={loading}
                            className={`min-w-[40px] px-3 py-2 rounded-lg font-medium transition duration-200 ${
                              page === pagination.page
                                ? "bg-blue-600 text-white shadow-lg"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {page}
                          </button>
                        </div>
                      );
                    })}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={!pagination.hasNextPage || loading}
                  className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold transition duration-200 ${
                    !pagination.hasNextPage || loading
                      ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  }`}
                >
                  Suivant →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
