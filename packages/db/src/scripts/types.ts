export interface RawData {
  deal_date:                       Date;
  deal_id:                         number;
  trade_id:                        number;
  display_no:                      number | null;
  start_cost:                      number;
  deal_cost:                       number;
  currency_name:                   CurrencyName;
  participants_count:              number;
  customer_name:                   string;
  customer_type_name:              CustomerTypeName;
  customer_inn:                    number;
  provider_name:                   string;
  provider_inn:                    null | string;
  deal_status_name:                DealStatusName;
  proposal_status_name:            ProposalStatusName;
  deal_contract_date:              null | string;
  deal_contract_status_name:       DealContractStatusName;
  deal_contract_kazna_status_name: string;
  deal_contract_kazna_status_id:   number;
  category_name:                   string;
  is_local_manufacturs:            boolean;
  beneficiary:                     null;
  founder:                         null;
  can_comment:                     number;
  
  contract_file_name:              null | string;
  contract_file_path:              null | string;
  contract_file_ext:               ContractFileEXT | null;
  contract_file_sizes:             number | null;
  contract_file_date:              Date | null;
  additional_protocol_file_name:   null | string;
  additional_protocol_file_path:   null | string;
  additional_protocol_file_ext:    AdditionalProtocolFileEXT | null;
  additional_protocol_file_sizes:  number | null;
  additional_protocol_file_date:   Date | null;
  rn:                              number;
  total_count:                     number;
}

export enum AdditionalProtocolFileEXT {
  PDF = ".PDF",
}

export enum ContractFileEXT {
  Cab = "CAB",
  Doc = "DOC",
  Docx = "DOCX",
  Dotx = "DOTX",
  Jpg = "JPG",
  PDF = "PDF",
  Rar = "RAR",
  Xlsx = "XLSX",
  Zip = "ZIP",
}

export enum CurrencyName {
  Доллар = "Доллар",
  Евро = "Евро",
  Рубль = "Рубль",
  Сум = "Сум",
}

export enum CustomerTypeName {
  BudgetBuyurtmachi = "Budget buyurtmachi",
  KorporativBuyurtmachi = "Korporativ buyurtmachi",
}

export enum DealContractStatusName {
  НеПрикреплён = "Не прикреплён",
  Принятый = "Принятый",
}

export enum DealStatusName {
  ПринятоПобедителемСовершен = "Принято победителем (Совершен)",
}

export enum ProposalStatusName {
  ПротоколСформирован = "Протокол сформирован",
  УдаленСоСтороныЗаказчика = "Удален со стороны заказчика",
}
