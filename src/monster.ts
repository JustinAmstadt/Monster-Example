import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { Ed25519Keypair, Ed25519PublicKey } from '@mysten/sui.js/keypairs/ed25519';
import { SuiTransactionBlockResponse } from '@mysten/sui.js/client';
import { fromB64 } from '@mysten/bcs';
import dotenv from 'dotenv';
import { MonsterModuleManager } from './MonsterModuleManager';
import { PTBManager } from './PTBManager';

const PACKAGE_ID = "0x9cd22220447b3076c5c7ade08206ed64d0e742f09e83e8389e39aabbdda60ec3";

function getKeypairFromPrivateKey(key: string) {
    const raw = fromB64(key);
    return Ed25519Keypair.fromSecretKey(raw.slice(1));
}

async function main() {
    dotenv.config();
    
    const secretKey: string = process.env.SECRET_KEY!;
    const keypair: Ed25519Keypair = getKeypairFromPrivateKey(secretKey);

    const suiClient: SuiClient = new SuiClient({ url: getFullnodeUrl('testnet') });
    let objList = await suiClient.getOwnedObjects({ owner: keypair.getPublicKey().toSuiAddress() })
    // objList.data.forEach(obj => console.log(obj));

    const pk = keypair.getPublicKey();
    const sender = pk.toSuiAddress();

    const monsterID = "0xf38697d448125874581ed4a1d5653beeee5b4ea6e8950f7752f244cd22031b6f";

    const monsterInfo = await MonsterModuleManager.getMonsterInfo(suiClient, monsterID);
    console.log(monsterInfo.data?.content);

    const manager = new PTBManager(suiClient);
    manager.initTransaction(sender, 1000, 100000000);
    // MonsterModuleManager.burn(manager.txb, monsterInfo.data?.objectId!, monsterInfo.data?.digest!, monsterInfo.data?.version!);
    MonsterModuleManager.update_name(manager.txb, monsterID, monsterInfo.data?.digest!, monsterInfo.data?.version!, "Justin's Monster Copy Updated");
    // MonsterModuleManager.mint_to_address(manager.txb, sender, "test2", "desctest2", "crytest2");
    const response = await manager.executeTransaction(keypair);
    console.log(response);

    //console.log(await suiClient.getTransactionBlock({ digest: response.digest, options: { showEffects: true } }));
}

main();