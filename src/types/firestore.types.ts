export type FirestoreResponseFieldsI = {
    [key: string]: {
      stringValue?: string;
      referenceValue?: string;
      timestampValue?: string;
      mapValue?: { fields: FirestoreResponseFieldsI };
      arrayValue?: { values: FirestoreResponseFieldsI["key"][] };
    };
  };
  
  export type FirestoreResponseI = {
    fields: FirestoreResponseFieldsI;
  };