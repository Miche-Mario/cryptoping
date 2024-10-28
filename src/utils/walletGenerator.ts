// Créer un nouveau fichier walletGenerator.ts

const BECH32_CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l"; // Caractères valides pour bech32

export const generateBitcoinWalletCode = (): string => {
  // Commencer par "bc1"
  let walletCode = "bc1";

  // Générer une longueur aléatoire entre 39 et 59 (pour avoir une longueur totale entre 42 et 62)
  const length = Math.floor(Math.random() * (59 - 39 + 1)) + 39;

  // Ajouter des caractères aléatoires du charset bech32
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * BECH32_CHARSET.length);
    walletCode += BECH32_CHARSET[randomIndex];
  }

  return walletCode;
};
