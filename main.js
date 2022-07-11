$(document).ready(() => {
  let genreMap = new Map();
  $.ajax({
    url: `https://api.themoviedb.org/3/genre/tv/list?api_key=e5321b995009eacf8a47299c21aa3b10&language=en-US`,
    method: "GET",
    dataType: "json",
    error: function (xhr, status, error) {
      console.log(`error: ${xhr.responseText}`);
    },
    complete: function (response) {
      for (genre of response.responseJSON.genres) {
        genreMap.set(genre.id, genre.name);
      }
    }
  });
  $.ajax({
    url: `https://api.themoviedb.org/3/genre/movie/list?api_key=e5321b995009eacf8a47299c21aa3b10&language=en-US`,
    method: "GET",
    dataType: "json",
    error: function (xhr, status, error) {
      console.log(`error: ${xhr.responseText}`);
    },
    complete: function (response) {
      for (genre of response.responseJSON.genres) {
        genreMap.set(genre.id, genre.name);
      }
    }
  });
  // trending
  $.ajax({
    url: `https://api.themoviedb.org/3/trending/all/day?api_key=e5321b995009eacf8a47299c21aa3b10`,
    method: "GET",
    dataType: "json",
    error: function (xhr, status, error) {
      console.log(`error: ${xhr.responseText}`);
    },
    complete: function (response) {
      let htmlString = '';
      for (var i = 0; i < 20; i++) {
        let item = response.responseJSON.results[i];
        let streamUrl = `watch/tv.html?id=${item.id}&s=1&e=1`;
        let type = "TV Show";
        if (item.title) {
          streamUrl = "watch/movie.html?id=" + item.id;
          type = "Movie";
        }
        let poster = "https://image.tmdb.org/t/p/w500" + item.backdrop_path;
        let title = item.title ?? item.name;
        let genres = item.genre_ids;
        let genreString = "";

        for (g of genres) {
          genreString += genreMap.get(g) + ', ';
        }

        if (genreString.trim().slice(-1) == ',') {
          genreString = genreString.trim().slice(0, -1);
        }

        htmlString += `<a class="cardLink" href="${streamUrl}"><div class="col">
                  <div class="card shadow-sm">
                    <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" preserveAspectRatio="xMidYMid slice" focusable="false">
                        <image href="${poster}" />
                    </svg>
                    <div class="card-body">
                      <strong>${title}</strong>
                      <p class="card-text">${item.overview}</p>
                      <div class="d-flex justify-content-between align-items-center">
                      <small class="text-muted">${type} - ${genreString}</small>
                        <small class="text-muted">${item.vote_average.toFixed(1)}/10</small>
                      </div>
                    </div>
                  </div>
                </div>
                </a>`
      }
      $("#trending").html(htmlString);
    }
  });
  $("#searchForm").on("submit", (e) => {
    e.preventDefault();
    $("#heading").html("<h4>Results</h4>");
    $.ajax({
      url: `https://api.themoviedb.org/3/search/${$("#search-dropdown").val()}?api_key=e5321b995009eacf8a47299c21aa3b10&language=en-US&query=${$("#searchBox").val()}&page=1&include_adult=false`,
      method: "GET",
      dataType: "json",
      error: function (xhr, status, error) {
        console.log(`error: ${xhr.responseText}`);
      },
      complete: function (response) {
        let htmlString = '';
        let max = 20;
        if (response.responseJSON.results.length < max) {
          max = response.responseJSON.results.length;
        }

        for (var i = 0; i < max; i++) {
          let item = response.responseJSON.results[i];
          let streamUrl = `watch/tv.html?id=${item.id}&s=1&e=1`;
          let type = "TV Show";
          if (item.title) {
            streamUrl = "watch/movie.html?id=" + item.id;
            type = "Movie";
          }
          let poster = "https://image.tmdb.org/t/p/w500" + item.backdrop_path;
          let title = item.title ?? item.name;
          let genres = item.genre_ids;
          let genreString = "";

          for (g of genres) {
            genreString += genreMap.get(g) + ', ';
          }

          if (genreString.trim().slice(-1) == ',') {
            genreString = genreString.trim().slice(0, -1);
          }

          htmlString += `<a class="cardLink" href="${streamUrl}"><div class="col">
                      <div class="card shadow-sm">
                        <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" preserveAspectRatio="xMidYMid slice" focusable="false">
                            <image href="${poster}" />
                        </svg>
                        <div class="card-body">
                          <strong>${title}</strong>
                          <p class="card-text">${item.overview}</p>
                          <div class="d-flex justify-content-between align-items-center">
                          <small class="text-muted">${type} - ${genreString}</small>
                            <small class="text-muted">${item.vote_average.toFixed(1)}/10</small>
                          </div>
                        </div>
                      </div>
                    </div>
                    </a>`
        }
        $("#trending").html(htmlString);
      }
    });
  });
});