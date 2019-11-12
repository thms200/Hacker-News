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

const storyID = []; //Top Stories(고유 item id)
const storyID_Item = []; //item id 별 정보
let itemNumber = 0; //화면에 나타낼 item 숫자 
const itemNumber_fix = 5; //화면에 구현하고 싶은 item list 갯수
let tdListNumber = 1; //section - table tag에 들어가는 숫자 (item list numbering)
let moreCheckValue = 1; //more 버튼을 클릭할 때 검증하는 숫자

let content = document.querySelector(".contents"); //item list가 만들어지는 table-tbody tag
let mainTable = document.querySelector(".main-table"); //item list가 만들어지는 table tag
let selectUrlAddress;
let checkUrl;

const selectHead = [
  ["Hacker Newsdata", "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty"],
  ["newdata", "https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty"],
  ["pastdata", "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty"], //past는 top story로 대체
  ["commentsdata", "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty"], //comments는 top story로 대체
  ["askdata", "https://hacker-news.firebaseio.com/v0/askstories.json?print=pretty"],
  ["showdata", "https://hacker-news.firebaseio.com/v0/showstories.json?print=pretty"],
  ["jobsdata", "https://hacker-news.firebaseio.com/v0/jobstories.json?print=pretty"]
];

let selectHead_value; //선택한 data의 url

//활용할 ID list(main, new, ask, show, job) url 선택하기 (출처: https://github.com/HackerNews/API)
function selectUrl (event) {
  if(selectHead_value === undefined) {
    selectUrlAddress = selectHead[0][1];
  } else {
    if(event.target.className === "main-img") {
      selectUrlAddress = selectHead[0][1];
    }
    let value = event.target.innerHTML + "data";
    for (let i = 0; i < selectHead.length; i++) {
      if (selectHead[i][0] === value) {
        selectUrlAddress = selectHead[i][1];
      }
    }
    removeHeaderActive(event.target.className);
  }
  
  console.log("select URL: ", selectUrlAddress);
  selectHead_value 
    = fetch(selectUrlAddress)
      .then(function(response){
        return response.json();
      });
}

//선택한 ID list 별 정보(user, time, title 등) 가져오기
function makeData (value) {
  value.then(function(json) {
    let data;
    if(moreCheckValue === 1) { //more를 클릭하지 않았다면
      itemNumber = itemNumber + itemNumber_fix;
      data = json.slice(0, itemNumber);
    } else { //more를 클릭했다면
      data = json.slice(itemNumber, itemNumber + itemNumber_fix);
      itemNumber = itemNumber + itemNumber_fix;
    }

    let checkstoryID = json.slice(0,10);
    console.log("10ea item list", checkstoryID);

    storyID[0] = data;
    return storyID[0];
  })
  .then(function(arr){
    storyID_Item.length = 0;
    for (let i = 0; i < arr.length; i++) {
      let url = "https://hacker-news.firebaseio.com/v0/item/"+arr[i]+".json?print=pretty";
      fetch(url)
      .then(function(response){
        return response.json();
      })
      .then(function(json){ 
        storyID_Item[i] = json; //Top Stories에서 반환받은 배열 내의 ID 순서와 실제로 화면에 그려진 Item List의 순서가 일치
        if (storyID_Item.length === itemNumber_fix && checkArr(storyID_Item) === true) {
          makeList(storyID_Item);
          makeMore();
  
          console.log("item list data: ",storyID_Item); // item 정보
  
          let more = document.querySelector(".td_text");
          more.addEventListener("click", makeData.bind(null, selectHead_value));
        }
      });
    }
  });
}

