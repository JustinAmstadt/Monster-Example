#[test_only]
#[allow(lint(self_transfer))]
module monster::monster_tests {
    use monster::monster::{Monster};
    use monster::monster;
    use sui::object::{Self, ID, UID};
    use std::debug;
    use sui::test_scenario;
    use std::vector;
    use std::string;

    const ENotImplemented: u64 = 0;

    #[test]
    fun test_monster() {
        let user1 = @0x1;
        let user2 = @0x2;

        let name: vector<u8> = b"MonsterName";
        let desc: vector<u8> = b"MonsterDesc";
        let cry: vector<u8> = b"MonsterCry";
        let name1: vector<u8> = b"User2 MonsterName";
        let desc1: vector<u8> = b"User2 MonsterDesc";

        let start: vector<u8> = b"Start";
        let finish: vector<u8> = b"Finish";
        let dbStart: string::String = string::utf8(start);
        let dbFinish: string::String = string::utf8(finish);

        let scenario_val = test_scenario::begin(user1);
        let scenario = &mut scenario_val;

        {
            monster::mint_to_sender(string::utf8(name), string::utf8(desc), string::utf8(cry), test_scenario::ctx(scenario));
        };

        test_scenario::next_tx(scenario, user1);
        {
            debug::print(&dbStart);
            let ids: vector<ID> = test_scenario::ids_for_sender<Monster>(scenario);
            let length = vector::length<ID>(&ids);
            let i = 0;

            while(i < length) {
                let monster: Monster = test_scenario::take_from_sender<Monster>(scenario);
                debug::print(monster::name(&monster));
                debug::print(monster::description(&monster));
                debug::print(monster::cry(&monster));
                debug::print(monster::isOriginal(&monster));
                test_scenario::return_to_address(user1, monster);
                i = i + 1;
            };
            debug::print(&dbFinish);
        };

        test_scenario::next_tx(scenario, user2);
        {
            monster::mint_to_sender(string::utf8(name1), string::utf8(desc1), string::utf8(cry), test_scenario::ctx(scenario));
        };

        test_scenario::next_tx(scenario, user2);
        {
            let monster = test_scenario::take_from_sender<Monster>(scenario);
            monster::transfer(monster, user1, test_scenario::ctx(scenario));
        };

        test_scenario::next_tx(scenario, user1);
        {
            debug::print(&dbStart);
            let ids: vector<ID> = test_scenario::ids_for_sender<Monster>(scenario);
            let length = vector::length<ID>(&ids);
            let i = 0;

            while(i < length) {
                let monster: Monster = test_scenario::take_from_sender<Monster>(scenario);
                debug::print(monster::name(&monster));
                debug::print(monster::description(&monster));
                debug::print(monster::cry(&monster));
                debug::print(monster::isOriginal(&monster));
                test_scenario::return_to_address(user1, monster);
                i = i + 1;
            };
            debug::print(&dbFinish);
        };

        test_scenario::end(scenario_val);
    }

    #[test, expected_failure(abort_code = monster::monster_tests::ENotImplemented)]
    fun test_monster_fail() {
        abort ENotImplemented
    }
}