export interface HobbyProps {
  hobbies: string;
  guiltyPleasures: string;
  favoriteMovies: string;
  favoriteSongs: string;
}

export default function Hobby({ hobby }: { hobby: HobbyProps }) {
  const { hobbies, guiltyPleasures, favoriteMovies, favoriteSongs } = hobby;
  return (
    <div>
      <h2>Hobbies</h2>
      <p>{hobbies}</p>
      <h2>Guilty Pleasures</h2>
      <p>{guiltyPleasures}</p>
      <h2>Favorite Movies</h2>
      <p>{favoriteMovies}</p>
      <h2>Favorite Songs</h2>
      <p>{favoriteSongs}</p>
    </div>
  );
}
