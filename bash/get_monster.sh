#!/bin/bash
sui client ptb \
    --move-call 0x9cd22220447b3076c5c7ade08206ed64d0e742f09e83e8389e39aabbdda60ec3::monster::mint_to_sender JustinNFT JustinDescription JustinCry \
    --gas-budget 20000000 \

sui client call --function mint --module mycoin --package <PACKAGE-ID> --args <TREASURY-CAP-ID> <COIN-AMOUNT> <RECIPIENT-ADDRESS> --gas-budget <GAS-AMOUNT>