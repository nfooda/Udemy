
let form = document.querySelector('form');

let search_text = "";
const coursesExplorerTitle = document.querySelector('.courses-explore-header-title');
const coursesExplorerDesc = document.querySelector('.courses-explore-header-par');
const coursesList = document.querySelector('.courses-list');
const courseTemplate = document.querySelector("#courses-list");

let courses = [];


/// display all courses
fetch("http://localhost:3000/python")
  .then(res => res.json())
  .then((json) => {
    let data = json.courses;
    coursesExplorerTitle.innerText = json.header;
    coursesExplorerDesc.innerText = json.description;

    courses = data.map((data) => {

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
      let rate = course.querySelector(".rate-no");
      rate.innerText = Math.round(data.rating * 10) / 10;
      let price = course.querySelector(".price");
      price.innerText = "E£" + data.price;

      coursesList.append(course);
    })

  }).catch(err => console.log(err));



/// search filter  

form.addEventListener('submit', (event) => {
  event.preventDefault();
  search_text = document.querySelector(".search-textbox").value.toLowerCase();
  let crs = coursesList.querySelectorAll(".course");
  console.log(search_text, crs.length);
  for (let i = 0; i < crs.length; i++) {
    const title = crs[i].querySelector(".course-title");

    // console.log(title.innerText);
    if (title.innerText.toLowerCase().indexOf(search_text) > -1) {
      // console.log("true");
      crs[i].style.display = "";
    } else {
      // console.log("false");
      crs[i].style.display = "none";
    }
  }
});

