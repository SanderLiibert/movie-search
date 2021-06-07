import './styles.scss';
import Movies from './Movies';

// Initialises Movies API
const movies = new Movies();

// Remember references to the DOM elements used later
const resultsContainer = document.getElementById('search-results');
const detailsContainer = document.getElementById('movie-details');
const errorContainer = document.getElementById('error');

// Add listener to search button
const searchButton = document.getElementById('search-button') as HTMLInputElement;
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const searchInputYears = document.getElementById('search-input-year') as HTMLInputElement;

//Update search results without clicking with 300ms delay
let timer;
const timerDelay = () => {
    clearTimeout(timer);
    timer = setTimeout(() => updateSearchResults(searchInput.value, searchInputYears.value), 300);
};

searchInput.oninput = timerDelay;
searchInputYears.oninput = timerDelay;

searchButton.addEventListener('click', () => {
    updateSearchResults(searchInput.value, searchInputYears.value);
});

// Display error message to user
const displayError = (message: string) => {
    errorContainer.innerHTML = `<div>Error: ${message}</div>`;
};

// Load new search results and update the listing
const updateSearchResults = async (keyword: string, year: string) => {
    let results = [];
    resultsContainer.innerHTML = '';

    try {
        results = await movies.search(keyword, year);
    } catch (error) {
        displayError(error);
    }

    results
        .sort(sortByTitle)
        .forEach(createResult);
}

// Alphabetical sort
const sortByTitle = (movieA, movieB) => {
    const titleA = movieA.Title.toUpperCase();
    const titleB = movieB.Title.toUpperCase();
    return (titleA < titleB) ? -1 : (titleA > titleB) ? 1 : 0;
}

//Add movie results one-by-one to the list 
const createResult = movie => {
    const movieContainer: HTMLElement = document.createElement('div');
    movieContainer.innerHTML = movie.Title;
    movieContainer.addEventListener('click', updateMovieDetails.bind(this, movie.imdbID));

    resultsContainer.appendChild(movieContainer);
}

// Load detailed information about a movie by its IMDB ID
const updateMovieDetails = async (movieId: string) => {
    const data = await movies.searchFullInfo(movieId);

    const wordMap = new Map()
    const words = data.Plot.toUpperCase().split(' ')
    words.forEach(word => {
        const count = wordMap.get(word)
        if (count) {
            wordMap.set(word, count + 1)
        } else {
            wordMap.set(word, 1)
        }
    })
    console.log(wordMap.size);

    detailsContainer.innerHTML = `<div><p>Title: ${data.Title}</p><p>Plot: ${data.Plot}</p><p>Unique words: ${wordMap.size}</p></div>`;
};