//Main Page 만들기
function makeList (data) { //
  checkUrl = selectUrlAddress.slice(38,41);
  console.log("checkUrl: ",checkUrl)
  if (content.children.length !== 0) {
    content.remove();
  }
  content = document.createElement("tbody");
  content.classList.add("contents");
  mainTable.appendChild(content);

  makeTrSpace(content);

  if(checkUrl === "sho" || checkUrl === "job") {
    makeShowJobTrInfo(content, checkUrl);
  }

  for (let i = 0; i < data.length; i++) {
    //(main) item number + vote + title + url
    let tr_main = document.createElement("tr");
    tr_main.classList.add("tr_main");
    content.appendChild(tr_main);

    if(checkUrl !== "job") {
      makeTdNumber(tr_main);
      makeTdTriangle(tr_main);
    } else {
      makeTdSpaceOne(tr_main);
    }
    makeTdTitle(tr_main, data[i].title, data[i].url);
    
    //(sub) item point + user name + hide button + comments 수
    let tr_sub = document.createElement("tr");
    tr_sub.classList.add("tr_sub");
    content.appendChild(tr_sub);
    
    if(checkUrl !== "job") {
      makeTdSpaceTwo(tr_sub);
    } else {
      makeMoreCheckValue();
      makeTdSpaceOne(tr_sub);
    }

    let td_contents = document.createElement("td"); //item contents (point로 시작)
    td_contents.classList.add("td_contents");
    tr_sub.appendChild(td_contents);

    if(checkUrl !== "job") {
      makeTdPointUser(td_contents, data[i].score, data[i].by); 
      makeTime(td_contents, data[i].time);  
      makeDivision(td_contents);
      if(checkUrl === "top" || checkUrl === "new") {
        makeHide(td_contents);
        makeDivision(td_contents);
        if(checkUrl === "new") {
          makePastWeb(td_contents);
          makeDivision(td_contents);
        }
        makeCommentNumber(td_contents, data[i].descendants);
      } else  {
        makeCommentNumber(td_contents, data[i].descendants);
      }
    } else {
      makeTime(td_contents, data[i].time);  
    }

    //(space) 간격 유지
    makeTrSpace(content);
  }
}

function makeTdNumber (element) {
  let td_number = document.createElement("td"); //item number
  td_number.classList.add("td_number");
  td_number.innerHTML = tdListNumber + ".";
  tdListNumber++;
  element.appendChild(td_number);
  makeMoreCheckValue();
}

function makeTdTriangle (element) {
  let td_triangle = document.createElement("td"); //item upvote (point 수 올리는 것으로 판단됨;)
  let span_triangle = document.createElement("span");
  span_triangle.classList.add("span_triangle");
  td_triangle.appendChild(span_triangle);
  element.appendChild(td_triangle);
}

function makeTdTitle (element, dataTitle, dataUrl) {
  let td_title = document.createElement("td"); //item title
  td_title.classList.add("td_title");
  let td_title_a = document.createElement("a");
  td_title_a.classList.add("td_title_a");
  td_title_a.innerHTML = dataTitle;
  td_title_a.setAttribute("href", dataUrl);
  td_title.appendChild(td_title_a);
  element.appendChild(td_title);

  let url = dataUrl;
    if(url !== undefined) {
      let span_url = document.createElement("span"); //item url
      span_url.classList.add("span_url");
      if (url.slice(0,11) === "https://www") {
        url = url.split("https://www.").join(" ").split("/")[0].trim();
      } else if (url.slice(0,10) === "http://www") {
        url = url.split("http://www.").join(" ").split("/")[0].trim();
      } else if (url.slice(0,8) === "https://") {
        url = url.split("https://").join(" ").split("/")[0].trim();
      } else if (url.slice(0,7) === "http://") {
        url = url.split("http://").join(" ").split("/")[0].trim();
      }
      span_url.innerHTML = "("+ url + ")";
      td_title.appendChild(span_url);
    }
}

function makeTdSpaceOne (element) {
  let td_space = document.createElement("td"); //sub 시작 공백
  td_space.style.width = "5px";
  element.appendChild(td_space);
}

