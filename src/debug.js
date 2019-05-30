const { unstringifyBigInts, stringifyBigInts } = require('./snark_utils/stringifybigint');

// expected
/*
[
  8342813455761320245860753246541064453130959347426759535493956280345855081934n,
  5664584437443823734110613841194208207201444748007102614314585422057916338909n,
  14581856025477126166111075660025487656341531291692768522050764373003742264071n,
  11480353082813403598430050605296163084142486906719045755632783475400574681131n
]

*/
unstringifyBigInts(
    '615868670249290248744920099222261808720961792947987939668984162371680490731n'
)