let form = document.querySelector('form');
const coursesExplorerTitle = document.querySelector('.courses-explore-header-title');
const coursesExplorerDesc = document.querySelector('.courses-explore-header-des');
const exploreBtn = document.querySelector('.explore-btn');
const coursesList = document.querySelector('.courses-list');
const course = document.querySelector('.courses')
const courseTemplate = document.querySelector("#courses-list");

const tabs = ['python', 'excel', 'web', 'javascript', 'datascience', 'aws', 'drawing'];
let current_tab = "python";
let current_courses = {};
let courses = [];
let search_text = "";


/// fetch tab courses data
const fetchData = async () => {
  try {
    let response = await fetch('http://localhost:3000/data');
    let json = await response.json();
    return json;
  }
  catch (err) {
    console.log(err);
  }

}

///// create rating stars
const createRatingStars = (rate) => {
  let rating_stars = document.createElement('span');
  rating_stars.classList.add('stars');
  let full = parseInt(rate);
  let half = rate - full >= 0.4 ? 1 : 0;
  let empty = 5 - full - half;

  for (let i = 0; i < full; i++) {
    let full_star = document.createElement('i');
    full_star.classList.add('fa');
    full_star.classList.add('fa-star');
    rating_stars.appendChild(full_star);
  }

  let half_star = document.createElement('i');
  half_star.classList.add('fa');
  half_star.classList.add('fa-star-half-empty')

  if (half === 1)
    rating_stars.appendChild(half_star);
  else
    half_star.remove;

  for (let i = 0; i < empty; i++) {
    let empty_star = document.createElement('i');
    empty_star.classList.add('fa');
    empty_star.classList.add('fa-star-empty');
    rating_stars.appendChild(empty_star);
  }

  return rating_stars;

}



//// display current tab courses
function tab_display() {
  fetchData()
    .then(
      courseCard => {
        current_courses = courseCard[current_tab];
        let tab_name = current_courses.title.slice(15);
        coursesExplorerTitle.innerText = current_courses.header;
        coursesExplorerDesc.innerText = current_courses.description;
        exploreBtn.innerText = `Explore ${tab_name}`;

        let tab_data = current_courses.courses;
        for (const data of tab_data) {
          const course = courseTemplate.content.cloneNode(true).children[0];
          const img = course.querySelector(".course-img");
          img.src = data.image;
          img.alt = data.title;
          let title = course.querySelector(".course-title");
          title.innerText = data.title;
          let instructor = course.querySelector(".instructor");
          instructor.innerText = "";
          for (let j = 0; j < data.instructors.length - 1; j++) {
            instructor.innerText += data.instructors[j].name;
            instructor.innerText += ", ";
          }
          instructor.innerText += data.instructors[data.instructors.length - 1].name;
          let rate_all = course.querySelector(".rate");
          let rate = course.querySelector(".rate-no");
          let rate_no = Math.round(data.rating * 10) / 10;
          rate.innerText = rate_no;
          let rating_stars = createRatingStars(rate_no);
          rate_all.appendChild(rating_stars);

          let price = course.querySelector(".price");
          price.innerText = "E£" + data.price
          coursesList.append(course);
        }
      }
    )
}

tab_display();

/// event listener of tabs

for (const tab of tabs) {
  const clicked_tab = document.getElementById(tab);
  if (clicked_tab) {
    clicked_tab.addEventListener('click', () => {
      coursesList.innerHTML = "";
      current_tab = tab;
      tab_display();
    });
  }
}



/// search filter  

form.addEventListener('submit', (event) => {
  event.preventDefault();
  search_text = document.querySelector(".search-textbox").value.toLowerCase();
  let crs = coursesList.querySelectorAll(".course");
  console.log(search_text, crs.length);
  for (let i = 0; i < crs.length; i++) {
    const title = crs[i].querySelector(".course-title");

    if (title.innerText.toLowerCase().indexOf(search_text) > -1) {
      crs[i].style.display = "";
    } else {
      crs[i].style.display = "none";
    }
  }
});

