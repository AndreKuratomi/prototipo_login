import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "src/service/api";

interface IDashboard {
  id: number;
  category: string;
  is_favorite: boolean;
  name: string;
  url: string;
  created_at: string;
  supplier_owner: string;
}

interface IStarFavoriteProvider {
  favorites: Object[];
  setFavorites: Dispatch<SetStateAction<Object[]>>;
  handleStarClicked: (id: number) => void;
}

interface IStarFavoriteProviderProps {
  children: ReactNode;
}

export const StarFavoriteContext = createContext({} as IStarFavoriteProvider);

export const StarFavoriteProvider = ({
  children,
}: IStarFavoriteProviderProps) => {
  // LOCALSTORAGE:
  const _cnpj = localStorage.getItem("@SuperUserLoggedToken:cnpj");

  // LISTA FAVORITOS DASHBOARD EXTERNALS:
  const [favorites, setFavorites] = useState([] as Object[]);

  // API:
  useEffect(() => {
    api
      .get(`suppliers/${_cnpj}/`)
      .then((response) => {
        setFavorites(response.data.favorite_dashboards);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [favorites, _cnpj]);

  // ÍCONE CLICADO:
  const handleStarClicked = (id: number) => {
    api
      .patch(`dashboards/favorite/${id}/`)
      .then((_) => {
        console.log(favorites);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <StarFavoriteContext.Provider
      value={{
        favorites,
        setFavorites,
        handleStarClicked,
      }}
    >
      {children}
    </StarFavoriteContext.Provider>
  );
};

export const useStarFavorite = () => useContext(StarFavoriteContext);
