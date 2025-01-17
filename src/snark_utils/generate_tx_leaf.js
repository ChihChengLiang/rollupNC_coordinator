const mimcjs = require("../../circomlib/src/mimc7.js");
const account = require("./generate_accounts.js");
const eddsa = require("../../circomlib/src/eddsa.js");
const {stringifyBigInts, unstringifyBigInts} = require('./stringifybigint.js')

module.exports = {

    generateTxLeafArray: function (from_x, from_y, to_x, to_y, amounts, token_types) {
        if (Array.isArray(from_x)) {
            var txLeafArray = [];
            for (var i = 0; i < from_x.length; i++) {
                var leaf = {}
                leaf['from_x'] = from_x[i];
                leaf['from_y'] = from_y[i];
                leaf['to_x'] = to_x[i];
                leaf['to_y'] = to_y[i];
                leaf['amount'] = amounts[i];
                leaf['token_type'] = token_types[i];
                txLeafArray.push(leaf);
            }
            return txLeafArray;
        } else {
            console.log('please enter values as arrays.')
        }

    },

    hashTxLeafArray: function(leafArray){
        if (Array.isArray(leafArray)){
            var txLeafHashArray = [];
            for (var i = 0; i < leafArray.length; i++){
                var leafHash = mimcjs.multiHash([
                    leafArray[i]['from_x'].toString(),
                    leafArray[i]['from_y'].toString(),
                    leafArray[i]['to_x'].toString(),
                    leafArray[i]['to_y'].toString(),
                    leafArray[i]['amount'].toString(),
                    leafArray[i]['token_type'].toString()
                ])
                txLeafHashArray.push(leafHash)
            }
            return txLeafHashArray
        } else {
            console.log('please enter values as arrays.')
        }
    },

    signTxLeafHashArray: function (leafHashArray, prvKeys) {
        if (Array.isArray(leafHashArray)) {
            var signatures = [];
            for (var i = 0; i < leafHashArray.length; i++) {
                signature = eddsa.signMiMC(prvKeys[i], leafHashArray[i]);
                signatures.push(signature)
            }
            return signatures
        } else {
            console.log('please enter values as arrays.')
        }
    },

    getSignaturesR8x: function (signatures) {
        var R8xArray = new Array(signatures.length)
        for (var i = 0; i < signatures.length; i++) {
            R8xArray[i] = signatures[i]['R8'][0]
        }
        return R8xArray
    },

    getSignaturesR8y: function (signatures) {
        var R8yArray = new Array(signatures.length)
        for (var i = 0; i < signatures.length; i++) {
            R8yArray[i] = signatures[i]['R8'][1]
        }
        return R8yArray
    },

    getSignaturesS: function (signatures) {
        var SArray = new Array(signatures.length)
        for (var i = 0; i < signatures.length; i++) {
            var S = signatures[i]['S']
            if (S[S.length - 1] == 'n'){
                SArray[i] =  S.slice(0, S.length-1);
            } else {
                SArray[i] = S
            }
        }
        return SArray
    }
}

