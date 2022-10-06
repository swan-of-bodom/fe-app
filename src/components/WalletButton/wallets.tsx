import ListItemText from "@mui/material/ListItemText";

enum WalletId {
  ArgentX = "argentX",
  Braavos = "braavos",
}

const argentx = () => (
  <>
    <ListItemText primary={"Argent X"} />
    <img src="/argentx.svg" alt="ArgentX logo" width="50" height="50" />
  </>
);

const braavos = () => (
  <>
    <ListItemText primary={"Braavos"} />
    <img src="/braavos.svg" alt="Braavos logo" width="50" height="50" />
  </>
);

export const walletMap = (id: string) => {
  switch (id) {
    case WalletId.ArgentX:
      return argentx();
    case WalletId.Braavos:
      return braavos();
    default:
      return "";
  }
};
