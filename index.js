// Boots up the app
const apiKey = 'd62b25ada178694d3c7fc13be8d15297';
const apiEndpoint = 'https://api.themoviedb.org/3';
const image_base_url = 'https://image.tmdb.org/t/p/w500';
const originalImage_base_url = "https://image.tmdb.org/t/p/original";


const apiPath = {
   fetchAllCategories:`${apiEndpoint}/genre/movie/list?api_key=${apiKey}&language=en-US`,
   fetchMovieLists:(id)=> `${apiEndpoint}/discover/movie?api_key=${apiKey}&language=en-US&with_genres=${id}`,
   fetchTrendingMovie:`${apiEndpoint}/trending/movie/week?api_key=${apiKey}&language=en-US`,
}

function init() {
    fetchTrendingMovies();
    fetchAndBuildAllSection();
}

function fetchTrendingMovies(){
    fetchAndBuildCategorySection(apiPath.fetchTrendingMovie,'Trending Now')
    .then(list => {
        let randomIndex = parseInt(Math.random() * list.length);
        buildBannerSection(list[randomIndex]);
    }).catch(err => {
        console.error(err);
    })
}

function buildBannerSection(movie){
    let bannerContainer = document.getElementById('bannerSection');
    bannerContainer.style.backgroundImage=`url(${originalImage_base_url}${movie.backdrop_path})`;
    const div = document.createElement('div');
    div.innerHTML = `
    
        <h2 class="banner-title">${movie.title}</h2>
        <p class="banner-info">Trending in movies | Release :  ${movie.release_date}</p>
        <p class="banner-overview">${movie.overview && movie.overview.length > 200 ? movie.overview.slice(0,200).trim()+' ....' : movie.overview}</p>
        <div class="action-buttons-cont">
            <button class="action-button"> &nbsp; &nbsp;
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="">
                    <path d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z" fill="currentColor"></path>
                </svg> &nbsp; Play </button>
            <button class="action-button"> &nbsp;
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z" fill="currentColor"></path>
                </svg> &nbsp; More Info </button>
        </div>

    `;
    div.className='banner-content container';
    bannerContainer.append(div);
}


function fetchAndBuildAllSection(){
    fetch(apiPath.fetchAllCategories)
    .then(res => res.json())
    .then(res => {
        const categories = res.genres;
        if (Array.isArray(categories) && categories.length){
            categories.forEach(category => {
                fetchAndBuildCategorySection(apiPath.fetchMovieLists(category.id),category.name)
            });
        }
    })
    .catch(err=> console.log(err));
}

async function fetchAndBuildCategorySection(fetchUrl, categoriesName){
   // console.table(fetchUrl, categoriesName);
    try {
        const res = await fetch(fetchUrl);
        const res_1 = await res.json();
        // console.table(res.results);
        const movies = res_1.results;
        if (Array.isArray(movies) && movies.length > 0) {
            buildMovieSection(movies, categoriesName);
        }
        return movies;
    } catch (err) {
        console.log(err);
    }   
}

function buildMovieSection(list , categoryName){
    // console.log(list,categoryName);
    const movieContainer = document.getElementById('movies-cont');
    const moviesList = list.map((item)=>{
         //div.movies-row wala banako yesma
        return `  
            <img class="movie-item" src="${image_base_url}/${item.poster_path}" alt="${item.title}">
        `;
    }).join('');

    const moviesSectionHTML = `
     <h2 class="movies-section-heading">${categoryName} <span class="explore-nudge">Explore All</span></h2>
     <div class="movies-row">
        ${moviesList}
     </div>
    `
    // console.log(moviesSectionHTML);

    const div = document.createElement('div');
    div.className='movies-section';
    div.innerHTML=moviesSectionHTML;

    //append HTML into movies container
    movieContainer.append(div)
}


// initial event 
window.addEventListener('load', function(){
    init();
    this.window.addEventListener('scroll', function(){
        //header ko bg update
        const headerid = document.getElementById('header');
        if (this.window.scrollY > 25){
            headerid.classList.add('blackbg');
        } else {
            headerid.classList.remove('blackbg')
        }
    })
})
