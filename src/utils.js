import amqp from 'amqplib';
import mimcjs from '../circomlib/src/mimc7.js';
import eddsa from '../circomlib/src/eddsa.js';
import logger from './logger.js'
import account from "./snark_utils/generate_accounts.js"
import merkle from "./snark_utils/MiMCMerkle.js"
import balance from "./snark_utils/generate_balance_leaf.js"
import tx from "./snark_utils/generate_tx_leaf.js"
import update from "./snark_utils/update.js"
import Account from "./account.js"
import Transaction from './transaction.js';
const {stringifyBigInts, unstringifyBigInts} = require('./snark_utils/stringifybigint.js')


import path from 'path'
import Promise from 'bluebird';
import db from './db.js';
const fs = Promise.promisifyAll(require('fs'));

const bigInt = require("snarkjs").bigInt;

const TX_DEPTH = global.gConfig.tx_depth;
const BAL_DEPTH = global.gConfig.balance_depth;
const genPath = path.join(__dirname, '../config/genesis.json')

var conn = null;

// use existing connection is available 
// else create new conn
async function getConn() {
  if (conn === null) {
    conn = await amqp.connect(global.gConfig.amqp);
  }
  return conn;
}

// convert a leaf to multiHash hash 
function toMultiHash(fromX, fromY, toX, toY, amount, token) {
  var leafHash = mimcjs.multiHash([
    bigInt(fromX), bigInt(fromY), bigInt(toX), bigInt(toY), bigInt(amount), bigInt(token)
  ])
  return leafHash
}

function checkSignature(tx, fromX, fromY, signature) {
  return eddsa.verifyMiMC(tx, signature,
    [bigInt(fromX), bigInt(fromY)])
}


function toSignature(R1, R2, S) {
  var sig = {
    "R8": [R1, R2],
    "S": S
  }
  // logger.debug("conversion to SIG(obj) successfull", { sig: sig })
  return sig
}

async function getTransactionArray(txs) {
  var fromX = new Array()
  var fromY = new Array()
  var toX = new Array()
  var toY = new Array()
  var tokenTypes = new Array()
  var amounts = new Array()
  var signatures = new Array()
  // logger.debug("Prepping inputs to snark for given transactions")
  // txs = txs[0]
  for (var i = 0; i < txs.length; i++) {
    // logger.debug("traversing", { index: i, len: txs.length, transaction: txs[i] })
    fromX.push(txs[i].fromX)
    fromY.push(txs[i].fromY)
    toX.push(txs[i].toX)
    toY.push(txs[i].toY)
    // collect amounts
    amounts.push(txs[i].amount)
    // collect token types
    tokenTypes.push(txs[i].tokenType)
    // collect sigs
    signatures.push(txs[i].signature)
  }
  return [fromX, fromY, toX, toY, tokenTypes, signatures, amounts]
}

async function prepTxs(txs) {
  var [fromX, fromY, toX, toY, tokenTypes, signatures, amounts] = await getTransactionArray(txs)
  const txArray = await tx.generateTxLeafArray(fromX, fromY, toX, toY, amounts, tokenTypes)

  var accountsArray = await db.getAllAccounts()
  var from_accounts_idx = [1, 2, 1, 3]
  var to_accounts_idx = [2, 0, 3, 2]
  const inputs = update.processTxArray(
    TX_DEPTH,
    fromX,
    fromY,
    toX,
    toY,
    accountsArray,
    from_accounts_idx,
    to_accounts_idx,
    amounts,
    tokenTypes,
    signatures
  )
  return inputs
  // console.log("input generated", inputs)
}

function getTxHashesFromSnarkInput(input){
  var txHashes = new Array()
  for (var i = 0; i < input.paths2tx_root.length; i++){
    var index; // index of tx in tx tree
    if (i % 2 == 0){
      index = i + 1
    } else {
      index = i - 1
    }
    txHashes[index] = input.paths2tx_root[i][0]
  }
  return txHashes
}

