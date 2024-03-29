const crypto = require("crypto");

class AESCipher {
  static encrypt(data, key, mode = "ecb", iv = "") {
    const cipher = crypto.createCipheriv(`aes-256-${mode}`, key, iv);
    let encrypted = cipher.update(data, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
  }

  //   static decrypt(encryptedData, key, mode = "ecb", iv = "") {
  //     const decipher = crypto.createDecipheriv(`aes-256-${mode}`, key, iv);
  //     let decrypted = decipher.update(encryptedData, "base64", "utf8");
  //     decrypted += decipher.final("utf8");
  //     return decrypted;
  //   }
}

module.exports = AESCipher;
