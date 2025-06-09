import {
  getFirestore,
  collection,
  doc,
  limit,
  query,
  getDoc,
  getDocs,
  orderBy,
  setDoc,
  where,
  writeBatch,
  FieldPath,
  Query,
} from "@firebase/firestore/lite";
import { AppInstance } from "@/src/utils/firebase.utils";
import { FirestoreResponseI } from "@/src/types/firestore.types";

// Initialize Firestore
export const FirestoreInstance = getFirestore(AppInstance);

const extractFields = (fields: FirestoreResponseI["fields"] = {}) => {
  const extractedFields: {
    [key: string]:
      | string
      | number
      | (string | number | (string | number)[] | {})[]
      | {};
  } = {};
  Object.keys(fields).forEach((key) => {
    if (
      fields[key]?.stringValue != null ||
      fields[key]?.timestampValue != null ||
      fields[key]?.referenceValue != null
    ) {
      extractedFields[key] =
        fields[key].stringValue ||
        fields[key].timestampValue ||
        fields[key].referenceValue ||
        "";
    } else if (fields[key]?.mapValue?.fields) {
      extractedFields[key] = extractFields(fields[key]?.mapValue?.fields);
    } else if (fields[key]?.arrayValue?.values?.length) {
      extractedFields[key] =
        fields[key]?.arrayValue?.values.map((field) => {
          if (
            field?.stringValue != null ||
            field?.timestampValue != null ||
            field?.referenceValue != null
          ) {
            return (
              field?.stringValue ||
              field?.timestampValue ||
              field?.referenceValue
            );
          } else if (field?.mapValue?.fields) {
            return extractFields(field?.mapValue?.fields);
          }
        }) || [];
    }
    // TODO other else if
  });
  return extractedFields;
};

export const FirestoreUtils = {
  createRef: (documentPath: string) => doc(FirestoreInstance, documentPath),
  createBatch: () => writeBatch(FirestoreInstance),
  createQuery: (
    documentPath: string,
    queryParams: {
      field?: string | FieldPath;
      compareValue?: string | number;
      limit?: number;
      operator?: "==" | "<" | ">" | "!=";
      orderBy?: string;
      orderDirection?: "asc" | "desc";
      conditions?: {
        field: string | FieldPath;
        compareValue: string | number;
        operator: "==" | "<" | ">" | "!=";
      }[];
    }
  ) => {
    try {
      const documentRef = collection(FirestoreInstance, documentPath);
      const conditions = [];
      if (queryParams?.conditions?.length) {
        queryParams?.conditions.forEach((condition) => {
          conditions.push(
            where(condition.field, condition.operator, condition.compareValue)
          );
        });
      } else {
        if (
          queryParams?.field &&
          queryParams?.operator &&
          queryParams?.compareValue
        ) {
          conditions.push(
            where(
              queryParams.field,
              queryParams.operator,
              queryParams.compareValue
            )
          );
        }
      }
      if (queryParams?.orderBy) {
        conditions.push(
          orderBy(queryParams.orderBy, queryParams.orderDirection || "desc")
        );
      }
      if (queryParams.limit) {
        conditions.push(limit(queryParams.limit));
      }
      return query(documentRef, ...conditions);
    } catch (error) {
      throw new Error(
        `FirestoreUtils createQuery error: ${error} ${documentPath} ${JSON.stringify(
          queryParams
        )}`
      );
    }
  },
  getDocument: async (documentPath: string) =>
    new Promise(async (resolve, reject) => {
      try {
        const docRef = doc(FirestoreInstance, documentPath);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          resolve(docSnap.data());
        } else {
          console.error(
            "FirestoreUtils getDocument error: no such document!",
            documentPath
          );
          reject();
        }
      } catch (error) {
        console.error("FirestoreUtils getDocument error:", error);
        reject(error);
      }
    }),
  getDocuments: async (query: Query) =>
    new Promise(async (resolve, reject) => {
      try {
        const querySnapshot = await getDocs(query);
        if (querySnapshot) {
          const results: { [key: string]: string | number | {} | {}[] }[] = [];
          querySnapshot.forEach((doc) => results.push(doc.data()));
          resolve(results);
        } else {
          reject();
        }
      } catch (error) {
        console.error("FirestoreUtils getDocuments error:", error);
        reject(error);
      }
    }),
  setDocument: async (
    documentPath: string,
    data: any,
    override: boolean = false
  ) =>
    new Promise(async (resolve, reject) => {
      try {
        const docRef = doc(FirestoreInstance, documentPath);
        await setDoc(docRef, data, { merge: !override });
        resolve(data);
      } catch (error) {
        console.error("FirestoreUtils.setDocument error:", error);
        reject(error);
      }
    }),
  transformResponse: (
    firestoreResponse: FirestoreResponseI = { fields: {} }
  ) => {
    try {
      return extractFields(firestoreResponse.fields);
    } catch (error) {
      throw new Error(`FirestoreUtils transformResponse error ${error}`);
    }
  },
};