function makeTdSpaceTwo (element) {
  let td_space = document.createElement("td"); //sub 시작 공백
  td_space.colSpan = "2";
  element.appendChild(td_space);
}

function makeTdPointUser(element, dataPoint, dataUser) {
  element.innerHTML = dataPoint + " points by "; //itme point 갯수

  let span_user = document.createElement("span"); //item user name;
  span_user.classList.add("span_user");
  span_user.innerHTML = dataUser;

  let span_division_zero = document.createElement("span"); // " " 
  span_division_zero.innerHTML = " ";

  element.appendChild(span_user);
  element.appendChild(span_division_zero);
}

function makeTime (element, dataTime) {
  let span_time = document.createElement("span"); //item time;
  span_time.classList.add("span_time");
  
  let today = new Date();
  let today_month = today.getMonth();
  let today_date = today.getDate();
  let today_hour = today.getHours();
  let today_minute = today.getMinutes();
  
  let itemTime = new Date(dataTime * 1000);
  let timeTime_month = itemTime.getMonth();
  let timeTime_date = itemTime.getDate();
  let timeTime_hour = itemTime.getHours();
  let timeTime_minute = itemTime.getMinutes();
  
  let timeDiff = today - itemTime;
  let changeTimeDiff = timeDiff / (1000*60*60); //일 차이
  let time = Math.floor(changeTimeDiff);
  let time_unit = "minutes";

  if (today_month !== timeTime_month) {
    time = Math.floor(today_month - timeTime_month);
    time_unit = "months";
  } else if (today_date !== timeTime_date) {
    time = Math.floor(today_date - timeTime_date);
    time_unit = "days";
  } else if (today_hour !== timeTime_hour && time !== 0) {
    time_unit = "hours"
  } else if (today_minute !== timeTime_minute) {
    changeTimeDiff = timeDiff / (1000*60);
    time = Math.round(changeTimeDiff);
  } else {
    time = 0;
  }

  span_time.innerHTML = " " + time + " " + time_unit + " ago";

  element.appendChild(span_time);
}

function makeDivision (element) {
  let span_division = document.createElement("span"); // "|" 
  span_division.innerHTML = " | ";
  element.appendChild(span_division);
}

function makeCommentNumber (element, dataCommentValue) {
  let span_comment = document.createElement("span_comment"); //item comment 수
  span_comment.classList.add("span_comment");
  if(dataCommentValue === 0) {
    span_comment.innerHTML = "discuss";
  } else {
    span_comment.innerHTML = dataCommentValue + " comments";
  }
  element.appendChild(span_comment);
}

function makeHide (element) {
  let span_hide = document.createElement("span"); //hide button
  span_hide.classList.add("span_hide");
  span_hide.innerHTML = "hide";
  element.appendChild(span_hide);
}

function makePastWeb (element) {
  let span_past = document.createElement("span"); //past button
  span_past.classList.add("span_past");
  span_past.innerHTML = "past";
  element.appendChild(span_past);

  let span_division = document.createElement("span"); // "|" 
  span_division.innerHTML = " | ";
  element.appendChild(span_division);

  let span_web = document.createElement("span"); //web button
  span_web.classList.add("span_web");
  span_web.innerHTML = "web";
  element.appendChild(span_web);
}

function makeMoreCheckValue () {
  moreCheckValue++;
}

function makeTrSpace (element) {
  let tr_space = document.createElement("tr");
  tr_space.classList.add("tr_space");
  element.appendChild(tr_space);
}

