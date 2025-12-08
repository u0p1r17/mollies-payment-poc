"use server";
import fs from "fs";
import path from "path";
import { Payment } from "@mollie/api-client";
import { mollieGetAllPayments } from "./mollie";
import { Metadata } from "./types";

export async function createPayment(formData: FormData) {
console.log(formData);

  // const validatedForm: {
  //   amount: string;
  //   firstname: string;
  //   lastname: string;
  //   company?: string;
  //   email: string;
  //   address: string;
  //   city: string;
  //   zipCode: string;
  //   country: string;
  //   metadata: Metadata;
  // } = await validateFormData(formData);

  // const mollieRedirectUrl: string | null = await mollieCreatePayment(
  //   validatedForm
  // );

  // if (!mollieRedirectUrl) {
  //   throw new Error("Failed to create Mollie payment");
  // }

  // const validatedRedirectUrl = await validateUrl(mollieRedirectUrl);

  // redirect(validatedRedirectUrl);
}

// export async function validateForm(formData: FormData) {
//   const validatedForm = await validateFormData(formData);
//   return validatedForm;
// }


export async function updatePaymentFromDB(payment: Payment) {
  const dbPath = path.join(process.cwd(), "DB", "payment.json");
  const fileContent = fs.readFileSync(dbPath, "utf-8");
  const db = JSON.parse(fileContent);
  const paymentIndex = db.payments.findIndex(
    (p: { id: string }) => p.id === payment.id
  );

  if (paymentIndex !== -1) {
    db.payments[paymentIndex] = payment;
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
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
