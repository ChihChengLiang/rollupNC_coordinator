import utils from './utils';
import config from '../config/config.js';
import logger from './logger';
import knex from '../DB/dbClient'
import db from './db'

const q = global.gConfig.tx_queue;
const maxTxs = global.gConfig.txs_per_snark;

// empties queue after validation check 
// dumps valid transactions in `mempool` table
// makes querying easier.
export default class Mempool {
  async StartSync() {
    let conn = await utils.getConn();
    let ch = await conn.createChannel();
    let res = await ch.assertQueue(q, { durable: true });

    ch.consume(q, async msg => {
      var depositCount = await db.getDepositCount()
      console.log("Total deposits in mempool", depositCount)
      var deposit = utils.JSON2Deposit(msg.content)
      var res = await deposit.save()
      logger.info("Adding deposit to mempool", { deposit: msg.content.toString() });
    }, { noAck: true });
  }

}

