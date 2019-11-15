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

let selectHead_name = null;

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
  login.classList.add("loginButton");

  let loginDiv = document.createElement("div");
  loginDiv.classList.add("loginDiv");
  loginDiv.innerHTML = "login";
  loginDiv.addEventListener("click", makeLoginLogout)
  login.appendChild(loginDiv);
  header.appendChild(login);

  makeHeaderFnc(header);

  let submit = document.querySelectorAll(".main-title-list");
  Array.prototype.forEach.call(submit, function(element){
    if(element.innerText === "submit") {
      element.addEventListener("click", makeSubmit);
    }
  })
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

let body = document.querySelector("body");
const checkUser = []; //입력한 아이디만 체크 (중복 가입 방지)
const userData = []; //입력한 아이디, 비번 담아두기
let isSumbit = false;

// login button click하면 화면 구성
function makeLoginLogout () {
  if(event.target.innerText === "login" || event.target.innerText === "submit") {
    deleteHTML();
    body.style.display = "block";
  
    let wrapper = document.createElement("div");
    wrapper.classList.add("wrapper");
    body.appendChild(wrapper);

    if(event.target.innerText === "submit") {
      let submitcommentdiv = document.createElement("div");
      submitcommentdiv.classList.add("submitcommentdiv");
      submitcommentdiv.innerText = "You have to be logged in to submit";
      wrapper.insertBefore(submitcommentdiv, wrapper.firstChild);
    }
  
    makeLoginPart(wrapper, "Login", "username : ", "password : ", "login");
    let comment = document.createElement("a");
    comment.classList.add("login_comment");
    comment.innerText = "Forgot your password?";
    wrapper.appendChild(comment);
    makeLoginPart(wrapper, "Create Account", "username : ", "password : ", "create account");
  } else { //logout을 할 때,
    deleteHTML(); //기존 화면 지우기
    makeIndex(); //기존 index.html 화면 만들기

    //아이템 list 화면 다시 불러오기
    tdListNumber = 1;
    itemNumber = 0;
    moreCheckValue = 1;
    makeData(selectHead_value);
    makeHeader();
    makeFooter();
    makeHeaderActive(selectHead_name);
  }
  if(userData.length !== 0) {
    for(let i = 0; i < userData.length; i++) {
      userData[i][2] = false;
    }
  }
}

//login or Create Account click하면 makeUser실행 -> login이 아니면 userData/checkUser 생성 -> login이면 doLogin함수 실행 
function makeUser () {
  let loginUser = document.getElementById('login_user');
  let loginPassword = document.getElementById('login_password');
  let createUser = document.getElementById('create_user');
  let createPassword = document.getElementById('create_password');

  if(event.target.value !== "login") {
    for(let i = 0; i < checkUser.length; i++) {
      if(checkUser[i] === createUser.value) {
        alert("You can not use this ID.");
      } 
    }
    if(!checkUser.includes(createUser.value)) {
      let userArr = [];
      userArr.push(createUser.value);
      userArr.push(createPassword.value);
      userArr.push(false);
      userData.push(userArr);
      checkUser.push(createUser.value);
      alert("Welcome! :)");
    }
  } else {
    doLogin(loginUser.value, loginPassword.value);
  }

  loginUser.value = '';
  loginPassword.value = '';
  createUser.value = '';
  createPassword.value = '';
  console.log("at makeUser",userData);
}

// login일 경우, 아이디가 없으면 가입하라고 알람, 아이디/비번을 잘못 누르면 재입력 알람, 아이디/비번 맞으면 기존 화면 나옴
function doLogin (user, password) {
  for(let i = 0; i < userData.length; i++) {
    if(user === userData[i][0] && password === userData[i][1]) {
      userData[i][2] = true; //Login한 user 표시;
      if(isSumbit === true) {
        makeSubmitScreen();
      } else {
        newScreen();
      }
    } 
  } 

  if(!checkUser.includes(user)) {
    alert("There is no username. Please join us.");
  } else if (checkUser.includes(user)) {
    for(let i = 0; i < userData.length; i++) {
      if(user === userData[i][0] && password !== userData[i][1]) {
        alert("Please enter again");
      } 
    }
  }
}

function makeSubmit () {
  let user = document.querySelector(".userDiv");
  isSumbit = true;
  if(!user) { //login이 되어있지 않은 상태면, login 화면 구성 -> login 누를 경우 첫화면 
    makeLoginLogout();
  } else { //login된 상황이면 submit 화면 구성 -> sumbit 누르면 첫화면 (item 추가는 미구현)
    makeSubmitScreen();
  }
}

function makeSubmitScreen () {
  deleteHTML();
  body.style.display = "flex";
  isSumbit = false;

  let newHeader = document.createElement("header");
  body.insertBefore(newHeader, body.firstChild);

  let newImg = document.createElement("img");
  newImg.setAttribute("src", "main.gif");
  newImg.classList.add("main-img");
  newHeader.appendChild(newImg);

  let headerTitle = document.createElement("div");
  headerTitle.classList.add("main-title");
  headerTitle.innerText = "Submit";
  newHeader.appendChild(headerTitle);

  let newSection = document.createElement("section");
  body.insertBefore(newSection, newHeader.nextSibling);

  makeSubmitScreen_space(newSection);
  makeSubmitScreen_section(newSection, "title", "text");
  makeSubmitScreen_section(newSection, "url", "text");
  let newSection_or = document.createElement("div");
  newSection_or.classList.add("submit_or");
  newSection_or.innerText = "or";
  newSection.appendChild(newSection_or);
  makeSubmitScreen_section(newSection, "text", "textarea");

  let newSection_submit = document.createElement("input");
  newSection_submit.classList.add("submit_button")
  newSection_submit.setAttribute("type", "button");
  newSection_submit.setAttribute("value", "submit");
  newSection_submit.setAttribute("onclick", "newScreen()")
  newSection.appendChild(newSection_submit);
  makeSubmitScreen_space(newSection);
  makeSubmitScreen_space(newSection);

  let newSection_info = document.createElement("div");
  newSection_info.classList.add("submint_info");
  newSection.appendChild(newSection_info);

  let newSection_info_comment = document.createElement("div");
  newSection_info_comment.innerHTML = "	Leave url blank to submit a question for discussion. If there is no url, the text (if any) will appear at the top of the thread.";
  newSection_info.appendChild(newSection_info_comment);

  let newSection_br = document.createElement("br");
  newSection_info.appendChild(newSection_br);

  let newSection_info_comment2 = document.createElement("div");
  newSection_info_comment2.innerText = "You can also submit via ";

  let newSection_info_comment2_span = document.createElement("span");
  let newSection_info_comment2_span_a = document.createElement("a");
  newSection_info_comment2_span_a.innerText = "bookmarket";
  newSection_info_comment2_span_a.setAttribute("href", "https://news.ycombinator.com/bookmarklet.html");
  newSection_info_comment2_span.appendChild(newSection_info_comment2_span_a)
  newSection_info_comment2.appendChild(newSection_info_comment2_span);
  newSection_info.appendChild(newSection_info_comment2);
  makeSubmitScreen_space(newSection);
}
