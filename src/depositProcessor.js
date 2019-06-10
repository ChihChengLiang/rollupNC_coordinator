import utils from './utils';
import logger from './logger';
import createProof from './circuit';
import db from './db';
import ProcessedTx from './processed_tx.js'
import Update from './update.js'
const web3 = require('web3')

const CONTRACT_ADDRESS = global.gConfig.contractAddress
const CONTRACT_ABI = global.gConfig.contractABI
var queue_number

/*
TODO: 

deposits
0. every t seconds, read deposits from deposit queue in smart contract
1. when there are n deposits OR when timeout is reached, process deposits
    1a. if there are fewer than n deposits, where n is maxQueueSize, pad to n 
2. insert deposits into balance tree at the lowest empty multiple of n
3. hash subtree of new deposits
4. get subtree Merkle proof


*/

export class DepositProcessor{
    async start(poller) {
        logger.info("starting deposit processor", { pollingInterval: poller.timeout })
        poller.poll()
        poller.onPoll(() => {
          fetchDeposits()
          poller.poll(); // Go for the next poll
        });
    }
}

async function fetchDeposits() {

}