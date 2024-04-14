module monster::monster {
    use std::string;
    use sui::object::{Self, ID, UID};
    use sui::event;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    /// An example NFT that can be minted by anybody
    struct Monster has key, store {
        id: UID,
        isOriginal: bool,
        name: string::String,
        description: string::String,
        cry: string::String,
    }

    // ===== Events =====

    struct NFTMinted has copy, drop {
        object_id: ID,
        creator: address,
        name: string::String,
        isOriginal: bool,
    }

    // ===== Public view functions =====

    public fun name(nft: &Monster): &string::String {
        &nft.name
    }

    public fun description(nft: &Monster): &string::String {
        &nft.description
    }

    public fun cry(nft: &Monster): &string::String {
        &nft.cry
    }

    public fun isOriginal(nft: &Monster): &bool {
        &nft.isOriginal
    }

    // ===== Entrypoints =====

    /// Create a new devnet_nft
    public fun mint_to_sender(
        name: string::String,
        description: string::String,
        cry: string::String,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let nft = Monster {
            id: object::new(ctx),
            isOriginal: true,
            name: name,
            description: description,
            cry: cry,
        };

        let mintEvent = NFTMinted {
            object_id: object::id(&nft),
            creator: sender,
            name: nft.name,
            isOriginal: true,
        };

        copy_nft_to_sender(&nft, ctx);

        event::emit(mintEvent);
        transfer::public_transfer(nft, sender);
    }

    fun copy_nft_to_sender(monster: &Monster, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);

        let name: string::String = *name(monster);
        let append: vector<u8> = b" Copy";
        let appendStr: string::String = string::utf8(append);

        string::append(&mut name, appendStr);

        let copyMon = Monster {
            id: object::new(ctx),
            isOriginal: false,
            name: name,
            description: *description(monster),
            cry: *cry(monster),
        };

        let mintEvent = NFTMinted {
            object_id: object::id(&copyMon),
            creator: sender,
            name: copyMon.name,
            isOriginal: false,
        };

        event::emit(mintEvent);
        transfer::public_transfer(copyMon, sender);
    }

    /// Transfer `nft` to `recipient`
    public fun transfer(
        nft: Monster, recipient: address, _: &mut TxContext
    ) {
        transfer::public_transfer(nft, recipient)
    }

    /// Update the `description` of `nft` to `new_description`
    public fun update_description(
        nft: &mut Monster,
        new_description: vector<u8>,
        _: &mut TxContext
    ) {
        nft.description = string::utf8(new_description)
    }

    /// Permanently delete `nft`
    public fun burn(nft: Monster, _: &mut TxContext) {
        let Monster { id, isOriginal: _, name: _, description: _, cry: _, } = nft;
        object::delete(id)
    }
}