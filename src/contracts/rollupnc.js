module.exports = [{"constant":false,"inputs":[{"name":"tokenContract","type":"address"}],"name":"registerToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"coordinator","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256[2]"},{"name":"b","type":"uint256[2][2]"},{"name":"c","type":"uint256[2]"},{"name":"input","type":"uint256[3]"}],"name":"verifyProof","outputs":[{"name":"r","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"updateNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"subtreePosition","type":"uint256[2]"},{"name":"subtreeProof","type":"uint256[2]"}],"name":"processDeposits","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"pubkey_from","type":"uint256[2]"},{"name":"txInfo","type":"uint256[3]"},{"name":"positionAndProof","type":"uint256[2][2]"},{"name":"txRoot","type":"uint256"},{"name":"recipient","type":"address"},{"name":"a","type":"uint256[2]"},{"name":"b","type":"uint256[2][2]"},{"name":"c","type":"uint256[2]"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"mimc","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"mimcMerkle","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tokenContract","type":"address"}],"name":"approveToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"depositQueueNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tokenRegistry","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"deposits","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"depositProcessedNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"updates","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"BAL_DEPTH","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"TX_DEPTH","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"name":"pendingDeposits","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"a","type":"uint256[2]"},{"name":"b","type":"uint256[2][2]"},{"name":"c","type":"uint256[2]"},{"name":"input","type":"uint256[3]"}],"name":"updateState","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"maxDepositQueueSize","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"currentRoot","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"pubkey","type":"uint256[2]"},{"name":"amount","type":"uint256"},{"name":"tokenType","type":"uint256"}],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"inputs":[{"name":"_mimcContractAddr","type":"address"},{"name":"_mimcMerkleContractAddr","type":"address"},{"name":"_tokenRegistryAddr","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"tokenType","type":"uint256"},{"indexed":false,"name":"tokenContract","type":"address"}],"name":"RegisteredToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"tokenType","type":"uint256"},{"indexed":false,"name":"pubkey","type":"uint256[2]"}],"name":"RequestDeposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"currentRoot","type":"uint256"},{"indexed":false,"name":"oldRoot","type":"uint256"},{"indexed":false,"name":"txRoot","type":"uint256"}],"name":"UpdatedState","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"pubkey_from","type":"uint256[2]"},{"indexed":false,"name":"recipient","type":"address"},{"indexed":false,"name":"txRoot","type":"uint256"},{"indexed":false,"name":"txInfo","type":"uint256[3]"}],"name":"Withdraw","type":"event"}]