import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { MIST_PER_SUI } from '@mysten/sui.js/utils';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { Ed25519Keypair, Ed25519PublicKey } from '@mysten/sui.js/keypairs/ed25519';
import { fromB64 } from '@mysten/bcs';
import dotenv from 'dotenv';

async function main() {
    dotenv.config();

    const MY_ADDRESS: string = '0x7e9c3af8f5a75290d10c2dea3004d4928a105e7542240d1cacdfef3899366da1';

    const suiClient: SuiClient = new SuiClient({ url: getFullnodeUrl('testnet') });

    const mistToSui = (balance: string): number => {
        return parseInt(balance) / Number(MIST_PER_SUI);
    };

    const balance = await suiClient.getBalance({
        owner: MY_ADDRESS,
    });

    console.log(`Balance: ${mistToSui(balance.totalBalance)}`)
    const secretKey: string = process.env.SECRET_KEY!;
    const raw = fromB64(secretKey);
    const keypair = Ed25519Keypair.fromSecretKey(raw.slice(1));
    console.log(keypair.getSecretKey())

    const txb = new TransactionBlock();

    txb.moveCall({
        target: '0x79c6d95073d0f09a0151ae30643c325488ad41d7440a23cb8b32fdf3b761baad::monster::mint_to_sender',
        arguments: [txb.pure.string('Justin\'s Monster'), txb.pure.string('Justin\'s Description'), txb.pure.string('Justin\'s Cry')],
    });

    const bytes = await txb.build({ client: suiClient });


    keypair.signTransactionBlock(bytes);
    suiClient.executeTransactionBlock

}

main();