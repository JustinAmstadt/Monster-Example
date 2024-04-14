import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { MIST_PER_SUI } from '@mysten/sui.js/utils';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { Ed25519Keypair, Ed25519PublicKey } from '@mysten/sui.js/keypairs/ed25519';
import { SuiTransactionBlockResponse } from '@mysten/sui.js/client';
import { fromB64 } from '@mysten/bcs';
import dotenv from 'dotenv';
import { send } from 'process';

const PACKAGE_ID = "0x9cd22220447b3076c5c7ade08206ed64d0e742f09e83e8389e39aabbdda60ec3";

function getKeypairFromPrivateKey(key: string) {
    const raw = fromB64(key);
    return Ed25519Keypair.fromSecretKey(raw.slice(1));
}

async function monster_mint_to_sender(
        suiClient: SuiClient, 
        keypair: Ed25519Keypair, 
        gasPrice: number, 
        gasBudget: number, 
        name: string, 
        description: string, 
        cry: string) : Promise<SuiTransactionBlockResponse> {
    const pk = keypair.getPublicKey();
    const sender = pk.toSuiAddress();

    const txb = new TransactionBlock();
    txb.setSender(sender);
    txb.setGasPrice(gasPrice);
	txb.setGasBudget(gasBudget);

    txb.moveCall({
        target: `${PACKAGE_ID}::monster::mint_to_sender`,
        arguments: [txb.pure.string(name), txb.pure.string(description), txb.pure.string(cry)],
    });

    const bytes = await txb.build({ client: suiClient });
    const serializedSignature = (await keypair.signTransactionBlock(bytes)).signature;

    keypair.signTransactionBlock(bytes);
    const response = suiClient.executeTransactionBlock({
        transactionBlock: bytes,
        signature: serializedSignature
    })

    return response;
}

async function main() {
    dotenv.config();

    const secretKey: string = process.env.SECRET_KEY!;
    const keypair: Ed25519Keypair = getKeypairFromPrivateKey(secretKey);

    const suiClient: SuiClient = new SuiClient({ url: getFullnodeUrl('testnet') });
    let response = await suiClient.getOwnedObjects({ owner: keypair.getPublicKey().toSuiAddress() })
    response.data.forEach(obj => console.log(obj));

    let response1 = await suiClient.getObject({ id: "0xcef621c7cc6275a1fc918ef78c24f1a16e59025c68e992354353e82c136ec4e0"})  
    console.log(response1)

    // await monster_mint_to_sender(suiClient, keypair, 1000, 100000000);
}

main();