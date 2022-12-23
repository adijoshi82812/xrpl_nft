const xrpl = require("xrpl");

const mint = async () => {
    try {
        const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
        await client.connect();

        const fundWallet = await client.fundWallet();
        const wallet = xrpl.Wallet.fromSeed(fundWallet.wallet.seed);

        const transactionBlob = {
            Account: wallet.address,
            TransactionType: "NFTokenMint",
            URI: xrpl.convertStringToHex("http://localhost:8080"),
            Flags: 8,
            TransferFee: 50000,
            NFTokenTaxon: 0
        };

        await client.submitAndWait(transactionBlob, {wallet: wallet});
        const nfts = await client.request({
            account: wallet.address,
            method: "account_nfts"
        });

        console.log(nfts);

        client.disconnect();
    } catch(err) {
        console.log(err);
    }
};

mint();