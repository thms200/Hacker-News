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

//Main Page 만들기
function makeList (data) { //
  checkUrl = selectUrlAddress.slice(38,41);
  if (content.children.length !== 0) {
    content.remove();
  }
  content = document.createElement("tbody");
  content.classList.add("contents");

  let mainTable = document.querySelector(".main-table"); 
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

function deleteHTML () {
  for(let i = body.children.length-1; i >= 0; i--) {
    if(body.children[i].tagName !== "SCRIPT") {
      body.children[i].remove();
    }
  }
}

function makeHeaderFnc (element) {
  element.addEventListener("click", selectHeadFnc)
  
  //header 메뉴를 누르면, 그에 맞는 정보로 화면 재구성
  function selectHeadFnc (event) {
    let check = ["main-img", "main-title", "main-title-list header-active"];
    if(check.includes(event.target.className)) {
      tdListNumber = 1;
      itemNumber = 0;
      moreCheckValue = 1;
      selectUrl(event);
      makeData(selectHead_value);
      selectHead_name = event.target.innerHTML;
    }

    if(event.target.className === "main-title" || event.target.className === "main-img") {
      Array.prototype.forEach.call(headerList, function (element){
        element.classList.remove("header-active");
      })
    }
  }
  
  let headerList = document.querySelectorAll(".main-title-list"); //header tag 중 메뉴(new, past, job 등)
  
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
}

function makeHeaderActive (value) {
  let mainTitleList = document.querySelectorAll(".main-title-list");
  for(let i = 0; i < mainTitleList.length; i++) {
    if(mainTitleList[i].innerHTML === value) {
      mainTitleList[i].classList.add("header-active");
    }
  }
}

function makeLoginPart (element, loginTitle, loginDivName_one, loginDivName_two, loginButtonValue) {
  let loginPart = document.createElement("div");
  loginPart.classList.add("loginPart");
  element.appendChild(loginPart);

  let loginPart_div = document.createElement("div");
  loginPart_div.classList.add("login_title")
  loginPart_div.innerText = loginTitle;
  loginPart.appendChild(loginPart_div);

  let loginPart_form = document.createElement("form");
  loginPart_form.classList.add("login_form");
  loginPart.appendChild(loginPart_form);

  let loginPart_form_div = document.createElement("div");
  loginPart_form_div.classList.add("login_div");
  loginPart_form.appendChild(loginPart_form_div);

  let loginPart_form_div_username = document.createElement("div");
  loginPart_form_div_username.classList.add("login_div_username");
  loginPart_form_div_username.innerHTML = loginDivName_one;
  loginPart_form_div.appendChild(loginPart_form_div_username);
  
  let loginPart_form_input = document.createElement("input");
  loginPart_form_input.setAttribute("type", "text");
  loginPart_form_input.setAttribute("name", "username");
  loginPart_form_div.appendChild(loginPart_form_input);
  
  let loginPart_form_div_two = document.createElement("div");
  loginPart_form_div_two.classList.add("login_div");
  loginPart_form.appendChild(loginPart_form_div_two);

  let loginPart_form_div_password = document.createElement("div");
  loginPart_form_div_password.classList.add("login_div_password");
  loginPart_form_div_password.innerHTML = loginDivName_two;
  loginPart_form_div_two.appendChild(loginPart_form_div_password);
  
  let loginPart_form_input_two = document.createElement("input");
  loginPart_form_input_two.setAttribute("type", "password");
  loginPart_form_input_two.setAttribute("name", "password");
  loginPart_form_div_two.appendChild(loginPart_form_input_two);
  
  let loginPart_form_input_button = document.createElement("input");
  loginPart_form_input_button.classList.add("login_button")
  loginPart_form_input_button.setAttribute("type", "button");
  loginPart_form_input_button.setAttribute("value", loginButtonValue);
  loginPart_form_input_button.setAttribute("onclick", "makeUser()");
  loginPart_form.appendChild(loginPart_form_input_button);
  
  if(loginTitle === "Login") {
    loginPart_form_input.id = "login_user"
    loginPart_form_input_two.id = "login_password"
  } else {
    loginPart_form_input.id = "create_user"
    loginPart_form_input_two.id = "create_password"
  }
}

function makeIndex () {
  body.style.display = "flex";

  let newHeader = document.createElement("header");
  body.insertBefore(newHeader, body.firstChild);

  let newImg = document.createElement("img");
  newImg.setAttribute("src", "main.gif");
  newImg.classList.add("main-img");
  newHeader.appendChild(newImg);

  let newSection = document.createElement("section");
  body.insertBefore(newSection, newHeader.nextSibling);

  let newTable = document.createElement("table");
  newTable.classList.add("main-table");
  newSection.appendChild(newTable);

  let newTbody = document.createElement("tbody");
  newTbody.classList.add("contents");
  newTable.appendChild(newTbody);

  let newTr = document.createElement("tr");
  newTr.classList.add("tr_space");
  newTbody.appendChild(newTr);

  let newFooter = document.createElement("footer");
  body.insertBefore(newFooter, newSection.nextSibling);

  let newUl = document.createElement("ul");
  newUl.classList.add("footer-ul");
  newFooter.appendChild(newUl);

  content = document.querySelector(".contents"); 
  header = document.querySelector("header"); //header tag
  headerList = document.querySelectorAll(".main-title-list"); //header tag 중 메뉴(new, past, job 등)
  body = document.querySelector("body");
}
