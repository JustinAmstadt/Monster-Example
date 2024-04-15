import { SuiClient, SuiObjectResponse } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { Inputs } from '@mysten/sui.js/transactions';

export class MonsterModuleManager {
    static readonly PACKAGE_ID = "0x9c971c42ed3ebfa047e18ac85d8c32307add08d542e657458f71768023fbb7cc";

    public static async getMonsterInfo(suiClient: SuiClient, monsterID: string) : Promise<SuiObjectResponse> {
        const object = await suiClient.getObject({ 
            id: monsterID, 
            options: { 
                showContent: true,
            }
        })

        return object;
    }

    public static mint_to_address(txb: TransactionBlock, address: string, name: string, description: string, cry: string) {
        txb.moveCall({
            target: `${MonsterModuleManager.PACKAGE_ID}::monster::mint_to_address`,
            arguments: [txb.pure(address), txb.pure.string(name), txb.pure.string(description), txb.pure.string(cry)]
        });
    }

    public static transfer(txb: TransactionBlock, monsterID: string, monsterDigest: string, monsterVersion: string, address: string) {
        txb.moveCall({
            target: `${MonsterModuleManager.PACKAGE_ID}::monster::transfer`,
            arguments: [
                txb.object(Inputs.ObjectRef( { objectId: monsterID, digest: monsterDigest, version: monsterVersion } )),
                txb.pure(address)
            ]
        });
    }

    public static burn(txb: TransactionBlock, monsterID: string, monsterDigest: string, monsterVersion: string) {
        txb.moveCall({
            target: `${MonsterModuleManager.PACKAGE_ID}::monster::burn`,
            arguments: [txb.object(Inputs.ObjectRef( { objectId: monsterID, digest: monsterDigest, version: monsterVersion } ))]
        });
    }

    public static update_name(txb: TransactionBlock, monsterID: string, monsterDigest: string, monsterVersion: string, newName: string) {
        txb.moveCall({
            target: `${MonsterModuleManager.PACKAGE_ID}::monster::update_name`,
            arguments: [
                txb.object(Inputs.ObjectRef( { objectId: monsterID, digest: monsterDigest, version: monsterVersion } )),
                txb.pure.string(newName)
            ]
        });
    }

    public static update_description(txb: TransactionBlock, monsterID: string, monsterDigest: string, monsterVersion: string, newDescription: string) {
        txb.moveCall({
            target: `${MonsterModuleManager.PACKAGE_ID}::monster::update_description`,
            arguments: [
                txb.object(Inputs.ObjectRef( { objectId: monsterID, digest: monsterDigest, version: monsterVersion } )),
                txb.pure.string(newDescription)
            ]
        });
    }

    public static update_cry(txb: TransactionBlock, monsterID: string, monsterDigest: string, monsterVersion: string, newCry: string) {
        txb.moveCall({
            target: `${MonsterModuleManager.PACKAGE_ID}::monster::update_cry`,
            arguments: [
                txb.object(Inputs.ObjectRef( { objectId: monsterID, digest: monsterDigest, version: monsterVersion } )),
                txb.pure.string(newCry)
            ]
        });
    }
}