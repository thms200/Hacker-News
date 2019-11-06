// Top Stories
// 예를 들어, Top Stories는 아래의 주소로 AJAX 요청을 보내 Item ID정보를 받을 수 있습니다.

// $.get('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty', function (list) {
//   console.log(list); // [ 123, 456, 789 ] 아이템 ID들
// });

// Item Details
// 위의 요청에서 받은 ID를 이용하여 아래와 같이 각 스토리에 대한 상세 정보를 받을 수 있습니다.
//

// $.get('https://hacker-news.firebaseio.com/v0/item/123.json?print=pretty', function (item) {
//   console.log(item); // 123이라는 ID를 가진 스토리에 대한 상세 정보
// });

const storyID = []; //Top Stories 10개 (고유 item id 10개)
const storyID_Item = []; //item id 별 정보

let content = document.querySelector(".contents");
// let span_url = document.querySelectorAll(".span_url");

// storyID (출차: https://github.com/HackerNews/API)
fetch("https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty")
.then(function(response){
  return response.json();
})
.then(function(json) {
  let data = json.slice(0, 5);
  storyID.push(data);
  return storyID[0];
})
.then(function(arr){
  for (let i = 0; i < arr.length; i++) {
    let url = "https://hacker-news.firebaseio.com/v0/item/"+arr[i]+".json?print=pretty";
    fetch(url)
    .then(function(response){
      return response.json();
    })
    .then(function(json){
      // storyID_Item.push(json);
      storyID_Item[i] = json; //Top Stories에서 반환받은 배열 내의 ID 순서와 실제로 화면에 그려진 Item List의 순서가 일치
      if (storyID_Item.length === 5) {
        makeList(storyID_Item);

        console.log(storyID_Item); // item 정보

        let td_title = document.querySelectorAll(".td_title");
        for (let i = 0; i < td_title.length; i++) {
          td_title[i].addEventListener("click", makeUrl.bind(null, storyID_Item));
        }
      }
    });
  }
});

function makeList (data) {
  let number = 1; //item list numbering
  for(let i = 0; i < data.length; i++) {
    //(main) item number + vote + title + url
    let tr_main = document.createElement("tr");
    tr_main.classList.add("tr_main");

    let td_number = document.createElement("td"); //item number
    td_number.classList.add("td_number");
    td_number.innerHTML = number + ".";
    number++;

    let td_triangle = document.createElement("td"); //item upvote (point 수 올리는 것으로 판단됨;)
    let span_triangle = document.createElement("span");
    span_triangle.classList.add("span_triangle");

    let td_title = document.createElement("td"); //item title
    td_title.classList.add("td_title");
    td_title.innerHTML = data[i].title;

    let span_url = document.createElement("span"); //item url
    span_url.classList.add("span_url");
    let url = data[i].url;
    if (url.slice(0,11) === "https://www") {
      url = url.split("https://www.").join(" ").split("/")[0].trim();
    } else if(url.slice(0,10) === "http://www") {
      url = url.split("http://www.").join(" ").split("/")[0].trim();
    } else if(url.slice(0,8) === "https://") {
      url = url.split("https://").join(" ").split("/")[0].trim();
    } else if(url.slice(0,7) === "http://") {
      url = url.split("http://").join(" ").split("/")[0].trim();
    }
    span_url.innerHTML = "("+ url + ")";

    tr_main.appendChild(td_number);
    tr_main.appendChild(td_triangle);
    td_triangle.appendChild(span_triangle);
    tr_main.appendChild(td_title);
    td_title.appendChild(span_url);

    //(sub) item point + user name + hide button + comments 수
    let tr_sub = document.createElement("tr");
    tr_sub.classList.add("tr_sub");

    let td_space = document.createElement("td"); //sub 시작 공백
    td_space.colSpan = "2";

    let td_contents = document.createElement("td"); //item contents (point로 시작)
    td_contents.classList.add("td_contents");
    td_contents.innerHTML = data[i].score + " points by ";

    let span_user = document.createElement("span"); //item user name;
    span_user.classList.add("span_user");
    span_user.innerHTML = data[i].by;

    let span_division_zero = document.createElement("span"); // " " 
    span_division_zero.innerHTML = " ";

    let span_time = document.createElement("span"); //item time;
    span_time.classList.add("span_time");
    let time = 0;
    let time_unit = "";

    let today = new Date();
    let today_month = today.getMonth();
    let today_date = today.getDate();
    let today_hour = today.getHours();
    let today_minute = today.getMinutes();

    let itemTime = new Date(data[i].time * 1000);
    let timeTime_month = itemTime.getMonth();
    let timeTime_date = itemTime.getDate();
    let timeTime_hour = itemTime.getHours();
    let timeTime_minute = itemTime.getMinutes();

    if(today_month !== timeTime_month) {
      time = Math.floor(today_month - timeTime_month);
      time_unit = "months"
    } else if (today_date !== timeTime_date) {
      time = Math.floor(today_date - timeTime_date);
      time_unit = "days"
    } else if (today_hour !== timeTime_hour) {
      time = Math.floor(today_hour - timeTime_hour);
      time_unit = "hours"
    } else if (today_minute !== timeTime_minute) {
      time = Math.floor(today_minute - timeTime_minute);
      time_unit = "minutes"
    }

    span_time.innerHTML = " " + time + " " + time_unit + " ago";

    let span_division_one = document.createElement("span"); // "|" 
    span_division_one.innerHTML = " | ";

    let span_hide = document.createElement("span"); //hide button
    span_hide.classList.add("span_hide");
    span_hide.innerHTML = "hide";

    let span_division_second = document.createElement("span"); // "|" 
    span_division_second.innerHTML = " | ";

    let span_comment = document.createElement("span_comment") //item comment 수
    span_comment.classList.add("span_comment");
    span_comment.innerHTML = data[i].descendants + " comments";

    tr_sub.appendChild(td_space);
    tr_sub.appendChild(td_contents);
    td_contents.appendChild(span_user);
    td_contents.appendChild(span_division_zero);
    td_contents.appendChild(span_time);
    td_contents.appendChild(span_division_one);
    td_contents.appendChild(span_hide);
    td_contents.appendChild(span_division_second);
    td_contents.appendChild(span_comment);

    //(space) 간격 유지
    let tr_space = document.createElement("tr");
    tr_space.classList.add("tr_space");

    content.appendChild(tr_main);
    content.appendChild(tr_sub);
    content.appendChild(tr_space);
  }
};

function makeUrl (data) {
  let click_title = event.target.innerText;
  click_title = click_title.split("(")[0];
  for (let i = 0 ; i < data.length; i++) {
    let check_title = data[i].title;

    if (check_title === click_title) {
      window.open(data[i].url);
    }
  }
}
