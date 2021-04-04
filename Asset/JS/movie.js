class Movie {
  constructor () {
    this.key = '1e249565';
  }

  async getSingleMovie(movie, summary, side) {
    const response = await fetch(`http://www.omdbapi.com/?apikey=${this.key}&i=${movie.imdbID}`);

    const responseData = await response.json();
    return {
      movie: responseData,
      summary,
      side
    };
  }
}