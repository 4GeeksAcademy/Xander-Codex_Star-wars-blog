export const initialStore = () => ({
  message: null,
  todos: [
    { id: 1, title: "Make the bed", background: null },
    { id: 2, title: "Do my homework", background: null },
  ],
  characters: [],
  vehicles: [],
  planets: [],
  favorites: [],
});

export default function storeReducer(store, action = {}) {
  switch (action.type) {

    // Actualizar arrays 
    case "get_character":
      return { ...store, characters: action.payload };

    case "get_vehicle":
      return { ...store, vehicles: action.payload };

    case "get_planet":
      return { ...store, planets: action.payload };

    // Agregar un favorito si no existe
    case "get_favorite": {
      const it = action.payload; // { uid, name, type }
      const exists = store.favorites.some(
        f => f.uid === it.uid && f.type === it.type
      );
      if (exists) return store;
      return { ...store, favorites: [...store.favorites, it] };
    }

    // Eliminar favorito
    case "delete_favorite": {
      const { uid, type } = action.payload;
      return {
        ...store,
        favorites: store.favorites.filter(
          f => !(f.uid === uid && f.type === type)
        ),
      };
    }

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}
