import { db } from "./firebaseConfig";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";

// Para agregar un nuevo documento
const addData = async () => {
    try {
        const docRef = await addDoc(collection(db, "users"), {
            firstName: "Ada",
            lastName: "Lovelace",
            born: 1815
        });
        console.log("Documento agregado con ID: ", docRef.id);
    } catch (e) {
        console.error("Error agregando documento: ", e);
    }
};

// Para crear o actualizar un documento
const setData = async () => {
    try {
        await setDoc(doc(db, "users", "ada-lovelace"), {
            firstName: "Ada",
            lastName: "Lovelace",
            born: 1815
        });
        console.log("Documento escrito con ID: ada-lovelace");
    } catch (e) {
        console.error("Error escribiendo documento: ", e);
    }
};

export { addData, setData };
