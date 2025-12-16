"use server";
import fs from "fs";
import path from "path";
import { Payment } from "@mollie/api-client";
import { mollieGetAllPayments } from "./mollie";
import { Metadata } from "./types";

export async function updatePaymentFromDB(payment: Payment) {
  const dbPath = path.join(process.cwd(), "DB", "payment.json");
  const fileContent = fs.readFileSync(dbPath, "utf-8");
  const db = JSON.parse(fileContent);
  const paymentIndex = db.payments.findIndex(
    (p: { id: string }) => p.id === payment.id
  );

  if (paymentIndex !== -1) {
    throw new Error("Payment not found in DB");
    // db.payments[paymentIndex] = payment;
    // fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  }
}

export async function addToDB(payload: string) {
  const dbPath = path.join(process.cwd(), "DB", "payment.json");
  const fileContent = fs.readFileSync(dbPath, "utf-8");
  const db = JSON.parse(fileContent);
  const newPayment = JSON.parse(payload);

  db.payments.push(newPayment);

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

export async function readFromDB(): Promise<PaymentCustom[]> {
  const dbPath = path.join(process.cwd(), "DB", "payment.json");
  const data = fs.readFileSync(dbPath, "utf-8");
  const db = JSON.parse(data);
  return db.payments satisfies PaymentCustom[];
}

export async function syncronizePaymentsWithMollie() {
  const dbPath = path.join(process.cwd(), "DB", "payment.json");
  const dbPayments = await readFromDB();
  const molliePayments = await mollieGetAllPayments();
  const newPayments = molliePayments.filter(
    (molliePayment) =>
      !dbPayments.some(
        (dbPayment: PaymentCustom) => dbPayment.id === molliePayment.id
      )
  );

  if (newPayments.length > 0) {
    const fileContent = fs.readFileSync(dbPath, "utf-8");
    const db = JSON.parse(fileContent);

    db.payments.push(...newPayments);

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  }

  return newPayments.length;
}

type PaymentCustom = Omit<Payment, "metadata"> & {
  metadata: Metadata;
};
