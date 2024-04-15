module monster::monster {
    use std::string;
    use sui::event;

    /// An example NFT that can be minted by anybody
    public struct Monster has key, store {
        id: UID,
        isOriginal: bool,
        name: string::String,
        description: string::String,
        cry: string::String,
    }

    // ===== Events =====

    public struct NFTMinted has copy, drop {
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
    public fun mint_to_address(
        recipient: address,
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

        copy_nft_to_address(recipient, &nft, ctx);

        event::emit(mintEvent);
        transfer::public_transfer(nft, recipient);
    }

    /// Transfer `nft` to `recipient`
    public fun transfer(
        nft: Monster, recipient: address, _: &mut TxContext
    ) {
        transfer::public_transfer(nft, recipient)
    }

    public fun update_name(
        nft: &mut Monster,
        new_name: string::String,
        _: &mut TxContext
    ) {
        nft.name = new_name;
    }

    public fun update_description(
        nft: &mut Monster,
        new_description: string::String,
        _: &mut TxContext
    ) {
        nft.description = new_description;
    }

    public fun update_cry(
        nft: &mut Monster,
        new_cry: string::String,
        _: &mut TxContext
    ) {
        nft.cry = new_cry;
    }

    /// Permanently delete `nft`
    public fun burn(nft: Monster, _: &mut TxContext) {
        let Monster { id, isOriginal: _, name: _, description: _, cry: _, } = nft;
        object::delete(id)
    }

    // ===== Private Functions =====

    /// Creates a copy of the monster and sets isOriginal to false
    fun copy_nft_to_address(recipient: address, monster: &Monster, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);

        let mut name: string::String = *name(monster);
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
        transfer::public_transfer(copyMon, recipient);
    }
}