import { readFromDB } from "@/lib/server-actions";
import { PaymentCustom } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<PaginatedResponse<PaymentCustom>>> {
  const req: {
    officeId: string;
    tenantId: string;
    productId: string;
    page?: number;
    limit?: number;
  } = await request.json();

  const page = req.page && req.page > 0 ? req.page : 1;
  const limit = req.limit && req.limit > 0 ? req.limit : 10;

  const response: PaymentCustom[] = await readFromDB();
  const filteredResponse = response
    .filter((payment) => {
      return req.officeId === "0" || req.officeId === ""
        ? payment
        : payment.metadata.officeId === req.officeId;
    })
    .filter((payment) => {
      return req.tenantId === "0" || req.tenantId === ""
        ? payment
        : payment.metadata.tenantId === req.tenantId;
    })
    .filter((payment) => {
      return req.productId === "0" || req.productId === ""
        ? payment
        : payment.metadata.productId === req.productId;
    });

  const total = filteredResponse.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedData = filteredResponse.slice(startIndex, endIndex);

  const paginatedResponse: PaginatedResponse<PaymentCustom> = {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };

  return NextResponse.json(paginatedResponse);
}