//"show/Job" 선택했을 떄 윗 부분 화면에 나오는 코멘트
function makeShowJobTrInfo (element, value) {
  let trInfo = document.createElement("tr");
  trInfo.classList.add("tr_info");
  element.insertBefore(trInfo, element.firstChild.nextSibling);

  trInfo.previousSibling.style.height = "8px";
  makeTrSpace(content);
  trInfo.nextSibling.style.height = "8px";

  let trInfo_td = document.createElement("td");
  let trInfo_td_space = document.createElement("td");
  let trInfo_td_a_one = document.createElement("a");
  let trInfo_td_span_one = document.createElement("span");
  let trInfo_td_a_two = document.createElement("a");
  let trInfo_td_span_two = document.createElement("span");
  let trInfo_td_a_three = document.createElement("a");
  let trInfo_td_span_three = document.createElement("span");
  
  if(value === 'sho') {
    trInfo_td_space.colSpan = "2";
    trInfo_td.innerHTML = "Please read the ";
    trInfo_td_a_one.innerHTML = "rules";
    trInfo_td_a_one.setAttribute("href", "https://news.ycombinator.com/showhn.html");
    trInfo_td_span_one.innerHTML = ". You can also browse the ";
    trInfo_td_a_two.innerHTML = "newest";
    trInfo_td_a_two.setAttribute("href", "https://news.ycombinator.com/shownew");
    trInfo_td_span_two.innerHTML = " Show HNs.";
  } else if (value === "job") {
    trInfo_td_space.style.width = "5px";
    trInfo_td.innerHTML = "These are jobs at YC startups. See more at ";
    trInfo_td_a_one.innerHTML = "Work at a Startup";
    trInfo_td_a_one.setAttribute("href", "https://www.workatastartup.com/");
    trInfo_td_span_one.innerHTML = ", ";
    trInfo_td_a_two.innerHTML = "Triplebyte";
    trInfo_td_a_two.setAttribute("href", "https://triplebyte.com/?ref=yc_jobs");
    trInfo_td_span_two.innerHTML = ", ";
    trInfo_td_a_three.innerHTML = "Key Value";
    trInfo_td_a_three.setAttribute("href", "https://www.keyvalues.com/yc-funded-companies");
    trInfo_td_span_three.innerHTML = ".";
  }

  trInfo.appendChild(trInfo_td_space);
  trInfo.appendChild(trInfo_td);
  trInfo_td.appendChild(trInfo_td_a_one);
  trInfo_td.appendChild(trInfo_td_span_one);
  trInfo_td.appendChild(trInfo_td_a_two);
  trInfo_td.appendChild(trInfo_td_span_two);
  trInfo_td.appendChild(trInfo_td_a_three);
  trInfo_td.appendChild(trInfo_td_span_three);
}

//storyID_Item의 값이 모두 채워진 상태로 다음 단계(makeList함수)로 넘어가도록 중간 check함.
function checkArr (arr) {
  let value = true;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === undefined) {
      value = false;
      break;
    }
  } return value;
}

//"More" + 구분선 구현
function makeMore () {
  //More 작성
  let tr_more = document.createElement("tr");
  tr_more.classList.add("tr_more");

  if(checkUrl !== "job") {
    makeTdSpaceTwo(tr_more);
  } else {
    makeTdSpaceOne(tr_more);
  }

  let td_text = document.createElement("td"); //'more' text
  td_text.classList.add("td_text");
  td_text.innerHTML = "More";
  
  //구분선(주황색)
  let tr_line = document.createElement("tr");
  let td_line = document.createElement("td");
  td_line.colSpan = "3";
  td_line.classList.add("td_line");

  //space 주기
  let tr_space = document.createElement("tr");
  tr_space.classList.add("tr_space");
  
  tr_more.appendChild(td_text);
  tr_line.appendChild(td_line);
  content.appendChild(tr_more);
  content.appendChild(tr_space);
  content.appendChild(tr_line);
}

