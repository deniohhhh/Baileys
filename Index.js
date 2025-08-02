const { default: makeWASocket, useSingleFileAuthState } = require("@whiskeysockets/baileys");
const fs = require("fs");
const { getProduk, order } = require("./lib/digiflazz");
const { markupHarga, formatProduk } = require("./lib/helper");

const { state, saveState } = useSingleFileAuthState("./session/session.data.json");
const sock = makeWASocket({ auth: state });

const users = JSON.parse(fs.readFileSync("./database/users.json", "utf-8"));

sock.ev.on("messages.upsert", async ({ messages }) => {
  const msg = messages[0];
  const sender = msg.key.remoteJid;
  const body = msg.message?.conversation || "";

  if (!users[sender]) users[sender] = { saldo: 0, role: "member" };

  if (body === ".listproduk") {
    const produk = await getProduk();
    let teks = "*📦 DAFTAR PRODUK:*\n\n";
    for (let p of produk.slice(0, 10)) {
      teks += formatProduk(p) + "\n";
    }
    sock.sendMessage(sender, { text: teks });
  }

  if (body.startsWith(".saldo")) {
    let s = users[sender].saldo || 0;
    sock.sendMessage(sender, { text: `💰 Saldo kamu: Rp${s}` });
  }

  if (body.startsWith(".payment")) {
    sock.sendMessage(sender, {
      text: `💳 Silakan transfer ke rekening berikut:\n\nBNI - 1234567890 a.n Deni\n\nSetelah transfer, kirim bukti ke admin.`
    });
  }

  fs.writeFileSync("./database/users.json", JSON.stringify(users, null, 2));
});

sock.ev.on("connection.update", (update) => {
  const { connection } = update;
  if (connection === "open") console.log("✅ Bot siap digunakan!");
});

sock.ev.on("creds.update", saveState);
