// Cadastro do cliente (campos da loja antiga). Arquivo comum: usado no servidor e no navegador.
export type ProfileValues = {
  person_type: "pf" | "pj";
  name: string;
  last_name: string;
  company: string;
  doc: string;
  rg_ie: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  newsletter: boolean;
};

export const emptyProfile: ProfileValues = {
  person_type: "pf",
  name: "",
  last_name: "",
  company: "",
  doc: "",
  rg_ie: "",
  phone: "",
  cep: "",
  street: "",
  number: "",
  complement: "",
  district: "",
  city: "",
  state: "",
  newsletter: false,
};
