import { NextRequest, NextResponse } from "next/server";
import { createZGComputeNetworkBroker } from "@0glabs/0g-serving-broker";
import { ethers } from "ethers";

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();
    console.log("Received question:", question);

    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    const broker = await createZGComputeNetworkBroker(wallet);

    const ledgerInfo = await broker.ledger.getLedger();
    console.log("Ledger info before deposit:", ledgerInfo);
    const depositAmount = 1.0;
    console.log("Depositing:", depositAmount, "ETH");

    try {
      await broker.ledger.depositFund(depositAmount);
      console.log("Deposit successful");
    } catch (depositError: any) {
      console.error("Deposit failed:", depositError);
      return NextResponse.json(
        {
          error:
            "Failed to deposit funds: " +
            (depositError?.message || "Unknown error"),
        },
        { status: 500 }
      );
    }

    const updatedLedger = await broker.ledger.getLedger();
    console.log("Ledger info after deposit:", updatedLedger);

    const services = await broker.inference.listService();
    console.log("Available services:", services);

    await broker.inference.acknowledgeProviderSigner(process.env.PROVIDER_API!);

    const { endpoint, model } = await broker.inference.getServiceMetadata(
      process.env.PROVIDER_API!
    );
    console.log("Service metadata:", { endpoint, model });

    // headers
    const headers = await broker.inference.getRequestHeaders(
      process.env.PROVIDER_API!,
      question
    );

    // send inference request
    const response = await fetch(`${endpoint}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: question }],
      }),
    });

    const text = await response.text();
    console.log("Raw response text:", text);
    return NextResponse.json(JSON.parse(text), { status: 200 });
  } catch (error: any) {
    console.error("Error in request:", error);
    const errorMessage = error?.message || "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
