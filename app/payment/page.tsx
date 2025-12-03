"use client";
import { readFromDB } from "@/lib/server-actions";
import { Payment } from "@mollie/api-client";
import React, { useEffect } from "react";
import { Metadata } from "@/lib/types";

type PaymentCustom = Omit<Payment, "metadata"> & {
  metadata: Metadata;
};

export default function Page() {
  const [payments, setPayments] = React.useState<PaymentCustom[]>([]);
  const [filter, setFilter] = React.useState(initFilter());

  function initFilter() {
    return {
      officeId: "",
      tenantId: "",
      productId: "",
    };
  }
  
  useEffect(() => {
    readFromDB().then((data) => {
      setPayments(data);
    });
    //
    return () => {
      setPayments([]);
      setFilter(initFilter());
    };
  }, []);
  
  useEffect(() => {
    readFromDB().then((data) => {
      const tmp = data
        .filter((payment) => {
          return filter.officeId === "0" || ""
            ? payment
            : payment.metadata.officeId.includes(filter.officeId);
        })
        .filter((payment) => {
          return filter.tenantId === "0" || ""
            ? payment
            : payment.metadata.tenantId.includes(filter.tenantId);
        })
        .filter((payment) => {
          return filter.tenantId === "0" || ""
            ? payment
            : payment.metadata.tenantId.includes(filter.tenantId);
        });
      setPayments(tmp);
    });
    //
  }, [filter]);

  const displayPayments = payments.map((payment) => (
    <div key={payment.id} className="border-b border-gray-300 py-4">
      <p>
        <strong>ID:</strong> {payment.id}
      </p>
      <p>
        <strong>Amount:</strong> {payment.amount.value}{" "}
        {payment.amount.currency}
      </p>
      <p>
        <strong>Status:</strong> {payment.status}
      </p>
      <p>
        <strong>Description:</strong> {payment.description}
      </p>
      <p>
        <strong>Office ID:</strong> {payment.metadata.officeId}
      </p>
      <p>
        <strong>Tenant ID:</strong> {payment.metadata.tenantId}
      </p>
      <p>
        <strong>Product ID:</strong> {payment.metadata.productId}
      </p>
    </div>
  ));

  const handleSelectChange = (value: string, subject: string) => {
    setFilter((prev) => ({
      ...prev,
      [subject]: value,
    }));
  };

  return (
    <div>
      <div>
        <label
          htmlFor="officeId"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Office Filter
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
            -- Select Office --
          </option>
          <option value="0">-- All Offices --</option>
          <option value="1">-- Office 1 --</option>
          <option value="2">-- Office 2 --</option>
          <option value="3">-- Office 3 --</option>
        </select>
      </div>
      <div>
        <label
          htmlFor="tenantId"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Tenant Filter
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
            -- Select Tenant --
          </option>
          <option value="0">-- All Tenants --</option>
          <option value="1">-- Tenant 1 --</option>
          <option value="2">-- Tenant 2 --</option>
          <option value="3">-- Tenant 3 --</option>
        </select>
      </div>
      <div>
        <label
          htmlFor="productId"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Product Filter
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
            -- Select Product --
          </option>
          <option value="0">-- All Products --</option>
          <option value="1">-- Product 1 --</option>
          <option value="2">-- Product 2 --</option>
          <option value="3">-- Product 3 --</option>
        </select>
      </div>
      {displayPayments}
    </div>
  );
}
