
// Instan UI
const ui = new UI();

// UI Elements
const inputs = document.querySelectorAll('.input');

// Autocomplete configuration 
const autocompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    return `
      <img src="${imgSrc}" class="img-fluid">
      <span class="parag align-self-center ml-2">${movie.Title}</span>
    `
  },
  inputValue(movie) {
    return `${movie.Title}`;
  }
}

// Render input field on the DOM
ui.renderAutoComplete({
  root: document.getElementById('left-autocomplete'),
  ...autocompleteConfig,
  onOptionSelect(movie) {
    document.querySelector('#movie-notification').classList.add('hide');
    fetchMovie(movie, document.getElementById('left-summary'), 'left');
  }
});

ui.renderAutoComplete({
  root: document.getElementById('right-autocomplete'),
  ...autocompleteConfig,
  onOptionSelect(movie) {
    document.querySelector('#movie-notification').classList.add('hide');
    fetchMovie(movie, document.getElementById('right-summary'), 'right');
  }
});

let leftMovie;
let rightMovie;


function fetchMovie(movies, summary, sides) {
  const movie = new Movie();

  movie.getSingleMovie(movies, summary, sides)
  .then(({movie, summary, side}) => {
    
    // Render Selected movie to UI
    ui.renderMovie(movie, summary);

    if(side === 'left') {
      leftMovie = movie;
    } else {
      rightMovie = movie;
    }

    if(leftMovie && rightMovie) {
      // Comparison between right and left movie
      ui.runComparison();
    }
  });
}