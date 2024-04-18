const process = require("process");
const fs = require("fs");
const { calculateSHA1, encode, decode } = require("./bencode");

function main() {
    const command = process.argv[2];
    
    if ( command === "decode" ) {
        const bencoded = process.argv[3];
        const bdecoded = decode(bencoded);
        console.log(JSON.stringify(bdecoded.value));
    } else if ( command === "info" ) {
        const fileName = process.argv[3];
        const rawContent = fs.readFileSync(fileName);
        const data = decode(rawContent.toString("binary")).value;
        
        const bencodeInfo = encode(data.info);
        const tmpBuffer = Buffer.from(bencodeInfo, "binary")
        const infoHash = calculateSHA1(tmpBuffer);
        const pieceInfo = Buffer.from(data.info.pieces, "binary");

        console.log('Tracker URL: ' + data.announce);
        console.log('Length: ' + data.info.length);
        console.log('Info Hash: ' + infoHash);
        console.log('Piece Length: ' + data.info['piece length']);
        console.log('Piece Hashes:');
        for (let i = 0; i < pieceInfo.length; i += 20) {
            console.log(pieceInfo.slice(i, i + 20).toString("hex"));
        }
    } else if ( command === "peers") {
        console.log("To do");
    } else {
        throw new Error(`Unknown command ${command}`);
    }
}

main();