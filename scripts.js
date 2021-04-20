$(document).ready(() => {
  $.get("https://smileschool-api.hbtn.info/quotes", (data) => {
    $("#comment-loader").hide();
    data.forEach((d, i) => $("#comment-carousel").append(createComment(d, i)));
  })

  $.get("https://smileschool-api.hbtn.info/popular-tutorials", (data) => {
      createVideoCard(data, "#popular-loader", "#popular-carousel", 'popular');
  });
  $.get("https://smileschool-api.hbtn.info/latest-videos", (data) => {
      createVideoCard(data, "#latest-loader", "#latest-carousel", 'latest');
  });

  $.get("https://smileschool-api.hbtn.info/courses", (data) => {
      const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);
      const { topics, sorts } = data;
      topics.forEach((e) => {
        e = capitalize(e);
        $("#topic-options").append(`<option value="${e}">${e}</option>`);
      });
      sorts.forEach((e) => {
        e = e.split("_").map((e) => capitalize(e)).join(" ");
        $("#sort-options").append(`<option value="${e}">${e}</option>`);
      })
      showRelevantCourses();
  })

  const showRelevantCourses = () => {
    $("#courses-loader").show();
    $("#filtered-cards-list").empty();
    $(".total").empty();
    const search = $("#keyword-search").val();
    // if (search) search = search.split(" ").map((e) => e.charAt(0).toUpperCase() + e.slice(1))
    const topic = $("#topic-options option:selected ").val();
    let sortBy = $("#sort-options option:selected").val();
    if (sortBy) sortBy = sortBy.split(" ").map((e) => e.charAt(0).toLowerCase() + e.slice(1)).join("_")
    console.log(sortBy)
    $.get(`https://smileschool-api.hbtn.info/courses?q=${search}&topic=${topic}&sort=${sortBy}`, (data) => {
      const { courses } = data;
      $(".total").append('<p>').addClass("pb-4 text-secondary");
      $(".total p").text(`${courses.length} ${courses.length != 1 ? 'videos' : 'video'}`);

      for (course of courses) {
          $("#filtered-cards-list").append(createContent(course));
          $("#filtered-cards-list .card-body").addClass("col-12 col-sm-12 col-md-6 col-lg-3");
      }
      $("#courses-loader").hide();
    })
  }

  $(".form-control").change(() => showRelevantCourses());
  $("#keyword-search").on("enter", () => showRelevantCourses());
  
  const createVideoCard = (data, loader, carousel, id) => {
      $(loader).hide()
      for (let i = 0; i < data.length; i++) {
          $(carousel).append(
            `
            <div class="carousel-item ${i === 0 ? "active" : ""}">
              <div id="${id}${i}" class="col-12 col-sm-12 col-md-6 col-lg-3">
              </div>
            </div>
            `
          )
        $(`#${id}${i}`).append(createContent(data[i]));
      }

      $(`${carousel} .carousel-item`).each(function () {
          var minPerSlide = 3;
          var next = $(this).next();
          if (!next.length) {
            next = $(this).siblings(':first');
          }
          next.children(':first-child').clone().appendTo($(this));
    
          for (var i = 0; i < minPerSlide; i++) {
            next = next.next();
            if (!next.length) {
              next = $(this).siblings(':first');
            }
    
            next.children(':first-child').clone().appendTo($(this));
          }
        });

  }
  const createComment = (d, i) => {
    return `
        <div class="carousel-item ${i == 0 ? 'active' : ''}">
            <div class="row flex-wrap justify-content-center mb-5">
                <div class="col col-sm-4 col-md-2 mt-5 d-flex justify-content-xs-end justify-content-center">
                <img class="img rounded-circle" src="${d.pic_url}" alt="${d.name}">
                </div>
                <div class="col-11 col-md-6 col-lg-8 item-content mt-5">
                <h6 class="content-title pb-3 mr-sm-2">${d.text}</h6>
                <p class="m-0 font-weight-bold">${d.name}</p>
                <p class="m-0 font-italic">${d.title}</p>
                </div>
            </div>
        </div>
    `
  }
  const createContent = (e) => {
    let stars = ""
    for (let i=0; i < e.star; i++) {
      stars += `<img src="images/star_on.png" class="stars" />`
    }
    if (e.star < 5)
      for (let i = e.star; i < 5; i++)
        stars += `<img src="images/star_off.png" class="stars" />`

    return `
      <div class="card-body">
          <div class="img-wrap d-flex align-items-center justify-content-center">
              <img src=${e.thumb_url} alt="" class="img-fluid"/>
              <div class="play-button row justify-content-center align-items-center">
                  <img class="purple-text" src="images/play.png" alt="" />
              </div>
          </div>
          <h4>${e.title}</h4>
          <p class="text-muted">
          ${e["sub-title"]}
          </p>
          <div class="row align-items-center">
              <div class="col-2 col-md-4">
                  <img src=${e.author_pic_url} alt="" class="img profile-img rounded-circle">

              </div>
              <div class="col purple-text">
                  ${e.author}
              </div>
          </div>
          <div class="row justify-content-between pt-3">
              <div class="col stars">
                  ${stars}
              </div>
          <div class="col-4">
              <p class="purple-text text-right">${e.duration}</p>
          </div>
      </div>`
  }
})
