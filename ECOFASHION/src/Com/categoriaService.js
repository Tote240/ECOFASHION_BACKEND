import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    getDocs
  } from 'firebase/firestore';
  import { db } from './Firebase';
  
  export const categoriaService = {
    async agregarCategoria(categoria) {
      try {
        const categoriasRef = collection(db, 'categorias');
        await setDoc(doc(categoriasRef, categoria), { nombre: categoria });
      } catch (error) {
        console.error('Error al agregar categoría:', error);
        throw error;
      }
    },
  
    async obtenerCategorias() {
      try {
        const categoriasRef = collection(db, 'categorias');
        const querySnapshot = await getDocs(categoriasRef);
        return querySnapshot.docs.map((doc) => doc.data().nombre);
      } catch (error) {
        console.error('Error al obtener categorías:', error);
        throw error;
      }
    },
  
    async eliminarCategoria(categoria) {
      try {
        const categoriasRef = collection(db, 'categorias');
        await deleteDoc(doc(categoriasRef, categoria));
      } catch (error) {
        console.error('Error al eliminar categoría:', error);
        throw error;
      }
    }
  };