//header ul-li, login 만들기
function makeHeader () {
  let header = document.querySelector("header");

  let mainContents = document.createElement("div");
  mainContents.classList.add("main-contents");
  header.appendChild(mainContents);

  let headerUl = document.createElement("ul");
  headerUl.classList.add("header-ul");
  mainContents.appendChild(headerUl);

  let main_title = document.createElement("div");
  main_title.classList.add("main-title");
  main_title.innerHTML = "Hacker News";
  mainContents.insertBefore(main_title, mainContents.firstChild);

  let headerText = ["new", "past", "comments", "ask", "show", "jobs", "submit"];
  for (let i = 0; i < headerText.length; i++) {
    let main_title_list = document.createElement("li");
    main_title_list.classList.add("main-title-list");
    main_title_list.innerHTML = headerText[i];

    headerUl.appendChild(main_title_list);

    if (i !== 6) {
      let division_li = document.createElement("li");
      division_li.innerHTML = " |";

      headerUl.appendChild(division_li);
    }
  }

  let login = document.createElement("div");
  login.classList.add("login");
  login.innerHTML = "login";
  header.appendChild(login);
}

//footer만들기
function makeFooter () {
  let footerUl = document.querySelector(".footer-ul");

  let footerText = ["Guidelines", "FAQ", "Support", "API", "Security", "Lists", "Bookmarklet", "Legal", "Apply to YC", "Contact"];
  let footerTextUrl = [
    "https://news.ycombinator.com/newsguidelines.html",
    "https://news.ycombinator.com/newsfaq.html",
    "mailto:thms0504@gmail.com",
    "https://github.com/HackerNews/API",
    "https://news.ycombinator.com/security.html",
    "https://news.ycombinator.com/lists",
    "https://news.ycombinator.com/bookmarklet.html",
    "https://www.ycombinator.com/legal/",
    "https://www.ycombinator.com/apply/",
    "mailto:thms0504@gmail.com"
  ];

  for (let i = 0 ; i < footerText.length; i++) {
    let footer_list = document.createElement("li");
    let footer_list_a = document.createElement("a");
    footer_list_a.innerHTML = footerText[i];
    footer_list_a.setAttribute("href", footerTextUrl[i]);

    footer_list.appendChild(footer_list_a);
    footerUl.appendChild(footer_list);

    if (i !== 9) {
      let division_li = document.createElement("li");
      division_li.innerHTML = "  |  ";

      footerUl.appendChild(division_li);
    }
  }

  let searchDiv = document.createElement("div");
  searchDiv.classList.add("search-div");

  let search_text = document.createElement("span");
  search_text.innerHTML = "Search: ";

  let search_input = document.createElement("input");
  search_input.setAttribute("type", "text");

  searchDiv.appendChild(search_text);
  searchDiv.appendChild(search_input);
  footerUl.parentElement.appendChild(searchDiv);
}

selectUrl(); //화면 첫 로딩 할 땐 maindata 선택하도록 setting
makeData(selectHead_value);
makeHeader();
makeFooter();

let header = document.querySelector("header"); //header tag
let headerList = document.querySelectorAll(".main-title-list"); //header tag 중 메뉴(new, past, job 등)

header.addEventListener("click", selectHeadFnc)

//header 메뉴를 누르면, 그에 맞는 정보로 화면 재구성
function selectHeadFnc (event) {
  let check = ["main-img", "main-title", "main-title-list header-active"];
  if(check.includes(event.target.className)) {
    tdListNumber = 1;
    itemNumber = 0;
    moreCheckValue = 1;
    selectUrl(event);
    makeData(selectHead_value);
  }
}

//선택된 header 메뉴 글자색 하얀색으로!
Array.prototype.forEach.call(headerList, function(element){
  element.addEventListener("click", function() {
    event.target.classList.add("header-active");

    let clickValue = event.target.innerText;
    Array.prototype.forEach.call(headerList, function (element){
      if(element.innerText !== clickValue) {
        element.classList.remove("header-active");
      }
    })
  })
})

//header-active class remove
function removeHeaderActive (value) {
  console.log(value)
  if(value === "main-title" || value === "main-img") {
    Array.prototype.forEach.call(headerList, function (element){
      element.classList.remove("header-active");
    })
  }
}
