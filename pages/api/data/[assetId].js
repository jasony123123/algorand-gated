import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'

export default async function handler(req, res) {
    const { assetId } = req.query
    console.log("--------------", assetId);
    await (async () => {
        const algosdk = require('algosdk');
        const algodToken = "";
        const algodServer = "https://testnet-idx.algonode.cloud/";
        const algodPort = "";
        const indexer = new algosdk.Indexer(algodToken, algodServer, algodPort);
        const db = new JsonDB(new Config("myDB", false, true, '/'));

        let assetBalances = await indexer.lookupAssetBalances(assetId).do();
        let assetHolders = assetBalances["balances"].filter(e => e["amount"] != '0').map(e => e['address']);
        console.log(assetHolders);

        let yesCount = 0, noCount = 0;
        try {
            await db.getData(`/${assetId}`);
        } catch (error) {
            db.push(`/${assetId}`, {});
            db.save();
        };
        let voting = await db.getData(`/${assetId}`);
        for (const [key, value] of Object.entries(voting)) {
            console.log(`${key}: ${value}`);
            if (value === 'Yes') yesCount++;
            else if (value == 'No') noCount++;
        }

        return res.json({
            holders: assetHolders,
            yesCount: yesCount,
            noCount: noCount,
            abstainCount: assetHolders.length - yesCount - noCount,
        });
    })().catch(e => {
        console.log('------ ERROR ------')
        console.log(e);
        console.trace();
        res.status(500).end();
    });
}