function getAccountsDeltaFromInput(input){
  const uniqueAcctsX = [...new Set(input["from_x"].push(input["to_x"]))]
  const uniqueAcctsY = [...new Set(input["from_y"].push(input["to_y"]))]
  var deltaArray = new Array(uniqueAcctsX.length)
  
  // disregard zero account state
  var zeroAccountIndex = uniqueAcctsX.indexOf(0); 
  if (zeroAccountIndex > -1) {
    uniqueAcctsX.splice(zeroAccountIndex, 1);
    uniqueAcctsY.splice(zeroAccountIndex, 1);
  }

  for (var i = 0; i < uniqueAcctsX.length; i++){
    delta = {
      pubkey_x: uniqueAcctsX[i],
      pubkey_y: uniqueAcctsY[i],
      balance_delta: 0,
      nonce_delta: 0
    }
    for (var j = 0; j < input["from_x"].length; j++){
      if (input['from_x'][j] == delta.pubkey_x){
        delta.balance_delta -= input['amount'][j]
        if (input['to_x'][i] != '0'){
          delta.nonce_delta += 1;
        }
      }
      if (input['to_x'][j] == delta.pubkey_x){
        delta.balance_delta += input['amount'][j]
      }
    }
    deltaArray.push(delta)
  }

  return deltaArray
}

// async function prepTxs(txs) {
//   var fromX = new Array()
//   var fromY = new Array()
//   var toX = new Array()
//   var toY = new Array()
//   var tokenTypes = new Array()
//   var nonces = new Array()
//   var amounts = new Array()
//   var signatures = new Array()
//   logger.debug("Prepping inputs to snark for given transactions")
//   // txs = txs[0]
//   for (var i = 0; i < txs.length; i++) {
//     logger.debug("traversing", { index: i, len: txs.length, transaction: txs[i] })
//     fromX.push(txs[i].fromX)
//     fromY.push(txs[i].fromY)

//     toX.push(txs[i].toX)
//     toY.push(txs[i].toY)

//     // collect amounts 
//     amounts.push(txs[i].amount)
//     // collect token types
//     tokenTypes.push(txs[i].tokenType)
//     // collect sigs
//     signatures.push(txs[i].signature)
//   }
//   // logger.debug("We have the following arrays now", fromX, amounts, tokenTypes)
//   const txArray = tx.generateTxLeafArray(fromX, fromY, toX, toY, amounts, tokenTypes)
//   console.log("&&&& txarra", txArray)
//   const txLeafHashes = tx.hashTxLeafArray(txArray)
//   console.log("***txleafArray", txLeafHashes)
//   const txTree = merkle.treeFromLeafArray(txLeafHashes)

//   const txProofs = new Array(2 ** TX_DEPTH)
//   for (var jj = 0; jj < 2 ** TX_DEPTH; jj++) {
//     txProofs[jj] = merkle.getProof(jj, txTree, txLeafHashes)
//   }
//   // TODO move balance leaf array generation DB based
//   const token_types = [0, 10, 10, 10];
//   const balances = [0, 1000, 0, 0];
//   nonces = [0, 0, 0, 0];
//   // getAllAccounts
//   var accountsArray = await db.getAllAccounts()


//   // when adding deposit user will be assigned a leaf 
//   // id will be stored in DB (hardcode for now, till things work)
//   var from_accounts_idx = [1, 2, 1, 3]
//   var to_accounts_idx = [2, 0, 3, 2]

//   console.log("sending data",
//     "txdepth", TX_DEPTH,
//     "pubkeys", fromX, fromY, toX, toY,
//     "balanceLeafArray", accountsArray,
//     "fromAccount", from_accounts_idx,
//     "toaccount", to_accounts_idx,
//     "amounts", amounts,
//     "txTokenType", token_types,
//     "signature", signatures,
//   )
//   const inputs = update.processTxArray(
//     TX_DEPTH,
//     fromX,
//     fromY,
//     toX,
//     toY,
//     accountsArray,
//     from_accounts_idx,
//     to_accounts_idx,
//     amounts,
//     token_types,
//     signatures
//   )
//   console.log("input generated", inputs)

// }

// returns index array of account from given array of accounts


// convert from JSON transaction to transaction object
function JSON2Tx(data) {
  var txData = JSON.parse(data)[0]
  return new Transaction(
    txData.fromX, txData.fromY, txData.toX, txData.toY, 
    txData.amount, txData.tokenType, txData.R1, txData.R2, txData.S)
}

// convert from JSON deposit to deposit object
function JSON2Deposit(data) {
  var depositData = JSON.parse(data)[0]
  return new Deposit(
    depositData.pubkey_x, depositData.pubkey_y, 
    depositData.amount, depositData.token_type)
}

// read genesis file 
async function readGenesis() {
  var contents = await fs.readFileSync(genPath)
  var genesisJSON = JSON.parse(contents)
  return genesisJSON;
}

export default {
  getConn,
  conn,
  toMultiHash,
  checkSignature,
  prepTxs,
  getTxHashesFromSnarkInput,
  getAccountsDeltaFromInput,
  JSON2Tx,
  readGenesis,
  toSignature

}
