class UI {
  constructor() {
    this.leftMovie;
    this.rightMovie;
    this.key = '1e249565';
  }

  renderAutoComplete({
    root, 
    renderOption, 
    onOptionSelect,
    inputValue,
  }) {

    root.innerHTML =  `
      <label class="parag"><b>Search</b></label>
      <input type="text" placeholder="Enter search here" class="input mt-2">
      <div class="dropdown-menu">
        <div class="sub-menu"></div>
      </div>
    `;

    const subMenu = root.querySelector('.sub-menu');
    const input = root.querySelector('.input');

    const debounce = (func, delay) => {
      let timeoutId;
      return (...args) => {
        if(timeoutId) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
          func.apply(null, args);
        }, delay);
      }
    };

    const onInput = (e) => {
      fetchData(e.target.value);
    };
    
    // Event listener for input elements
    input.addEventListener('input', debounce(onInput, 1000));

    const getMovieSearch = async (search) => {
      const response = await fetch(`http://www.omdbapi.com/?apikey=${this.key}&s=${search}`);
      const responseData = await response.json();
      if(responseData.Error) {
        return [];
      }
      return responseData.Search;
    }

    // Fetching input value from debounce function
    const fetchData = (input) => {
      getMovieSearch(input)
      .then(items => {
        console.log(items.length)
        if(!items.length) {
          subMenu.classList.remove('active');
        } else {
          subMenu.classList.add('active');
        }

        let count = 0;

        for(let item of items) {
          const option = document.createElement('a');
          
          option.className = 'menu-item';
          option.innerHTML = renderOption(item);
          subMenu.append(option);

          // Event listener for getting the movie ID of the selected item
          option.addEventListener('click', () => {
            subMenu.classList.remove('active');
            root.querySelector('.input').value = inputValue(item);
            onOptionSelect(item, root);
          });
        }
      })
    };

    // Event listener for closing dropdown on click
    document.addEventListener('click', e => {
      if(!root.contains(e.target)) {
        subMenu.classList.remove('active');
      }
    });
  }

  // Renders Selected Movie details on the DOM
  renderMovie(movieDetail, summary, side) {
    const boxOffice = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    const metascore = parseInt(movieDetail.Metascore);
    const rating = parseInt(movieDetail.imdbRating);
    const votes = parseFloat(movieDetail.imdbVotes.replace(/,/g, ''));
    const awards = this.getAward(movieDetail.Awards);

    summary.innerHTML = `
      <article class="media">
        <figure class="media-left">
          <div class="image">
            <img class="img-fluid" src="${movieDetail.Poster}">
          </div>
        </figure>
        <div class="media-content">
          <div class="content">
            <h3 class="h3">${movieDetail.Title}</h3>
            <h4 class="h4">${movieDetail.Genre}</h4>
            <p class="parag">${movieDetail.Plot}</p>
          </div>
        </div>
      </article>

      <article class="notification bg-success" data-value="${awards}">
        <h4 class="h4">${movieDetail.Awards}</h4>
        <p class="parag subtitle">Awards</p>
      </article>
      <article class="notification bg-success" data-value="${boxOffice}">
        <h4 class="h4">${movieDetail.BoxOffice}</h4>
        <p class="parag subtitle">Box Office</p>
      </article>
      <article class="notification bg-success" data-value="${metascore}">
        <h4 class="h4">${movieDetail.Metascore}</h4>
        <p class="parag subtitle">Metascore</p>
      </article>
      <article class="notification bg-success" data-value="${rating}">
        <h4 class="h4">${movieDetail.imdbRating}</h4>
        <p class="parag subtitle">IMDB Rating</p>
      </article>
      <article class="notification bg-success" data-value="${votes}">
        <h4 class="h4">${movieDetail.imdbVotes}</h4>
        <p class="parag subtitle">IMDB Votes</p>
      </article>
    `;
  }

  runComparison() {
    let leftStat = document.querySelectorAll('#left-summary .notification');
    let rightStat = document.querySelectorAll('#right-summary .notification');

    leftStat.forEach((left, index) => {
      let right = rightStat[index];

      let rightValue = parseInt(right.dataset.value);
      let leftValue = parseInt(left.dataset.value);
      console.log(leftValue, rightValue)

      if(rightValue > leftValue) {
        left.classList.remove('bg-success');
        left.classList.add('bg-warning');
      } else {
        right.classList.remove('bg-success');
        right.classList.add('bg-warning');
      }
    });
  }

  getAward(awards) {
    const movieAward = awards.split(' ').reduce((prev, award) => {
      const value = parseInt(award);

      if(isNaN(value)) {
        return prev;
      } else {
        return prev + value;
      }

    }, 0);
    return movieAward;
  }
}
