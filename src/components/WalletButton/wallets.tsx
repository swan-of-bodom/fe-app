import ListItemText from "@mui/material/ListItemText";
import Image from "next/image";

enum WalletId {
  ArgentX = "argentX",
  Braavos = "braavos",
}

const argentx = () => (
  <>
    <ListItemText primary={"Argent X"} />
    <Image src="/argentx.svg" alt="ArgentX logo" width="50" height="50" />
  </>
);

const braavos = () => (
  <>
    <ListItemText primary={"Braavos"} />
    <Image src="/braavos.svg" alt="Braavos logo" width="50" height="50" />
  </>
);

export const walletMap = (id: WalletId) => {
  switch (id) {
    case WalletId.ArgentX:
      return argentx();
    case WalletId.Braavos:
      return braavos();
    default:
      return "";
  }
};
