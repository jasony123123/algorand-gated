import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'

var db = new JsonDB(new Config("myDB", false, true, '/'));

export default function handler(req, res) {
  const body = req.body
  console.log('body: ', body)

  if (!body.wallet || !body.asset || !body.vote) {
    return res.json({ data: 'bad' })
  }

  db.push(`/${body.asset}/${body.wallet}/`, body.vote)
  db.save()
  return res.json({ data: `${body.wallet} ${body.asset} ${body.vote}` })
}
